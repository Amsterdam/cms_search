export interface RawMapCollection {
    id:        string;
    title:     string;
    mapLayers: MapLayer[];
    meta:      Meta;
}

export interface MapLayer {
    id:     string;
    title?: string;
}

export interface Meta {
    themes:    string[];
    thumbnail: null | string;
}
