export const PORT = 8081
export const URL_PREFIX = '/cms_search'

export const CMS_TYPES = {
  ARTICLE: 'article',
  PUBLICATION: 'publication',
  SPECIAL: 'special',
}

export const CMS_LABELS = {
  [CMS_TYPES.ARTICLE]: 'Artikelen',
  [CMS_TYPES.PUBLICATION]: 'Publicaties',
  [CMS_TYPES.SPECIAL]: 'Specials',
}

export default {
  es: {
    cms: {
      index: 'elasticsearch_index_cms_articles_index',
      defaultSize: 50,
    },
  },
}
