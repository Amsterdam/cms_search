import logging
import typing as T
from collections import defaultdict

import aiohttp
from aioelasticsearch import Elasticsearch
from aiohttp import web
from cms_search import metrics

_logger = logging.getLogger(__name__)


async def typeahead(request):
    # language=rst
    """Run search.
    """
    with metrics.REQUEST_TIME.time():
        q = request.query.get('q', '').strip()
        min_query_length = request.app.config['global_search_config']['min_query_length']
        authz = request.headers.get('Authorization', None)
        # only perform search for queries longer than min_query_length
        if len(q) < min_query_length:
            return web.json_response([])
        results = []
        endpoint =  request.app['search_endpoints']['typeahead']
        result = await endpoint.search(q, authz)
        if isinstance(result, list):
            results.extend(result)
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
        self.session: aiohttp.client.ClientSession = None
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


class ElasticSearchTypeAhead(ElasticSearchEndpoint):

    async def search(self, q: str, authorization_header: T.Optional[str]) -> T.List[dict]:

        # Default localhost 9200. Index is last part of path
        drupal_selector = '/jsonapi/node/'
        from1 = 0
        size = self.max_results
        body = f"""
{{
  "query": {{
    "bool": {{
      "must": [],
      "must_not": [],
      "should": [
        {{
          "prefix": {{
            "title": {{
              "value" : "{q}",
              "boost": 4.0
             }}
          }}
        }},  
        {{
          "term": {{
            "processed": {{
               "value": "{q}",
                "boost": 0.5
             }}
          }}
        }}
      ],
      "filter": {{
        "terms" : {{ "type" : ["publication", "article"] }}
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
        label_map = {
            'publication': "Publications",
            'article': 'Articles'
        }
        response = await self.session.search(index=self.index, body=body, size=self.max_results)
        buckets = defaultdict(list)
        total_results = { elem['key']: elem['doc_count'] for elem in response['aggregations']['count_by_type']['buckets']}
        if 'hits' in response and len(response['hits']['hits']) > 0:
            for hit in response['hits']['hits']:
                buckets[hit['_source']['type'][0]].append({
                    '_display': hit['_source']['field_short_title'][0],
                    'uri': f"{self.cms_url}{drupal_selector}{hit['_source']['type'][0]}/{hit['_source']['uuid'][0]}",
                })

            result_list = [{
                "label": label_map[key],
                "content": value,
                "total_results": total_results[key]
              } for key,value in buckets.items()]
            return result_list
        else:
            return []

