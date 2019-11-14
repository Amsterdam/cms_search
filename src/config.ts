export const PORT = 8080
export const URL_PREFIX = '/cms_search'

export const CMS_LABELS = {
  article: 'Artikelen',
  publication: 'Publicaties',
  special: 'Specials',
}

export const CMS_TYPES = Object.keys(CMS_LABELS)

export default {
  es: {
    cms: {
      index: 'elasticsearch_index_cms_articles_index',
      defaultTypes: CMS_TYPES,
      defaultSize: 50,
    },
  },
}
