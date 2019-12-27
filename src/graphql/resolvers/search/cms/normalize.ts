import {
  CmsSearchResultType,
  QueryArticleSearchArgs,
  QueryPublicationSearchArgs,
  QuerySpecialSearchArgs,
} from '../../../../generated/graphql'
import { getValuesFromES } from '../../../../es'
import moment from 'moment'

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
      body,
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
      body,
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
): Array<any> {
  return result.data.map((item: any) => {
    const id = item.attributes.drupal_internal__tid

    const { count } = themeCount.find(count => count.key === id) || {}

    return {
      id,
      label: item.attributes.name,
      count: count || 0,
      enumType: `theme:${id}`,
    }
  })
}

function formatFilters(
  themeTaxonomy: JsonAPI,
  themeCount: Array<{ key: string; count: number }>,
): Array<any> {
  const themeFilterOptions = getThemeFilterOptions(themeTaxonomy, themeCount)

  return [
    // This is already structured as an array as there will be more filters later on
    {
      type: 'theme',
      label: "Thema's",
      filterType: 'array',
      options: themeFilterOptions,
    },
  ]
}

export default getFormattedResults

export { getFormattedDate, getThemeFilterOptions, formatFilters }
