import * as utils from 'util';
require('dotenv').config();

export async function TokenFetch(tenant : string, applicationId : string) {
    const AuthenticationContext = require("adal-node").AuthenticationContext;
    const authorityHostUrl = "https://login.windows.net";
    //const tenant = "992d8d2f-5bb8-4131-9791-1f4b4a48e6d0";
    const authorityUrl = authorityHostUrl + "/" + tenant;
    //const applicationId = "9e6d8f78-eb08-40a6-b8ff-a9dcf9d2f038";
    //const clientSecret = "6LPUheLb]tNK5*km*]SBf20D2=[ZO4r8";
    const clientSecret = process.env.CLIENT_SECRET;
    const resource = "https://syncservice.o365syncservice.com";

    const context = new AuthenticationContext(authorityUrl);

    let acquireTokenAsync = utils.promisify(context.acquireTokenWithClientCredentials).bind(context);

    let token = await acquireTokenAsync(resource, applicationId, clientSecret);

    console.log(token);
}
