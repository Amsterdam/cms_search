export interface RawMapCollection {
  id: string
  title: string
  mapLayers: MapLayer[]
  meta: Meta
}

export interface MapLayer {
  id: string
  title?: string
}

export interface Meta {
  description: null
  themes: any[]
  datasetIds: any[]
  thumbnail: string
  date: null
}
