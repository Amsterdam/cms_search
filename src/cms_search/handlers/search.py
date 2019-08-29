import logging
import json
import typing as T
from collections import defaultdict

import aiohttp
from aioelasticsearch import Elasticsearch
from aiohttp import web
from cms_search import metrics

_logger = logging.getLogger(__name__)

TYPEAHEAD_RESULT = 1
SEARCH_RESULT = 2
SEARCH_PAGE_SIZE = 10


async def search_articles(request):
    return await search(request, ["article"], SEARCH_RESULT)


async def search_publications(request):
    return await search(request, ["publication"], SEARCH_RESULT)


async def typeahead(request):
    return await search(request, ["publication", "article"], TYPEAHEAD_RESULT)

async def search(request, types:list, result_type: int):
    # language=rst
    """Run search.
    """
    with metrics.REQUEST_TIME.time():
        q = request.query.get('q', '').strip()
        min_query_length = request.app.config['global_search_config']['min_query_length']
        # only perform search for queries longer than min_query_length
        if len(q) < min_query_length:
            return web.json_response([])
        results = []
        endpoint =  request.app['search_endpoints']['typeahead']
        result = await endpoint.search(q, types, result_type)
        if isinstance(result, list):
            results.extend(result)
        elif isinstance(result, dict):
            results = result
        return web.json_response(results)


class ElasticSearchEndpoint:

    def __init__(self, app: aiohttp.web.Application, connect_timeout: int,
                 max_results: int, cms_url: str, index:str, read_timeout: T.Optional[float]):
        self.connect_timeout = connect_timeout
        self.max_results = max_results
        self.cms_url = cms_url
        self.index = index
        self.read_timeout = read_timeout
        # placeholder (each endpoint gets an own connection pool)
        self.session: Elasticsearch = None
        # make sure everything is initialized and cleaned up
        app.on_startup.append(self.initialize)
        app.on_cleanup.append(self.deinitialize)

    async def initialize(self, app):
        self.session = Elasticsearch(
            sniff_timeout = self.read_timeout  # default 0.1
        )

    async def deinitialize(self, app):
        await self.session.close()

    async def search(self, q: str, authorization_header: T.Optional[str]) -> T.List[dict]:
        raise NotImplementedError()

    def es_query(self, q:str, types:list, from1=0, size=15):
        q_list = q.split()

        should = ''
        for i in range(len(q_list)):
            # for every term in the list do term query, only for the last a prefix
            # In Elastic Search 7 this would be a match_bool_prefix query
            if i == len(q_list) - 1:
                match_operator = 'prefix'
                continuation_comma = ''
            else:
                match_operator = 'term'
                continuation_comma = ','

            should += f"""
            {{
              "{match_operator}": {{
                "title": {{
                  "value": "{q_list[i]}",
                  "boost": 4.0 
                }}  
              }}
            }},
            {{   
              "{match_operator}": {{
                "processed": {{
                  "value": "{q_list[i]}",
                  "boost": 1.0
                }}
              }}
            }}{continuation_comma}
            """

        return f"""
        {{
          "query": {{
            "bool": {{
              "must": [],
              "must_not": [],
              "should": [ 
              {should} 
              ],
              "filter": {{
                "terms" : {{ "type" : {json.dumps(types)} }}
              }},
              "minimum_should_match" : 1
            }}
          }},
          "from": {from1},
          "size": {size},
          "sort": [],
          "aggs": {{
            "count_by_type": {{
              "terms": {{
                "field": "type"
                }}
             }}
          }}
        }}
        """


class ElasticSearchTypeAhead(ElasticSearchEndpoint):

    async def search(self, q: str, types: list, result_type: int) -> T.List[dict]:

        # Default localhost 9200. Index is last part of path
        drupal_selector = '/jsonapi/node/'

        body = self.es_query(q, types, 0, self.max_results)
        response = await self.session.search(index=self.index, body=body, size=self.max_results)
        # for retry in range(2):  # Retry once
        #     try:
        #         response = await self.session.search(index=self.index, body=body, size=self.max_results)
        #         break
        #     except Exception as e:
        #         self.deinitialize(None)
        #         self.initialize(None)

        total_results = { elem['key']: elem['doc_count'] for elem in response['aggregations']['count_by_type']['buckets']}
        if 'hits' in response and len(response['hits']['hits']) > 0:
            if result_type == TYPEAHEAD_RESULT:
                buckets = defaultdict(list)
                for hit in response['hits']['hits']:
                    buckets[hit['_source']['type'][0]].append({
                        '_display': hit['_source']['field_short_title'][0],
                        'uri': f"{self.cms_url}{drupal_selector}{hit['_source']['type'][0]}/{hit['_source']['uuid'][0]}",
                    })
                label_map = {
                    'publication': "Publications",
                    'article': 'Articles'
                }
                result_list = [{
                    "label": label_map[key],
                    "content": value,
                    "total_results": total_results[key]
                  } for key,value in buckets.items()]
                return result_list
            elif result_type == SEARCH_RESULT:

                result_list = [
                    {
                        "_links": {
                            "self": {
                                "href": f"{self.cms_url}{drupal_selector}{hit['_source']['type'][0]}/{hit['_source']['uuid'][0]}",
                            }
                        },
                        "type": hit['_source']['type'][0],
                        '_display': hit['_source']['field_short_title'][0],
                        "body": hit['_source']['processed'][0],
                        "title": hit['_source']['title'][0],
                        "nid": hit['_source']['nid'][0],
                    } for hit in response['hits']['hits']
                ]
                return {
                        "_links": {
                            "self": {
                                "href": "https://acc.api.data.amsterdam.nl/atlas/search/gebied/?q=prins&page=1"
                            },
                            "next": {
                                "href": None
                            },
                            "prev": {
                                "href": None
                            }
                        },
                        "count": response['hits']['total'],
                        "results": result_list
                    }
        else:
            return []
