import { DataResult } from '../../../generated/graphql'
import { NORMAL_VBO_STATUSSES } from './config'

export const normalizeResults = ({
  _links,
  _display,
  type,
  type_adres,
  vbo_status,
  ...otherFields
}: any): DataResult => {
  let label = _display

  // Show if an item is not the main address
  if (type_adres && type_adres !== 'Hoofdadres') {
    label += ' (nevenadres)'
  }

  // Show if an items has a special status
  if (vbo_status && !NORMAL_VBO_STATUSSES.includes(vbo_status)) {
    label += ` (${vbo_status.toLowerCase()})`
  }

  return {
    id: _links && _links.self ? _links.self.href.match(/([^\/]*)\/*$/)[1] : null,
    label,
    type,
    endpoint: _links && _links.self ? _links.self.href : null,
    ...otherFields,
  }
}
