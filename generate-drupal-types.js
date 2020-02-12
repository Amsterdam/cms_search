const util = require('util')
const fs = require('fs')
const fetch = require('node-fetch')
const dotenv = require('dotenv')

const writeFile = util.promisify(fs.writeFile)

dotenv.config()

async function generateDrupalTypes() {
  // Fetched the Drupal JSONApi to retrieve the theme taxonomy
  const results = await fetch(`${process.env.CMS_URL}/jsonapi/taxonomy_term/themes`).then(res =>
    res.json(),
  )

  // Constructs an array with the cleaned up taxonomy names and internal IDs
  const themeFilters = results.data.map(({ attributes }) => {
    // Converts a string to a cleaned string that can be used as enum
    const id = attributes.name
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .trim()

    return `${JSON.stringify([id, attributes.drupal_internal__tid])},`
  })

  // Export the enum for the theme taxonomy from Drupal
  const exported = `export const DRUPAL_THEME_FILTER_IDS = new Map([${themeFilters.join('\n')}])`

  await writeFile('src/generated/drupal.ts', exported)
}

generateDrupalTypes()
  .then(() => console.log('Types from Drupal were created!'))
  .catch(error => {
    console.error('Unable to generate types from Drupal.')
    console.error(error)
    process.exit(1)
  })