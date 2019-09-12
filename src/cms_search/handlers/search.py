from datetime import datetime
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


async def search(request, types: list, result_type: int):
    # language=rst
    """Run search.
    """
    with metrics.REQUEST_TIME.time():
        q = request.query.get('q', '').strip()
        if result_type == SEARCH_RESULT:
            page = request.query.get('page', '1')
            page = int(page) if page.isdigit() else 1
            page_size = request.query.get('page_size', str(SEARCH_PAGE_SIZE))
            page_size = int(page_size) if page_size.isdigit() else SEARCH_PAGE_SIZE
            offset = (page - 1) * page_size
        else:
            offset = 0
            page_size = request.app.config['search_config']['max_results']

        min_query_length = request.app.config['search_config']['min_query_length']
        # only perform search for queries longer than min_query_length
        if result_type == TYPEAHEAD_RESULT and len(q) < min_query_length:
            return web.json_response([])
        results = []
        search1 = request.app['search']
        result = await search1.search(request, q, types, result_type, offset, page_size)
        if isinstance(result, list):
            results.extend(result)
        elif isinstance(result, dict):
            results = result
        return web.json_response(results)


class ElasticSearchEndpoint:

    def __init__(self, app: aiohttp.web.Application, elastic_host: str, elastic_port: int, connect_timeout: int,
                 max_results: int, cms_url: str, index: str, read_timeout: T.Optional[float]):
        self.elastic_host = elastic_host
        self.elastic_port = elastic_port
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
            host=self.elastic_host,
            port=self.elastic_port,
            sniff_timeout=self.read_timeout  # default 0.1
        )

    async def deinitialize(self, app):
        await self.session.close()

    async def search(self, request, q: str, types: list, result_type: int, offset: int, page_size: int) -> \
            T.Union[T.List[dict], T.Dict]:
        raise NotImplementedError()

    def es_query(self, q: str, types: list, from1=0, size1=15) -> str:

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
            sort = '"_score"'
        else:
            minimum_should_match = ''
            if "article" in types:
                sort = '{ "field_publication_date": { "order": "desc" }}'
            else:
                sort = '{ "changed": { "order": "desc" }}'

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
          "size": {size1},
          "sort": [{sort}],
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

    async def search(self, request, q: str, types: list, result_type: int, offset: int, page_size: int) -> \
            T.Union[T.List[dict], T.Dict]:

        # Default localhost 9200. Index is last part of path
        drupal_selector = '/jsonapi/node/'

        body = self.es_query(q, types, offset, page_size)
        for retry in range(2):  # Retry once
            try:
                response = await self.session.search(index=self.index, body=body)
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
                        source = hit['_source']
                        display = source['field_short_title'][0] if 'field_short_title' in source \
                            else source['title'][0]
                        buckets[source['type'][0]].append({
                            '_display': display,
                            'uri':\
                            f"{self.cms_url}{drupal_selector}{source['type'][0]}/{hit['_source']['uuid'][0]}",
                        })
                    label_map = {
                        'publication': "Publicaties",
                        'article': 'Artikelen'
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
                        intro = source['field_intro'][0] if 'field_intro' in source else None
                        display = source['field_short_title'][0] if 'field_short_title' in source else title
                        slug = source['field_slug'][0] if 'field_slug' in source else None
                        teaser_url = source['teaser_url'][0] if 'teaser_url' in source else None
                        field_teaser = source['field_teaser'][0] if 'field_teaser' in source else None
                        field_special_type = source['field_special_type'][0] if 'field_special_type' in source else None
                        field_publication_date = source['field_publication_date'][
                            0] if 'field_publication_date' in source else None
                        uuid = source['uuid'][0]
                        element = {
                            "_links": {
                                "self": {
                                    "href": f"{self.cms_url}{drupal_selector}{source['type' ][0]}/{uuid}",
                                }
                            },
                            "type": source['type'][0],
                            "nid": source['nid'][0],
                            "changed": str(datetime.fromtimestamp(source['changed'][0])),
                            "created": str(datetime.fromtimestamp(source['created'][0])),
                            "uuid": uuid
                        }
                        if title:
                            element['title'] = title
                        if intro:
                            element['intro'] = intro
                        if display:
                            element['_display'] = display
                        if slug:
                            element['slug'] = slug
                        if teaser_url:
                            element['teaser_url'] = teaser_url
                        if field_teaser:
                            element['field_teaser'] = field_teaser
                        if field_special_type:
                            element['field_special_type'] = field_special_type
                        if field_publication_date:
                            element['field_publication_date'] = str(datetime.fromtimestamp(field_publication_date))

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
