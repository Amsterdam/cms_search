# Elasticsearch functionality for Drupal CMS

This project makes the Elastic Search for the Drupal CMS that is indexed by the Drupal plugin for Elastic Search
available as typeahead or search.

## Local test

Install required modules :

    npm i

To test this locally you either need to have a local Elastic Search running with the correct index, or you can tunnel
the Elastic Search from acceptance to localhost with :

    ssh -L 9200:es01.acc.data.amsterdam.nl:9200 user@dc01.acc.data.amsterdam.nl

Currently the Elastic Search index for Drupal is not in a backup and cannot yet be restored with update-el.sh.

## How to add a map layer

The json files for collections and layers can be found [here](./assets/map-collections.config.json) and [here](./assets/map-layers.config.json).
Make sure you know to which collection you should add the layers. If the collection already exist,
simply add an object with an `id` to the `mapLayers` array. This `id` can be made up, and should correspond to the `id` of the layer you're about to add. If the collection doesn't exist, read the instructions below.

### Map layer without instance API

Now that we added an `id` to the collection, we have to add the layer. Open [map-layers.config.json](./assets/map-layers.config.json) and add the following to the array:

```json
{
  "id": "someid",
  "layers": ["some_layer"],
  "title": "My Layer",
  "type": "wms",
  "url": "/maps/some_layer",
  "legendItems": [
    {
      "title": "Not available",
      "imageRule": "Niet beschikbaar"
    },
    {
      "title": "Available"
    }
  ],
  "meta": {
    "description": null,
    "themes": ["foo", "bar"],
    "datasetIds": [],
    "thumbnail": null,
    "date": null
  }
}
```

- _id_ - this is the ID you just added to one of the collections in [map-collections.config.json](./assets/map-collections.config.json)
- _layers_ - an array of the layers available in the `.map` file. These `.map` files can be found in [this repo](https://github.com/Amsterdam/mapserver/)
- _title_ - this is the title that will be displayed in the front-end.
- _type_ - usually just `wms`
- _url_ - this is the url to retrieve the actual (wms) layer to be displayed on the map, but it's also used to retrieve the legend images (which are specified in the `legendItems` field)
- _legendItems_ - an array of objects containing a `title`, that will be displayed in the frontend but can also be used to retrieve the image for the legend from the mapserver (checkout the corresponding `.map` file in [this repo](https://github.com/Amsterdam/mapserver/))
  If the title doesn't match the title used in the .map file (for editorial purposes), the imageRule field can be used to define the legend icon, that should correspond the legend in the `.map` file.
- _meta.themes_ - these should contain the id's of [themes.config.json](./assets/themes.config.json).

### Map layer with an instance API

When the map layer comes with an instance API, the configuration must be extended with several other fields:

```json
{
  "id": "someid",
  "layers": ["some_layer"],
  "title": "My Layer",
  "type": "wms",
  "url": "/maps/some_layer",
  "legendItems": [
    // ...
  ],
  "detailUrl": "/instance/api",
  "detailParams": {
    "param1": "some_layer"
  },
  "detailIsShape": true,
  "meta": {
    "description": null,
    "themes": ["foo", "bar"],
    "datasetIds": [],
    "thumbnail": null,
    "date": null
  }
}
```

- _detailUrl_ - url to the instance API
- _detailParams_ - object containing params to get the detail information from the instance API
- _detailIsShape_ - (optional) used to define if the detail information contains a shape, this set the radius to search the instance API to 0

## How to add a map collection

Open [map-collections.config.json](./assets/map-collections.config.json) and add

```json
{
  "id": "foobar",
  "title": "My collection",
  "mapLayers": [
    {
      "id": "someid"
    }
  ],
  "meta": {
    "description": null,
    "themes": ["foo", "bar"],
    "datasetIds": [],
    "thumbnail": "sites/default/files/images/thumbnail-kaarten.jpg",
    "date": null
  }
}
```

- _id_ - this is a unique ID you can make up.
- _title_ - the title of the collection that will be displayed in the front-end
- _mapLayers_ - an array of objects containing the `id` that should correnspond to the `id` of the map layer added in [map-layers.config.json](./assets/map-layers.config.json)`
- _meta.themes_ - these should contain the id's of [themes.config.json](./assets/themes.config.json).
- _meta.thumbnail_ - this is the absolute path from [the cms](https://cms.data.amsterdam.nl) where the image of the collection is uploaded. This will be displayed in the front-end in the search results.
