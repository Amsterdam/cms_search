const dataSearchConfig = [
  {
    endpoint: 'atlas/search/openbareruimte',
    type: 'openbare_ruimte_weg',
    label: 'Openbare Ruimte (Weg)',
    params: {
      subtype: 'weg',
    },
  },
  {
    endpoint: 'atlas/search/adres',
    type: 'adres',
    label: 'Adres',
  },
  {
    endpoint: 'atlas/search/openbareruimte',
    type: 'openbare_ruimte',
    label: 'Openbare Ruimte',
    params: {
      subtype: 'not_weg',
    },
  },
  {
    endpoint: 'atlas/search/kadastraalobject',
    type: 'kadastraal_object',
    label: 'Kadastraal object',
  },
  {
    endpoint: 'meetbouten/search',
    type: 'meetbouten',
    label: 'Meetbouten',
  },
  {
    endpoint: 'monumenten/search',
    type: 'monumenten',
    label: 'Monumenten',
  },
]

export default dataSearchConfig
