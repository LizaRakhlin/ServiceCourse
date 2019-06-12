import dotenv = require("dotenv");
import * as utils from "util";
dotenv.config();

import fetch = require("node-fetch");
import xml2js = require("xml2js");

export const myTenant = "992d8d2f-5bb8-4131-9791-1f4b4a48e6d0";
export const myApplicationId = "9e6d8f78-eb08-40a6-b8ff-a9dcf9d2f038";

export async function TokenFetch(tenant: string, applicationId: string) {
    const AuthenticationContext = require("adal-node").AuthenticationContext;
    const authorityHostUrl = "https://login.windows.net";
    const authorityUrl = authorityHostUrl + "/" + tenant;
    const clientSecret = process.env.CLIENT_SECRET;
    const resource = "https://syncservice.o365syncservice.com";
    const context = new AuthenticationContext(authorityUrl);
    const acquireTokenAsync = utils.promisify(context.acquireTokenWithClientCredentials).bind(context);

    const token = await acquireTokenAsync(resource, applicationId, clientSecret);

    return token;
}

function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res;
  } else {
    const err = new Error(res.statusText);
    throw err;
  }
}

export async function getPolicy(token) {
    const response = await
        fetch("https://dataservice.protection.outlook.com/PsorWebService/v1/ClientSyncFile/MipPolicies",
            {
                headers:    {
                              "Authorization": "Bearer " + token.accessToken,
                              "Content-Type": "application/xml; charset=utf-8"
                            }
            }).then(checkStatus);
    return response;
}

// Print label names and id's from the policy
TokenFetch(myTenant, myApplicationId).then((token) => {
    getPolicy(token).then((policy) => {
        policy.text().then((policyXml) => {
            console.log(policyXml);
            const xmlParser = new xml2js.Parser();
            xmlParser.parseString(policyXml, (err, result) => {
                const labelsArray = result.SyncFile.Content[0].labels[0].label;
                labelsArray.forEach((element) => {
                    console.log("Label: name: " + element.$.name + " id: " + element.$.id);
                });
            });
        });
    });
});
