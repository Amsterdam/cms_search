import csv
import os

from elasticsearch import Elasticsearch

FILE_URL = "data/test_data.csv"
MAPPING_FILE = "data/_mapping.json"
ES_HOST = {
    "host": os.getenv('ELASTIC_HOST', "localhost"),
    "port": 9200
}
INDEX_NAME = 'elasticsearch_index_cms_articles_index'
TYPE_NAME = 'articles_index'
ID_FIELD = '_id'
SOURCE_PREFIX = '_source.'

curdir = os.getcwd()
abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)

with open(FILE_URL) as csv_file:
    csv_file_object = csv.reader(csv_file)
    header = next(csv_file_object)
    header = [item.lower() for item in header]
    index_id = None
    for i in range(len(header)):
        if header[i] == ID_FIELD:
            index_id = i
            break

    bulk_data = []
    for row in csv_file_object:
        data_dict = {}
        for i in range(len(row)):
            if header[i].startswith(SOURCE_PREFIX):
                value = int(row[i]) if row[i].isdigit() else row[i]
                data_dict[header[i][len(SOURCE_PREFIX):]] = [value]
        op_dict = {
            "index": {
                "_index": INDEX_NAME,
                "_type": TYPE_NAME,
                "_id": row[index_id]
            }
        }
        bulk_data.append(op_dict)
        bulk_data.append(data_dict)

# create ES client, create index
es = Elasticsearch(hosts=[ES_HOST])
if es.indices.exists(INDEX_NAME):
    print("deleting '%s' index..." % (INDEX_NAME))
    res = es.indices.delete(index=INDEX_NAME)
    print(" response: '%s'" % (res))
# since we are running locally, use one shard and no replicas
request_body = {
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0
    }
}
print("creating '%s' index..." % (INDEX_NAME))
res = es.indices.create(index=INDEX_NAME, body=request_body)
print(" response: '%s'" % (res))
print("put mapping '%s' index..." % (INDEX_NAME))

with open(MAPPING_FILE, 'r') as content_file:
    request_body = content_file.read()
    res = es.indices.put_mapping(index=INDEX_NAME, body=request_body, doc_type=TYPE_NAME)
    print(" response: '%s'" % (res))

# bulk index the data
print("bulk indexing...")
res = es.bulk(index=INDEX_NAME, body=bulk_data, refresh=True)
print(" response: '%s'" % (res))

# sanity check
res = es.search(index=INDEX_NAME, size=3, body={"query": {"match_all": {}}})
print(" response: '%s'" % (res))
os.chdir(curdir)
