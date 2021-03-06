"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const utils = require("util");
dotenv.config();
const fetch = require("node-fetch");
const xml2js = require("xml2js");
exports.myTenant = "992d8d2f-5bb8-4131-9791-1f4b4a48e6d0";
exports.myApplicationId = "9e6d8f78-eb08-40a6-b8ff-a9dcf9d2f038";
function TokenFetch(tenant, applicationId) {
    return __awaiter(this, void 0, void 0, function* () {
        const AuthenticationContext = require("adal-node").AuthenticationContext;
        const authorityHostUrl = "https://login.windows.net";
        const authorityUrl = authorityHostUrl + "/" + tenant;
        const clientSecret = process.env.CLIENT_SECRET;
        const resource = "https://syncservice.o365syncservice.com";
        const context = new AuthenticationContext(authorityUrl);
        const acquireTokenAsync = utils.promisify(context.acquireTokenWithClientCredentials).bind(context);
        const token = yield acquireTokenAsync(resource, applicationId, clientSecret);
        return token;
    });
}
exports.TokenFetch = TokenFetch;
function checkStatus(res) {
    if (res.status >= 200 && res.status < 300) {
        return res;
    }
    else {
        const err = new Error(res.statusText);
        throw err;
    }
}
function getPolicy(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://dataservice.protection.outlook.com/PsorWebService/v1/ClientSyncFile/MipPolicies", {
            headers: {
                "Authorization": "Bearer " + token.accessToken,
                "Content-Type": "application/xml; charset=utf-8"
            }
        }).then(checkStatus);
        return response;
    });
}
exports.getPolicy = getPolicy;
function getXmlObjFromPolicy(policy) {
    return __awaiter(this, void 0, void 0, function* () {
        const policyXml = yield policy.text();
        const xmlParser = new xml2js.Parser();
        const parseAsync = utils.promisify(xmlParser.parseString).bind(xmlParser);
        const xmlObj = yield parseAsync(policyXml);
        return xmlObj;
    });
}
exports.getXmlObjFromPolicy = getXmlObjFromPolicy;
exports.getLabelsFromXml = (xmlObj) => {
    const labels = [];
    xmlObj.SyncFile.Content[0].labels[0].label.forEach((el) => {
        labels.push({ name: el.$.name, id: el.$.id });
    });
    return labels;
};
function getLabels(tenant, applicationId) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield TokenFetch(tenant, applicationId);
        const policy = yield getPolicy(token);
        const xmlObj = yield getXmlObjFromPolicy(policy);
        return exports.getLabelsFromXml(xmlObj);
    });
}
exports.getLabels = getLabels;
//getLabels(myTenant, myApplicationId).then((labels) => console.log(labels));
//# sourceMappingURL=token_fetch.js.map