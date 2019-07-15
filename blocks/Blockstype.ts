/*
* Nome file: 
* Type: 
* Data creazione: 
*
* Descrizione del file: definisce i tipi dei vari blocchi
*
* Autore: 
* Versione:
* Registro modifiche:
* Autore, Data ultima modifica, descrizione
*/
export interface Blocchi {
    BlockName:  string
}

export type WorkflowTupla = {
    IDUser: string,
    WorkflowName: string,
    Iteraction: string,
    ModifyDate: string,
    WelcomeText: string,
    CreationDate: string,
    Blocks: Blocchi [],
    SuggestedTime: string
}

export type UserType = {
        IDUser: string,
        Mail: string,
        PIN: string,
        Username: string
}

export interface Filter extends Blocchi {
    FilterValue :number
}

export interface Pin extends Blocchi {
	Code: string
}

export interface Text extends Blocchi {
	TextValue: string
}

export interface YouTubeMusic extends Blocchi {
	URL: string
}

export interface Kindle extends Blocchi {
	URLValue: string
}

export interface FeedRSS extends Blocchi {
	URLValue: string
}

export interface Weather extends Blocchi  {
	CityValue : string
}

export interface TVProgram extends Blocchi {
    ProgrValue: string
}

export interface Radio extends Blocchi {
    URLValue: string
    radioName: string
}

export type tokenGoogleApi = {
    access_token: string,
    refresh_token: string,
    scope: string,
    token_type: string,
    expiry_date: number
}

export type credentials = {
    web: {
        auth_provider_x509_cert_url: string,
        auth_uri: string,
        client_id: string,
        client_secret: string,
        project_id: string,
        redirect_uris: string[],
        token_uri: string
    }
}

export interface Mail extends Blocchi {
    credentials: credentials,
    token: tokenGoogleApi
}