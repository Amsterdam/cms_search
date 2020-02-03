import moment from 'moment'
import { FILTERS } from './config'
import {
  CmsSearchResultType,
  QueryArticleSearchArgs,
  QueryPublicationSearchArgs,
  QuerySpecialSearchArgs,
  Filter,
  FilterOptions,
} from '../../../generated/graphql'
import { getValuesFromES } from '../../../es/cms'

export type QueryCmsSearchArgs =
  | QueryArticleSearchArgs
  | QueryPublicationSearchArgs
  | QuerySpecialSearchArgs

type JsonAPI = {
  data: Array<Object>
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

    localeDate = new Date(
      // Month (undefined or a string) - 1, check https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC
      Date.UTC(year, Number(month) - 1 || 1, 1, 0, 0, 0),
    )
  }

  const format = date ? 'D MMMM YYYY' : `${month ? 'MMMM ' : ''}${year ? 'YYYY' : ''}`

  return moment(localeDate).format(format)
}

function getFormattedResults(results: any): Array<CmsSearchResultType> {
  return results.map(({ _source: result }: any) => {
    const {
      title,
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
      dateLocale: getFormattedDate(
        field_publication_date,
        field_publication_year,
        field_publication_month,
      ),
    }
  })
}

function getThemeFilterOptions(
  result: JsonAPI,
  themeCount: Array<{ key: string; count: number }>,
): Array<FilterOptions> {
  return result.data.map((item: any) => {
    const id = item.attributes.drupal_internal__tid

    const { count } = themeCount.find(count => count.key === id) || {}

    return {
      id: `${FILTERS['THEME'].type}:${id}`,
      label: item.attributes.name,
      count: count || 0,
    }
  })
}

function getDateFilterOptions(): Array<FilterOptions> {
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

function formatThemeFilters(
  themeTaxonomy: JsonAPI,
  themeCount: Array<{ key: string; count: number }>,
): Filter {
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

export default getFormattedResults

export { getFormattedDate, getThemeFilterOptions, formatThemeFilters, formatDateFilters }
