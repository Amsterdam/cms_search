export interface MapLayer {
  id: string
  title: string
  layers?: string[]
  url?: string
  meta?: Meta
  detailUrl?: string
  detailItem?: string
  detailIsShape?: boolean
  iconUrl?: string
  params?: Params
  imageRule?: string
  minZoom?: number
  notSelectable?: boolean
  legendItems?: LegendItem[]
  external?: boolean
  type?: string
  bounds?: Array<number[]>
  authScope?: string
  category?: string
}

export interface LegendItem {
  id?: string
  iconUrl?: string
  title?: string
  imageRule?: string
  notSelectable?: boolean
}

export interface Meta {
  description: null
  themes: string[]
  datasetIds: any[]
  thumbnail: null
  date: null
}

export interface Params {
  categorie?: number | string
  onderwerp?: string
  width?: number
  height?: number
  tarief?: string
  id?: number
  mission_year?: number
  mission_type?: string
  scale?: number
}
