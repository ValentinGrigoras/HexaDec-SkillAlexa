import { language } from "../src/language";
import {BlockTVProgram} from "./BlockTVProgram";
import { BlockWeather } from "./BlockWeather";

const lang = new language();

export let phraseGenerator={ 
    LaunchPhrase(user: string, workflow: string) :string{
        let phrase = [];
        switch(lang.getLang()){
            case "it-IT":{
                phrase.push("Benvenuto " + user + ", ti suggerisco di eseguire il workflow " + workflow + ", va bene?");
                phrase.push("Ciao " + user +", è un buon momento per eseguire il tuo wokrflow " + workflow + ", procedo?");
                phrase.push("Benvenuto " + user + ", stai usando la skill Megalexa. Ti consiglio di eseguire il workflow " + workflow + ", procedo?");
                phrase.push("Benvenuto " + user + ", vorresti eseguire il workflow " + workflow + "?");
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
            default:{
                phrase.push("Welcome " +  user + ", i suggest you to run the workflow " + workflow + ", should i start it?");
                phrase.push("Hi " + user + ", it's a good moment of the day to run yor workflow " + workflow + ", do you agree?");
                phrase.push("Welcome " + user + ", you are using the MegaAlexa skill. Do i run the workflow " + workflow + "?");
                phrase.push("Welcome " + user + ", do you want to start the workflow "+ workflow + "?");
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
        }
    },

    ErrorLaunch(){
        let phrase = [];
        switch(lang.getLang()){
            case "it-IT":{
                phrase.push("Non sei registrato, crea un account su Hexadec app");
                phrase.push("Mi dispiace, non sei registrato. Provvedi a collegarti tramite Hexadec app!");
                phrase.push("Account non riconosciuto. Collegarsi tramite Hexadec app");
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
            default:{
                phrase.push("You are not registered, create an account on Hexadec app");
                phrase.push("I'm sorry, you're not registered. Connect with Hexadec app");
                phrase.push("Acces denied. Log-in with Hexadec app");
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
        }
    },

    NextWorkflow(){
        let phrase = [];
        switch(lang.getLang()){
            case "it-IT":{
                phrase.push("Il workflow è terminato. Quale vuoi eseguire adesso?");
                phrase.push("Il workflow è terminato. Quale vuoi iniziare ora?");
                phrase.push("Il workflow è terminato. Quale faccio partire?");
                phrase.push("Il workflow è terminato. Con quale vuoi proseguire?");
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
            default:{
                phrase.push("End of the workflow. Which one do you want to execute know?");
                phrase.push("End of the workflow. Which one do you want to run know?");
                phrase.push("End of the workflow. Let me know which one to start");
                phrase.push("End of the workflow. Which one do you want to start?");
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
        }
    },

    StartWorkflowReprompt(){
        let phrase = [];
        switch(lang.getLang()){
            case "it-IT":{
                phrase.push("Quale routine vuoi eseguire?");
                phrase.push("Mi diresti per piacere un workflow da eseguire?");
                phrase.push("Allora Come posso aiutarti?");
                phrase.push("Con che workflow vuoi iniziare?");
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
            default:{
                phrase.push("Which workflow would you like to run?");
                phrase.push("Please tell me a workflow to execute");
                phrase.push("How can I help you?");
                phrase.push("What workflow do we start with?");
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
        }
    },

    WrongPin(){
        let phrase = [];
        switch(lang.getLang()){
            case "it-IT":{
                phrase.push("Pin errato, ripeti il codice segreto per poter eseguire il workflow");
                phrase.push("Accesso negato! Il pin che mi hai detto non è corretto, per piacere ripeti");
                phrase.push("Pin sbagliato, ripeti il codice segreto e scandiscilo bene");
                phrase.push("Ripetere il codice di sicurezza per eseguire il workflow per piacere");
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
            default:{
                phrase.push("Wrong pin, repeat the secret code to run the workflow");
                phrase.push("Access denied! The pin you told me is uncorrect, please repeat");
                phrase.push("Wrong pin, repeat the secret code and try to spell it better");
                phrase.push("Please, repeat the security code to run the workflow");
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
        }
    },

    NoBlocksWorkflow(welcome: string){
        let phrase = [];
        switch(lang.getLang()){
            case "it-IT":{
                phrase.push(welcome + "Non ci sono blocchi da eseguire");
                phrase.push(welcome + "Il workflow richiesto è vuoto");
                phrase.push(welcome + "Nel workflow da eseguire non vi sono blocchi");
                phrase.push(welcome + "Nel workflow selezionato vi sono zero blocchi");
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
            default:{
                phrase.push(welcome + "There are no blocks to execute");
                phrase.push(welcome + "The requested workflow is empty");
                phrase.push(welcome + "There are no blocks in the requested workflow");
                phrase.push(welcome + "There are zero blocks in the requested workflow");
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
        }
    },
        
    AskPin(){
        let phrase = [];
        switch(lang.getLang()){
            case "it-IT":{
                phrase.push("Dimmi il codice segreto per eseguire il workflow");
                phrase.push("Per piacere dire qual è il pin corretto per eseguire il workflow");
                phrase.push("Per eseguire il workflow richiesto è necessario rivelare il pin segreto");
                phrase.push("Qual è il codice di sicurezza di questo workflow?");
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
            default:{
                phrase.push("Tell me the secret pin to execute the workflow");
                phrase.push("I need to know the secret code to run the workflow");
                phrase.push("Please tell me the pin so i can run the requested workflow");
                phrase.push("Which is the secret code of this workflow?");
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
        }
    },

    WorkflowNotFound(){
        let phrase = [];
        switch(lang.getLang()){
            case "it-IT":{
                phrase.push("Workflow non trovato. Dimmi un workflow esistente da eseguire");
                phrase.push("Il workflow richiesto non esiste. Dimmi un workflow esistente da eseguire");
                phrase.push("Scusa, non riesco a trovare il workflow richiesto. Eseguirne uno esistente");
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
            default:{
                phrase.push("Workflow not found. Tell me an existing workflow to execute");
                phrase.push("The requested workflow does not exist. Tell me a real workflow to execute");
                phrase.push("Sorry, i can't find the requested workflow. Could you please run a real one?");
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
        }
    },

    FeedRSSSentence(param :any) : string {
        let phrase = [];
        switch(lang.getLang()){
            case "it-IT":{
                phrase.push("Queste sono le ultime notizie dal sito: "+ param);
                phrase.push("Ecco le ultime notizie da: "+param);
                return phrase[Math.floor(Math.random() * phrase.length)];
                }
            default:{
                phrase.push("These news are from "+ param + " site: ");
                phrase.push("Latest news from "+param+" site: ");
                phrase.push("The latest news from "+param+ " site: ");
                phrase.push("Here are the latest news from "+param+" site: ");
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
            }
        },
    
    TVProgramSentence(param :string, dbObj :BlockTVProgram) : string {
        let phrase = [];
        switch(lang.getLang()){
            case "it-IT":{
                phrase.push("Questa sera su "+ dbObj.getProgram() + "andrà in onda " + param.replace(dbObj.getProgram()+" - ", " "));
                phrase.push("In prima serata su "+ dbObj.getProgram() + " andrà in onda " + param.replace(dbObj.getProgram()+" - ", " "));
                phrase.push("Questa sera c'è "+ param.replace(dbObj.getProgram()+" - ", " ") + "su " + dbObj.getProgram());
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
            default:{
                phrase.push("This evening on "+ dbObj.getProgram() + " is shown" + param.replace(dbObj.getProgram()+" - ", " "));
                phrase.push("Tonight you can watch " + param.replace(dbObj.getProgram()+" - ", " ") + " on " + dbObj.getProgram());
                phrase.push("On "+ dbObj.getProgram() + " there is " + param.replace(dbObj.getProgram()+" - ", " ") + " this evening");
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
        }
        
    },

    WeatherSentence(data: any) : string {
        let phrase = [];
        switch(lang.getLang()){
            case "it-IT":{
                phrase.push("A "+ data.name + " il tempo è " + data.weather[0].description + ". La temperatura corrente è "+ data.main.temp +" gradi celsius");
                if(data.main.temp > 26){
                    phrase.push("Wow. A "+ data.name + " il tempo è " + data.weather[0].description + " . Si sta bene. La temperatura è di "+ data.main.temp +" gradi celsius" );
                    phrase.push("Wow. A "+ data.name + " il tempo è " + data.weather[0].description + " . Fa caldo. La temperatura è di " + data.main.temp +" gradi celsius" );
                }
                if(data.main.temp > 20 && data.main.temp < 26){
                    phrase.push("Wow. A "+ data.name + " il tempo è " + data.weather[0].description + " . C'è una piacevole temperatura di "+ data.main.temp +" gradi celsius" );
                    phrase.push(" A "+ data.name + " il tempo è " + data.weather[0].description + " . La temperatura è di "+ data.main.temp +" gradi celsius" );
                }
                if(data.main.temp < 20){
                    phrase.push("A "+ data.name + " il tempo è " + data.weather[0].description + " . è freschetto, vestiti bene. La temperatura è di "+ data.main.temp +" gradi celsius" );
                    phrase.push(" A "+ data.name + " il tempo è " + data.weather[0].description + " . La temperatura è tocca i "+ data.main.temp +" gradi celsius" );
                }
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
            default:{
                phrase.push("In "+ data.name + " the weather is " + data.weather[0].description + ". The current temperature is "+ data.main.temp +" degree celsius");
                if(data.main.temp > 26){
                    phrase.push("Wow. In "+ data.name + " the weather is " + data.weather[0].description + " . It's so warm. The current temperature is "+ data.main.temp +" degree celsius" );
                    phrase.push("Wow. In "+ data.name + " the weather is " + data.weather[0].description + " . IT's so hot. " + ". The current temperature is " + data.main.temp +" degree celsius" );
                }
                if(data.main.temp > 20 && data.main.temp < 26){
                    phrase.push("Wow. In "+ data.name + " the weather is " + data.weather[0].description + " . Enjoy this beatiful temperature which is "+ data.main.temp +" degree celsius" );
                    phrase.push(" In "+ data.name + " the weather is " + data.weather[0].description + " . The current temperature is "+ data.main.temp +" degree celsius" );
                }
                if(data.main.temp < 20){
                    phrase.push("In "+ data.name + " the weather is " + data.weather[0].description + " . It's a little cool dress well. The current temperature is "+ data.main.temp +" degree celsius" );
                    phrase.push(" In "+ data.name + " the weather is " + data.weather[0].description + " . The current temperature touches "+ data.main.temp +" degree celsius" );
                }

                return phrase[Math.floor(Math.random() * phrase.length)];
            }
        }
    },

    CancelIntent(){
        let phrase = [];
        switch(lang.getLang()){
            case "it-IT":{
                phrase.push("Va bene, a più tardi!");
                phrase.push("Ok, ci sentiamo dopo!");
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
            default:{
                phrase.push("All right, i'll talk to you later!");
                phrase.push("Ok, i'll talk to you later!");
                return phrase[Math.floor(Math.random() * phrase.length)];
            }
        }
    }

}