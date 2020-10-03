import dotenv from 'dotenv';
import util from 'util';
import { ResourceManagementClient, ResourceManagementModels, ResourceManagementMappers } from "@azure/arm-resources"; 
import * as msRestNodeAuth from "@azure/ms-rest-nodeauth";
import { AzureCliCredentials } from "@azure/ms-rest-nodeauth";
// https://docs.microsoft.com/en-us/javascript/api/@azure/ms-rest-nodeauth/applicationtokencredentials?view=azure-node-latest
// new ApplicationTokenCredentials(clientId: string, domain: string, secret: string, tokenAudience?: TokenAudience, environment?: Environment, tokenCache?: TokenCache)

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();  
}

async function authenticate() {
    const creds = await AzureCliCredentials.create();
    return creds;
}

async function authenticateServicePrincal() {
    _validateEnvironmentVariables();
    let creds = new msRestNodeAuth.ApplicationTokenCredentials(process.env['CLIENT_ID'], process.env['DOMAIN'], process.env['APPLICATION_SECRET']);
    return creds;
}

async function main() {
    const creds = await authenticate();

    
    const subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
    const client = new ResourceManagementClient(creds, subscriptionId);

    /*
    let result = await client.resourceGroups.list();
    console.log("The resourceGroups result is:");
    console.log(result);
    */
    
    client.apiVersion = '2015-01-01';

    try {
        let operationsResult = await client.operations.list();
        console.log("The result is:");
        console.log(operationsResult);
    } catch (err) {
        console.error(err);
    }
    
}


function _validateEnvironmentVariables() {
    var envs = [];
    if (!process.env['CLIENT_ID']) envs.push('CLIENT_ID');
    if (!process.env['DOMAIN']) envs.push('DOMAIN');
    if (!process.env['APPLICATION_SECRET']) envs.push('APPLICATION_SECRET');
    if (!process.env['AZURE_SUBSCRIPTION_ID']) envs.push('AZURE_SUBSCRIPTION_ID');
    if (envs.length > 0) {
      throw new Error(util.format('please set/export the following environment variables: %s', envs.toString()));
    }
}


main();