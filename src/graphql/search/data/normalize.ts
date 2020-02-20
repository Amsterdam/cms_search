import { DataResult } from '../../../generated/graphql'
import { NORMAL_VBO_STATUSSES } from './config'

const showSubtype = (type: string, subtype: string) =>
  type === 'ligplaats' ||
  type === 'standplaats' ||
  (type === 'openbare_ruimte' && subtype !== 'weg') ||
  (type === 'adres' && subtype !== 'verblijfsobject') ||
  type === 'explosief' ||
  (type === 'monument' && subtype === 'complex')

export const normalizeResults = ({
  _links,
  _display,
  type,
  subtype,
  type_adres,
  vbo_status,
  ...otherFields
}: any): DataResult => {
  let label = _display

  // Show if an item is not the main address
  if (type_adres && type_adres !== 'Hoofdadres') {
    label += ' (nevenadres)'
  }

  // Show subType for items that occur in different types
  if (showSubtype(type, subtype)) {
    label += ` (${subtype})`
  }

  // Show if an items has a special status
  if (vbo_status && !NORMAL_VBO_STATUSSES.includes(vbo_status)) {
    label += ` (${vbo_status.toLowerCase()})`
  }

  return {
    id: _links && _links.self ? _links.self.href.match(/([^\/]*)\/*$/)[1] : null,
    label,
    type,
    subtype,
    endpoint: _links && _links.self ? _links.self.href : null,
    ...otherFields,
  }
}
