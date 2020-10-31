import { Covid19Result, QueryCovid19MunicipalityCumulativeArgs } from '../../generated/graphql'
import { Context } from '../config'

export const covid19MunicipalityCumulative = async (
  _: any,
  { municipalityName, dates }: QueryCovid19MunicipalityCumulativeArgs,
  context: Context,
): Promise<Covid19Result> => {
  const { loaders } = context
  return loaders.rivm.load([municipalityName, dates])
}
