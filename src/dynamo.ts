import * as AWS from 'aws-sdk';
// let config = {
//     "apiVersion": "2012-08-10",
//     "region": "us-east-1",
//     "endpoint": "http://localhost:8000" //talk to local DynamoDB on port 3333
// }
const docClient = new AWS.DynamoDB.DocumentClient({"region": "eu-west-1"});

export class DB {
    // private static instance: DB;

    private idUser :string;

    constructor(idUser: string) {this.idUser = idUser};

    getWorkflow (work : string) : Promise<AWS.DynamoDB.DocumentClient.QueryOutput> {
        let tableName = 'Workflow';
        // console.log("sono dentro getWorkflow");
        // console.log(this.idUser + " " + work);
        const params = {
            TableName: tableName,
            KeyConditionExpression: 'IDUser = :id AND WorkflowName = :wf',
            ExpressionAttributeValues: {
                ':id' : this.idUser,
                ':wf' : work
            },
            // ProjectionExpression: "Blocks, WelcomeText"
        };

        return new Promise((resolve : any, reject : any) => {
            docClient.query(params, (err, data) => {
                if (err) {
                    // console.log(err.toString());
                    // console.log("la query NON è andata a buon fine");
                    reject(err);
                }
                else {                
                    // console.log(JSON.stringify(data));
                    // console.log("la query è andata a buon fine");
                    resolve(data);
                }
            });
        });
    }

    getAllWorkflow () : Promise<AWS.DynamoDB.DocumentClient.QueryOutput> {
        let tableName = 'Workflow';
        const idUser = this.idUser;
        
        let params = {
            TableName: tableName,
            KeyConditionExpression: 'IDUser = :id',
            ExpressionAttributeValues: {
                ':id' : idUser
            }
            
        };

        return new Promise((resolve : any, reject : any) => {
            docClient.query(params, (err, data) => {
                if (err) {
                    // console.log(err.toString());
                    // console.log("la query NON è andata a buon fine");
                    reject(err);
                }
                else {                
                    // console.log(JSON.stringify(data));
                    // console.log("la query è andata a buon fine");
                    resolve(data);
                }
            });
        });
    }


    getAllWorkflowOrderBy(param :string) : Promise<AWS.DynamoDB.DocumentClient.QueryOutput> {
        const table = 'Workflow';
        const idUser = this.idUser;
        
        var params = {
            TableName: table,
            IndexName: 'IDUser-' + param + '-index',
            KeyConditionExpression: 'IDUser = :id',
            ExpressionAttributeValues: {
                ':id': idUser
            },
            ScanIndexForward: false
        };
        
        return new Promise((resolve, reject) => {
            docClient.query(params, (err, data) => {
                if(err) reject(err);
                else resolve(data);
            });
        });
    };

    getUserInfo() : Promise<AWS.DynamoDB.DocumentClient.QueryOutput> {
        
        let tableName = 'User';
        const params = {
            TableName: tableName,
            KeyConditionExpression: 'IDUser = :id',
            ExpressionAttributeValues: {
                ':id' : this.idUser
            }
        };
        return new Promise((resolve : any, reject : any) => {
            docClient.query(params, (err, data) => {
                if (err) {
                    // console.log(err.toString());

                    reject(err);
                }
                else {                
                    // console.log(JSON.stringify(data));
                    resolve(data);
                }
            });
        });
    }
}