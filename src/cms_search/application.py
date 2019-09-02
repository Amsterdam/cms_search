import logging.config
from os import getenv

from pkg_resources import resource_filename, resource_stream
import urllib.parse

from aiohttp import web
import aiohttp_cors
import config_loader
import yaml

from cms_search.handlers.search import ElasticSearchTypeAhead
from . import handlers

logger = logging.getLogger(__name__)

_OPENAPI_SCHEMA_RESOURCE = 'openapi.yml'
_CONFIG_SCHEMA_RESOURCE = 'config_schema.yml'


class Application(web.Application):
    # language=rst
    """The Application.
    """

    def __init__(self, config_path, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Initialize config
        schema_filename = resource_filename(__name__, _CONFIG_SCHEMA_RESOURCE)
        self._config = config_loader.load(config_path, schema_filename)

        # logging config
        logging.config.dictConfig(self._config['logging'])

        # set base path on app
        path = urllib.parse.urlparse(self._config['web']['baseurl']).path
        if len(path) == 0 or path[-1] != '/':
            path += '/'
        self['path'] = path

        # set openapi spec on app
        with resource_stream(__name__, _OPENAPI_SCHEMA_RESOURCE) as s:
            self['openapi'] = yaml.load(s, Loader=yaml.FullLoader)

        # set search endpoints on app
        self['search'] = self._search()

        # add routes
        self.router.add_get('/metrics', handlers.metrics.get)
        openapi_route = self.router.add_get(path + 'openapi', handlers.openapi.get)
        typeahead_route_no_slash = self.router.add_get(path + 'typeahead', handlers.search.typeahead)
        typeahead_route = self.router.add_get(path + 'typeahead' + '/', handlers.search.typeahead)

        article_route_no_slash = self.router.add_get(path + 'search/article', handlers.search.search_articles)
        article_route = self.router.add_get(path + 'search/article' + '/', handlers.search.search_articles)

        publication_route_no_slash = self.router.add_get(path + 'search/publication',
                                                         handlers.search.search_publications)
        publication_route = self.router.add_get(path + 'search/publication' + '/', handlers.search.search_publications)

        special_route_no_slash = self.router.add_get(path + 'search/special', handlers.search.search_specials)
        special_route = self.router.add_get(path + 'search/special' + '/', handlers.search.search_specials)

        # CORS
        if 'allow_cors' in self._config['web'] and self._config['web']['allow_cors']:
            cors = aiohttp_cors.setup(self, defaults={
                '*': aiohttp_cors.ResourceOptions(
                    expose_headers="*", allow_headers="*"
                ),
            })
            cors.add(typeahead_route)
            cors.add(typeahead_route_no_slash)
            cors.add(publication_route)
            cors.add(publication_route_no_slash)
            cors.add(article_route)
            cors.add(article_route_no_slash)
            cors.add(special_route)
            cors.add(special_route_no_slash)

            cors.add(openapi_route)

    @property
    def config(self) -> dict:
        return self._config

    def _search(self):
        # language=rst
        """ Get the search from the configuration.
        """
        conf = self.config['search_config']
        connect_timeout = conf['connect_timeout']
        elastic_host = getenv('ELASTIC_HOST', conf['elastic_host'])
        elastic_port = getenv('ELASTIC_PORT', conf['elastic_port'])
        read_timeout = conf['default_read_timeout']
        max_results = conf['max_results']
        cms_url = getenv('CMS_URL', conf['cms_url'])
        index = conf['index']

        return ElasticSearchTypeAhead(self, elastic_host, elastic_port, connect_timeout, max_results, cms_url, index,
                                      read_timeout)
