"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Token Fetch");
function TokenFetch() {
    var AuthenticationContext = require("adal-node").AuthenticationContext;
    var authorityHostUrl = "https://login.windows.net";
    var tenant = "meganb@M365x316380.onmicrosoft.com";
    var authorityUrl = authorityHostUrl + "/" + tenant;
    var applicationId = "1c3e4573-2277-4eba-a240-5f0bd7804b93";
    var clientSecret = "D-4PBO:.1+dk5jMsGs3AW+*n_iGOGZPz";
    var resource = "00000002-0000-0000-c000-000000000000";
    var context = new AuthenticationContext(authorityUrl);
    context.acquireTokenWithClientCredentials(resource, applicationId, clientSecret, function (err, tokenResponse) { return (
    /*
    if (err) {
        console.log("well that didn't work: " + err.stack);
    } else {
        console.log(tokenResponse);
    }
    */
    (err) ? console.log("well that didn't work: " + err.stack) : console.log(tokenResponse)); });
}
exports.TokenFetch = TokenFetch;
//# sourceMappingURL=token_fetch.js.map