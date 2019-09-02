# Elasticsearch functionality for Drupal CMS

This project makes the Elastic Search dat for the Drupal CMS that is indexed by the Drupal plugin for Elastic Search
available as typeahead or search.

# Local test

Install required modules :

    pip install -r requirements.txt

To test this locally you either need to have a local Elastic Search running with the correct index, or you can tunnel
the Elastic Search from acceptance to localhost with :


    ssh -L 9200:es01.acc.data.amsterdam.nl:9200 user@dc01.acc.data.amsterdam.nl

Then run this with :

    PYTHONPATH=src python src/cms_search/main.py --config example.config.yml


Try out a couple of searches with :

    http://localhost:8080/typeahead/?q=ijburg

    http://localhost:8080/search/article/?q=wallen

    http://localhost:8080/search/special
