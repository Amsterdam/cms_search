import { DataResult } from '../../../../generated/graphql'

export const normalizeDataResults = ({
  _links,
  _display,
  type,
  ...otherField
}: any): DataResult => ({
  id: _links && _links.self ? _links.self.href.match(/([^\/]*)\/*$/)[1] : null,
  label: _display,
  type,
  ...otherField,
})
