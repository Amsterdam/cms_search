const fs = require('fs')
const fetch = require('node-fetch')
const dotenv = require('dotenv')

dotenv.config()

async function fetchAndMapDrupalFilters() {
  let themeFilters = []
  try {
    // Fetched the Drupal JSONApi to retrieve the theme taxonomy
    const results = await fetch(`${process.env.CMS_URL}/jsonapi/taxonomy_term/themes`).then(res =>
      res.json(),
    )

    // Constructs an array with the cleaned up taxonomy names and internal IDs
    themeFilters = results.data.map(({ attributes }) => {
      // Converts a string to a cleaned string that can be used as enum
      const id = attributes.name
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text

      return `['${id}', ${attributes.drupal_internal__tid}],`
    })
  } catch (e) {
    throw e
  }

  // Export the enum for the theme taxonomy from Drupal
  const exported = `export const DRUPAL_THEME_FILTER_IDS = new Map([${themeFilters.join('\n')}])`

  // Creates a new file in the generated directory
  fs.writeFile('src/generated/drupal.ts', exported, function(e) {
    if (e) {
      throw e
    }
    console.log('Types from Drupal were created!')
  })
}

try {
  fetchAndMapDrupalFilters()
} catch (e) {
  console.warn(e)
}
