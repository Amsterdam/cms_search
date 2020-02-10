const fs = require('fs')
const fetch = require('node-fetch')
const dotenv = require('dotenv')

// Converts a string to a cleaned string that can be used as enum
const toId = string =>
  string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text

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
      return `'${toId(attributes.name)}' = ${attributes.drupal_internal__tid},`
    })
  } catch (e) {
    console.warn(e)
  }

  // Export the enum for the theme taxonomy from Drupal
  const exported = `export enum DrupalThemeFilterIDs {
    ${themeFilters.join('\n')}
  }
  `

  // Creates a new file in the generated directory
  fs.writeFile('src/generated/drupal.ts', exported, function(e) {
    if (e) {
      return console.warn(e)
    }
    console.log('Types from Drupal were created!')
  })
}

fetchAndMapDrupalFilters()
