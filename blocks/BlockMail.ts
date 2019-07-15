import { Block } from "../blocks/Block";
import { tokenGoogleApi, credentials } from "./Blockstype";
import { google } from "googleapis"
// import https from "https"
var OAuth2 = google.auth.OAuth2;


export class BlockMail implements Block {

    private access_token ="";
    
    constructor(access_token:string){
        this.access_token = "ya29.GltFBzTkIbvYQB4YQtJukGAVnKKxY70FWmU0XXIbamOGh7xdXQGwx3EwYtzooDaSvPnjYfDDLu2E1Q4PKvyE1dVhfn5qedxMG0bI5suVh7hFjKewjEcnHHEZIwjE";
    }

    private CLIENT_ID = "835604593037-18duga0qskmkvu8kq52bp4osdf00nibm.apps.googleusercontent.com"; //replace with your client ID
    private CLIENT_SECRET = "BEp040pS5yM3lFSTsyx--b6c"; //replace with client secret
    private REDIRECT_URL = "https://layla.amazon.com/api/skill/link/M330044GHIH1EN"; //replace with your redirect URL 

    private oauth2Client = new OAuth2(this.CLIENT_ID, this.CLIENT_SECRET, this.REDIRECT_URL);
    
    

    private MAX_NUMBER_MESSAGES = 3; //max number of messages to retrieve 
    private UNREAD_MAIL_QUERY = 'is:unread'; //can add query i.e. category:(primary OR promotions)'

    private APP_ID = "amzn1.ask.skill.6e14a7ec-b603-45bf-8a5b-3ad02fe6c8f3"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]"

    public run(): Promise<string> {
        return this.getNumberMail(this.access_token);
    }

    public getNumberMail(accessToken:string) :any {
        var speechOutput = "This is a mistake.";
        var repromptOutput = "Please say yes or no to list messages, or cancel.";
        //set sessionAttributes
        var sessionAttributes : {
            messagesIndex:number,
            gmailMessageIDList :string[],
            numberMessagesReturned :number
        } = { 'messagesIndex': 0, 'gmailMessageIDList' :[], 'numberMessagesReturned' : 0}; 

        // set access token
        this.oauth2Client.setCredentials({access_token: accessToken});
        console.log(accessToken);
        let gmail = google.gmail('v1');
        return new Promise<string> ((resolve) => {
            return gmail.users.messages.list({ 
            auth: this.oauth2Client,
            userId: 'shannubansal@gmail.com',  
            maxResults: this.MAX_NUMBER_MESSAGES, 
            // q: this.UNREAD_MAIL_QUERY
            }, function (err, response) {
                if (err) {
                    console.log('The GMail API returned an error: ' + err);

                    speechOutput = 'GMail returned an error while getting your mail.';
                    console.log(speechOutput);
                    resolve(speechOutput)
                } else {
                    if (response && response.data.messages != undefined) {
                        sessionAttributes.numberMessagesReturned = response.data.messages.length;
                        response.data.messages.forEach(function(value) {
                        //value.id is the message ID
                        if(value && value.id)
                            sessionAttributes.gmailMessageIDList.push(value.id);
                        });
                    } else {
                        sessionAttributes.numberMessagesReturned = 0;
                    }
                    speechOutput = ' You have ' + sessionAttributes.numberMessagesReturned + ' unread ' +  (sessionAttributes.numberMessagesReturned === 1 ? (' message ') : ' messages ') + ' in your account.'; 
                                    
                    if (sessionAttributes.numberMessagesReturned !== 0) {
                        gmail.users.messages.get({
                            'userId': sessionAttributes.gmailMessageIDList[0],
                            'id': 'me'
                          })
                          .then((value) => {
                                console.log(value.data.payload);
                          });
                    }
                    console.log(speechOutput);
                };
            });
        });
        console.log(sessionAttributes.messagesIndex);
        return sessionAttributes;
    };
    
}