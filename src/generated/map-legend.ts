export interface RawMapLegend {
    id:             string;
    title:          string;
    type:           string;
    layers:         string[];
    url?:           string;
    meta:           Meta;
    detailUrl?:     string;
    detailParams?:  DetailParams;
    detailIsShape?: boolean;
    iconUrl?:       string;
    params?:        Params;
    imageRule?:     string;
    minZoom?:       number;
    notSelectable?: boolean;
    external?:      boolean;
    bounds?:        Array<number[]>;
    authScope?:     string;
}

export interface DetailParams {
    item?:     string;
    datasets?: string;
}

export interface Meta {
    themes: string[];
}

export interface Params {
    categorie?:    number | string;
    tijdvak?:      string;
    onderwerp?:    string;
    width?:        number;
    height?:       number;
    tarief?:       string;
    id?:           number;
    mission_year?: number;
    mission_type?: string;
    scale?:        number;
    tariefgebied?: string;
}
