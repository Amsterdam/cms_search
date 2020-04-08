import moment from 'moment'
import { getValuesFromES } from '../../../es/cms'
import { DRUPAL_THEME_FILTER_IDS } from '../../../generated/drupal'
import {
  CmsResult,
  Filter,
  FilterOption,
  QueryArticleSearchArgs,
  QueryPublicationSearchArgs,
  QuerySpecialSearchArgs,
} from '../../../generated/graphql'
import { FILTERS } from './config'
import { SubTypeFilterCount, ThemeFilterCount } from './filters'

export type QueryCmsSearchArgs =
  | QueryArticleSearchArgs
  | QueryPublicationSearchArgs
  | QuerySpecialSearchArgs

export type JsonAPI = {
  data: Array<{
    attributes: Attributes
  }>
}

type Attributes = {
  drupal_internal__tid: number
  name: string
}

export type ESFilters = {
  key: string
  doc_count: number
}

function getCapitalizedString(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function getFormattedDate(date?: number | Date, year?: number, month?: number): string {
  moment.locale('nl-NL')

  // If the `date` parameter is a number, the unix timestamp should be multiplied by 1000 to get the correct output
  let localeDate = typeof date === 'number' ? date * 1000 : date

  /**
   * Sometimes we don't get a field_publication_date, but only a field_publication_year and / or field_publication_month
   * Then we need to convert it to a locale date that only shows the year or year and month
   */
  if (!date && (year || month)) {
    year = year || 0
    // Month (undefined or a string) - 1, check https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC
    const formattedMonth = typeof month === 'number' && month > 0 ? month - 1 : 0
    localeDate = new Date(Date.UTC(year, formattedMonth, 1, 0, 0, 0))
  }

  const format = date ? 'D MMMM YYYY' : `${month ? 'MMMM ' : ''}${year ? 'YYYY' : ''}`
  return moment(localeDate).format(format)
}

function getFormattedResults(results: any): Array<CmsResult> {
  return results.map(({ _source: result }: any) => {
    const {
      title,
      created,
      field_short_title,
      field_slug,
      field_link,
      teaser_url,
      field_publication_date,
      field_publication_month,
      field_publication_year,
      field_special_type,
      field_intro,
      field_teaser,
      processed,
      field_file,
      media_image_url,
      uuid,
      type,
    } = getValuesFromES(result) as any

    const dateLocale =
      field_publication_date === undefined &&
      field_publication_year === undefined &&
      field_publication_month === undefined
        ? getFormattedDate(new Date(created * 1000))
        : getFormattedDate(field_publication_date, field_publication_year, field_publication_month)

    return {
      id: uuid,
      label: field_short_title || title,
      slug: field_slug,
      type: type,
      body: processed,
      teaserImage: teaser_url,
      coverImage: media_image_url,
      date: field_publication_date,
      specialType: field_special_type,
      file: field_file,
      intro: field_intro,
      teaser: field_teaser,
      link: field_link,
      dateLocale,
    }
  })
}

function getThemeFilterOptions(
  result: JsonAPI,
  themeCount?: Array<ThemeFilterCount>,
): Array<FilterOption> {
  return result.data.map(({ attributes }) => {
    const id = attributes.drupal_internal__tid
    const { count } = themeCount?.find((count) => count.key === id) || {}

    const [key] = [...DRUPAL_THEME_FILTER_IDS].find(([, value]) => value === id) || []

    if (!key) {
      throw new Error('FilterOption not found')
    }

    return {
      id: `${FILTERS['THEME'].type}:${key}`,
      label: attributes.name,
      count: count || 0,
    }
  })
}

function getDateFilterOptions(): Array<FilterOption> {
  const nrYears = 22
  const currentYear = new Date().getFullYear()

  return [...Array(nrYears).keys()].map((key: number) => {
    let year = currentYear - key

    if (key === nrYears - 1) {
      year = currentYear - key + 1 // We need the previous year in the array
      return {
        id: `${FILTERS['DATE'].type}:older-${year}`,
        label: `Ouder dan ${year}`,
        count: 0,
      }
    }
    return {
      id: `${FILTERS['DATE'].type}:${year}`,
      label: `${year}`,
      count: 0,
    }
  })
}

function getSubTypeFilterOptions(
  filters: Array<ESFilters>,
  subTypeCount?: Array<SubTypeFilterCount>,
): Array<FilterOption> {
  return filters
    .sort((a, b) => a.key.localeCompare(b.key)) // Alphabetically sort the options
    .map(({ key }) => {
      const { count } = subTypeCount?.find((count) => count.key === key) || {}

      return {
        id: `${FILTERS['SUBTYPE'].type}:${key}`,
        label: getCapitalizedString(key),
        count: count || 0,
      }
    })
}

function formatThemeFilters(themeTaxonomy: JsonAPI, themeCount?: Array<ThemeFilterCount>): Filter {
  const { type, label, filterType } = FILTERS['THEME']

  return {
    type,
    label,
    filterType,
    options: getThemeFilterOptions(themeTaxonomy, themeCount),
  }
}

function formatDateFilters(): Filter {
  const { type, label, filterType } = FILTERS['DATE']

  return {
    type,
    label,
    filterType,
    options: getDateFilterOptions(),
  }
}

function formatSubTypeFilters(
  filters: Array<ESFilters>,
  subTypeCount?: Array<SubTypeFilterCount>,
): Filter {
  const { type, label, filterType } = FILTERS['SUBTYPE']

  return {
    type,
    label,
    filterType,
    options: getSubTypeFilterOptions(filters, subTypeCount),
  }
}

export default getFormattedResults

export {
  getFormattedDate,
  getThemeFilterOptions,
  formatThemeFilters,
  formatDateFilters,
  formatSubTypeFilters,
}
