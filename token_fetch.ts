console.log("Token Fetch");

export function TokenFetch() {
    const AuthenticationContext = require("adal-node").AuthenticationContext;
    const authorityHostUrl = "https://login.windows.net";
    const tenant = "992d8d2f-5bb8-4131-9791-1f4b4a48e6d0";
    const authorityUrl = authorityHostUrl + "/" + tenant;
    const applicationId = "9e6d8f78-eb08-40a6-b8ff-a9dcf9d2f038";
    const clientSecret = "6LPUheLb]tNK5*km*]SBf20D2=[ZO4r8";
    const resource = "https://syncservice.o365syncservice.com";

    const context = new AuthenticationContext(authorityUrl);
    context.acquireTokenWithClientCredentials(resource, applicationId, clientSecret, (err, tokenResponse) => (
        (err) ? console.log("well that didn't work: " + err.stack) : console.log(tokenResponse)
    ));
}
