/* eslint-disable @typescript-eslint/naming-convention */
import { DataResult } from '../../../generated/graphql'
import { NORMAL_VBO_STATUSSES, DataType } from './config'

export interface ConstructionFileFields {
  dossiernr?: string
  stadsdeel?: string
  datering?: string
  dossier_type?: string
}

export interface DataFields {
  _display: string
  type_adres?: string
  vbo_status?: string
}

const showSubtype = (type: string, subtype: string) =>
  type === 'ligplaats' ||
  type === 'standplaats' ||
  (type === 'openbare_ruimte' && subtype !== 'weg') ||
  (type === 'adres' && subtype !== 'verblijfsobject') ||
  type === 'explosief' ||
  (type === 'monument' && subtype === 'complex')

export const composeLabel = (
  type: string,
  subtype: string,
  otherFields: DataFields & ConstructionFileFields,
) => {
  switch (type) {
    case DataType.ConstructionFiles: {
      const { dossiernr, stadsdeel, datering, dossier_type: dossierType } = otherFields
      const year = datering && new Date(datering).getFullYear()

      // Construct the label for ConstructionFiles
      return `${stadsdeel ?? ''}${dossiernr ?? ''} ${year ?? ''} ${dossierType ?? ''}`
    }

    default: {
      const { _display, type_adres, vbo_status } = otherFields

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

      return label
    }
  }
}

export const normalizeResults = (
  { _links, subtype, ...otherFields }: any,
  type: string,
): DataResult => {
  const label = composeLabel(type, subtype, otherFields)

  return {
    id: _links && _links.self ? _links.self.href.match(/([^/]*)\/*$/)[1] : null,
    label,
    type,
    subtype,
    endpoint: _links && _links.self ? _links.self.href : null,
    ...otherFields,
  }
}
