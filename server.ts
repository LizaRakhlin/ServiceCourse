import dotenv = require('dotenv');
import express = require('express') ;

import { getLabels } from "./token_fetch";

// initialize configuration
dotenv.config();

// port is now available to the Node.js runtime 
// as if it were an environment variable
const port = process.env.SERVER_PORT;

const app = express();

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send("Hello");
});


app.get( "/tenants/:tenantId/app/:appId", ( req, res ) => {
    getLabels(req.params.tenantId, req.params.appId)
    .then((labels) => {
        res.send(labels);
    });
});


// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );

