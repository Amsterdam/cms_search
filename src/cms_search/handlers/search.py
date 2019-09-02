import logging
import json
import typing as T
from collections import defaultdict

import aiohttp
from aioelasticsearch import Elasticsearch
from aiohttp import web
from urllib import parse as urlparse
from cms_search import metrics

_logger = logging.getLogger(__name__)

TYPEAHEAD_RESULT = 1
SEARCH_RESULT = 2
SEARCH_PAGE_SIZE = 10


def replace_query_param(url, key, val):
    """
    Given a URL and a key/val pair, set or replace an item in the query
    parameters of the URL, and return the new URL.
    """
    (scheme, netloc, path, query, fragment) = urlparse.urlsplit(str(url))
    query_dict = urlparse.parse_qs(query, keep_blank_values=True)
    query_dict[str(key)] = [str(val)]
    query = urlparse.urlencode(sorted(list(query_dict.items())), doseq=True)
    return urlparse.urlunsplit((scheme, netloc, path, query, fragment))


def remove_query_param(url, key):
    """
    Given a URL and a key/val pair, remove an item in the query
    parameters of the URL, and return the new URL.
    """
    (scheme, netloc, path, query, fragment) = urlparse.urlsplit(str(url))
    query_dict = urlparse.parse_qs(query, keep_blank_values=True)
    query_dict.pop(key, None)
    query = urlparse.urlencode(sorted(list(query_dict.items())), doseq=True)
    return urlparse.urlunsplit((scheme, netloc, path, query, fragment))


async def search_articles(request):
    return await search(request, ["article"], SEARCH_RESULT)


async def search_publications(request):
    return await search(request, ["publication"], SEARCH_RESULT)

async def search_specials(request):
    return await search(request, ["special"], SEARCH_RESULT)


async def typeahead(request):
    return await search(request, ["publication", "article"], TYPEAHEAD_RESULT)


async def search(request, types:list, result_type: int):
    # language=rst
    """Run search.
    """
    with metrics.REQUEST_TIME.time():
        q = request.query.get('q', '').strip()
        if result_type == SEARCH_RESULT:
            page = request.query.get('page', '1')
            page = int(page) if page.isdigit() else 1
            offset = (page - 1) * SEARCH_PAGE_SIZE
            page_size = SEARCH_PAGE_SIZE
        else:
            offset = 0
            page_size = request.app.config['global_search_config']['max_results']

        min_query_length = request.app.config['global_search_config']['min_query_length']
        # only perform search for queries longer than min_query_length
        if result_type == TYPEAHEAD_RESULT and len(q) < min_query_length:
            return web.json_response([])
        results = []
        endpoint =  request.app['search_endpoints']['typeahead']
        result = await endpoint.search(request, q, types, result_type, offset, page_size)
        if isinstance(result, list):
            results.extend(result)
        elif isinstance(result, dict):
            results = result
        return web.json_response(results)


class ElasticSearchEndpoint:

    def __init__(self, app: aiohttp.web.Application, es_host:str, connect_timeout: int,
                 max_results: int, cms_url: str, index:str, read_timeout: T.Optional[float]):
        self.es_host = es_host
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
            host= self.es_host,
            sniff_timeout = self.read_timeout  # default 0.1
        )

    async def deinitialize(self, app):
        await self.session.close()

    async def search(self, q: str, authorization_header: T.Optional[str]) -> T.List[dict]:
        raise NotImplementedError()

    def es_query(self, q:str, types:list, from1=0, size=15):

        should = ''
        q_list = q.split()
        if q:
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
                    "field_intro": {{
                      "value": "{q_list[i]}",
                      "boost": 2.0
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
            minimum_should_match = ', "minimum_should_match" : 1'
        else:
            minimum_should_match = ''

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
              }}{minimum_should_match}
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

    async def search(self, request, q: str, types: list, result_type: int, offset: int, page_size: int) -> T.List[dict]:

        # Default localhost 9200. Index is last part of path
        drupal_selector = '/jsonapi/node/'

        body = self.es_query(q, types, offset, page_size)
        for retry in range(2):  # Retry once
            try:
                response = await self.session.search(index=self.index, body=body, size=self.max_results)
                break
            except Exception as e:
                if retry == 0:
                    await self.deinitialize(None)
                    await self.initialize(None)
                else:
                    raise e

        total_results = {elem['key']: elem['doc_count'] for elem in
                         response['aggregations']['count_by_type']['buckets']}
        if 'hits' in response:
            hits = response['hits']['hits']
            if len(hits) > 0:
                if result_type == TYPEAHEAD_RESULT:
                    buckets = defaultdict(list)
                    for hit in hits:
                        buckets[hit['_source']['type'][0]].append({
                            '_display': hit['_source']['field_short_title'][0],
                            'uri': f"{self.cms_url}{drupal_selector}{hit['_source']['type'][0]}/\
                            {hit['_source']['uuid'][0]}",
                        })
                    label_map = {
                        'publication': "Publications",
                        'article': 'Articles'
                    }
                    result_list = [{
                        "label": label_map[key],
                        "content": value,
                        "total_results": total_results[key]
                    } for key, value in buckets.items()]
                    return result_list
                elif result_type == SEARCH_RESULT:
                    total = response['hits']['total']
                    page = int(offset / page_size) + 1
                    url = request.url
                    if page > 1:
                        prev_page = page - 1
                        if prev_page == 1:
                            prev_url = remove_query_param(url, 'page')
                        else:
                            prev_url = replace_query_param(url, 'page', page - 1)
                    else:
                        prev_url = None
                    if total > page * page_size:
                        next_url = replace_query_param(url, 'page', page + 1)
                    else:
                        next_url = None

                    result_list = []
                    for hit in hits:
                        source = hit['_source']
                        title = source['title'][0] if 'title' in source else None
                        body = source['body'][0] if 'body' in source else None
                        intro = source['field_intro'][0] if 'field_intro' in source else None
                        display = source['field_short_title'][0] if 'field_short_title' in source else title
                        element = {
                            "_links": {
                                "self": {
                                    "href": f"{self.cms_url}{drupal_selector}{source['type'][0]}/\
                                    {source['uuid'][0]}",
                                }
                            },
                            "type": source['type'][0],
                            "nid": source['nid'][0],
                        }
                        if title:
                            element['title'] = title
                        if body:
                            element['body'] = body
                        if intro:
                            element['intro'] = intro
                        if display:
                            element['_display'] = display

                        result_list.append(element)
                    return {

                        "_links": {
                            "self": {
                                "href": str(url)
                            },
                            "next": {
                                "href": str(next_url)
                            },
                            "prev": {
                                "href": str(prev_url)
                            }
                        },
                        "count": total,
                        "results": result_list
                    }
        else:
            return []
