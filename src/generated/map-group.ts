export interface RawMapGroup {
    id:             string;
    url?:           string;
    title:          string;
    legendItems:    LegendItem[];
    type:           string;
    meta:           Meta;
    layers?:        string[];
    minZoom?:       number;
    external?:      boolean;
    detailUrl?:     string;
    detailParams?:  DetailParams;
    detailIsShape?: boolean;
    authScope?:     string;
    category?:      string;
    params?:        Params;
}

export interface DetailParams {
    item?:     string;
    datasets?: string;
}

export interface LegendItem {
    id?:            string;
    iconUrl?:       string;
    title?:         string;
    notSelectable?: boolean;
    imageRule?:     string;
}

export interface Meta {
    themes: string[];
}

export interface Params {
    categorie: string;
}
