

export class GoogleApi {
    private static token: string= " ";

    getToken(){
        return GoogleApi.token;
    }

    setToken(tok: string){
        GoogleApi.token=tok;
    }
}