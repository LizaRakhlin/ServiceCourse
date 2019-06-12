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

export async function getXmlObjFromPolicy(policy) {
    const policyXml = await policy.text();
    const xmlParser = new xml2js.Parser();

    const parseAsync = utils.promisify(xmlParser.parseString).bind(xmlParser);
    const xmlObj = await parseAsync(policyXml);

    return xmlObj;
}

export let getLabelsFromXml = ( xmlObj ) => {   const labels = [];
                                                xmlObj.SyncFile.Content[0].labels[0].label.forEach((el) => {
                                                    labels.push({name: el.$.name, id: el.$.id});
                                                });

                                                return labels;
                                            };
export async function getLabels(tenant: string, applicationId: string) {
    const token = await TokenFetch(tenant, applicationId);
    const policy = await getPolicy(token);

    const xmlObj = await getXmlObjFromPolicy(policy);
    return getLabelsFromXml(xmlObj);
}

//getLabels(myTenant, myApplicationId).then((labels) => console.log(labels));
