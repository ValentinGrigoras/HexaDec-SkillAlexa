export class language { 
    private static lang :string = "en-US";
    
    setLang(lang:string) {
        language.lang = lang;
    }

    getLang() {
        return language.lang;
    }
}