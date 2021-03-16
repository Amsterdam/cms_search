import { graphqlHTTP } from 'express-graphql'
import fetch from 'node-fetch'
import NodeCache from 'node-cache'
import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from './graphql.schema'
import resolvers from './search'
import createDataLoader from './utils/createDataLoader'
import DataLoader from 'dataloader'
import { Covid19ResultItem } from '../generated/graphql'

const schema = `
  ${typeDefs}
`
const cache = new NodeCache()

export default graphqlHTTP((req) => ({
  schema: makeExecutableSchema({
    typeDefs: schema,
    resolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: 'ignore',
      requireResolversForArgs: 'ignore',
    },
  }),
  context: {
    // Create a context for holding contextual data
    loaders: {
      cms: createDataLoader(''),
      data: createDataLoader(req.headers.authorization || ''),
      datasets: createDataLoader(''),
      openAPI: createDataLoader(''),
      rivm: new DataLoader<[string, string[]], { result: Covid19ResultItem[] }>(
        async (args) => {
          const municipalityName = args[0][0]
          const dates = args[0][1]
          const cacheKey = `${municipalityName}${dates.join(',')}`
          let formattedResult = cache.get(cacheKey)
          if (!formattedResult) {
            let result: any[] | undefined = cache.get('covid19Cum')
            if (!result) {
              result = await fetch(
                'https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_cumulatief.json',
              ).then((res) => res.json())
              cache.set('covid19Cum', result, 60 * 60 * 24) // TTL = 24h
            }

            const resultsPerDate = result?.filter(
              ({ Municipality_name, Date_of_report }: any) =>
                Municipality_name === municipalityName && dates.includes(Date_of_report),
            )

            formattedResult = resultsPerDate?.map(
              ({
                Total_reported,
                Hospital_admission,
                Deceased,
                Municipality_code,
                Municipality_name,
                Date_of_report,
              }: any) =>
                ({
                  totalReported: Total_reported,
                  hospitalAdmission: Hospital_admission,
                  deceased: Deceased,
                  municipalityCode: Municipality_code,
                  municipalityName: Municipality_name,
                  date: Date_of_report,
                } as Covid19ResultItem),
            )
            cache.set(cacheKey, formattedResult, 60 * 60 * 24) // TTL = 24h
          }

          return [
            {
              result: formattedResult as Covid19ResultItem[],
            },
          ]
        },
        {
          cache: true,
        },
      ),
    },
  },
}))
