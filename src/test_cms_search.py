from pkg_resources import resource_filename
import pytest
from cms_search import application


@pytest.fixture(scope='function')
async def server(aiohttp_server):
    config_path = resource_filename(__name__, 'config.yml')
    return await aiohttp_server(application.Application(config_path))


async def test_publication(aiohttp_client, server):
    client = await aiohttp_client(server)
    resp = await client.get('/cms_search/search/publication')
    assert resp.status == 200
    json = await resp.json()
    assert json['results'][0]['_links']['self'][
      'href'] == "https://acc.cms.data.amsterdam.nl/jsonapi/node/publication/e22c5d37-59e4-4a1f-b82d-613de6821ed3"
    assert json['results'][0]['nid'] == 22794


async def test_article(aiohttp_client, server):
    client = await aiohttp_client(server)
    resp = await client.get('/cms_search/search/article')
    assert resp.status == 200
    json = await resp.json()
    assert json['results'][0]['_links']['self'][
      'href'] == "https://acc.cms.data.amsterdam.nl/jsonapi/node/article/8295b209-8c6d-4ab6-b0c3-d24cc5d14dff"
    assert json['results'][0]['nid'] == 21358


async def test_special(aiohttp_client, server):
    client = await aiohttp_client(server)
    resp = await client.get('/cms_search/search/special')
    assert resp.status == 200
    json = await resp.json()
    assert json['results'][0]['_links']['self'][
      'href'] == "https://acc.cms.data.amsterdam.nl/jsonapi/node/special/2fda7429-fe39-4da6-be4d-4b4ee64f4022"
    assert json['results'][0]['nid'] == 48


async def test_typeahead_none(aiohttp_client, server):
    client = await aiohttp_client(server)
    resp = await client.get('/cms_search/typeahead/?q=provo')
    assert resp.status == 200
    json = await resp.json()
    assert(len(json) == 0)


async def test_typeahead_body(aiohttp_client, server):
    client = await aiohttp_client(server)
    resp = await client.get('/cms_search/typeahead/?q=polycentrische+stedeling')
    assert resp.status == 200
    json = await resp.json()
    assert json[0]['label'] == "Articles"
    assert json[0]['content'][0]['uri'] == \
           "https://acc.cms.data.amsterdam.nl/jsonapi/node/article/8295b209-8c6d-4ab6-b0c3-d24cc5d14dff"


async def test_typeahead_title(aiohttp_client, server):
    client = await aiohttp_client(server)
    resp = await client.get('/cms_search/typeahead/?q=2016+metropool+cijfer')
    assert resp.status == 200
    json = await resp.json()
    assert json[0]['label'] == "Publications"
    assert json[0]['content'][0]['uri'] == \
           "https://acc.cms.data.amsterdam.nl/jsonapi/node/publication/e22c5d37-59e4-4a1f-b82d-613de6821ed3"


async def test_search_intro(aiohttp_client, server):
    client = await aiohttp_client(server)
    resp = await client.get('/cms_search/search/special/?q=kerncijfers')
    assert resp.status == 200
    json = await resp.json()
    assert json['results'][0]['_links']['self'][
               'href'] == "https://acc.cms.data.amsterdam.nl/jsonapi/node/special/2fda7429-fe39-4da6-be4d-4b4ee64f4022"
