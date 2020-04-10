import { formatCmsResults } from './typeahead'

describe('typeahead', () => {
  beforeEach(() => {})

  it('should format the elasticsearch results', () => {
    const MOCK_ES_VALUES = {
      title: ['title'],
      type: ['type'],
      uuid: ['uuid'],
    }

    jest.mock('.', () => ({
      getValuesFromES: MOCK_ES_VALUES,
    }))

    expect(formatCmsResults([{ _source: MOCK_ES_VALUES }])).toEqual([
      {
        _display: MOCK_ES_VALUES.title[0],
        uri: `${process.env.CMS_URL}/jsonapi/node/${MOCK_ES_VALUES.type[0]}/${MOCK_ES_VALUES.uuid[0]}`,
        type: MOCK_ES_VALUES.type[0],
      },
    ])
  })

  it(`should format the elasticsearch results when there's a shorttitle`, () => {
    const MOCK_ES_VALUES = {
      title: ['title'],
      field_short_title: ['short_title'],
      type: ['type'],
      uuid: ['uuid'],
    }

    jest.mock('.', () => ({
      getValuesFromES: MOCK_ES_VALUES,
    }))

    const output = formatCmsResults([{ _source: MOCK_ES_VALUES }])[0]

    expect(output._display).not.toBe(MOCK_ES_VALUES.title[0])
    expect(output._display).toBe(MOCK_ES_VALUES.field_short_title[0])
  })

  it(`should format the elasticsearch results when there's a subType`, () => {
    const MOCK_ES_VALUES = {
      title: ['title'],
      type: ['type'],
      uuid: ['uuid'],
      field_special_type: ['subType'],
    }

    jest.mock('.', () => ({
      getValuesFromES: MOCK_ES_VALUES,
    }))

    const output = formatCmsResults([{ _source: MOCK_ES_VALUES }])[0]

    expect(output._display).not.toBe(MOCK_ES_VALUES.title[0])
    expect(output._display).toContain(MOCK_ES_VALUES.field_special_type[0])
  })
})
