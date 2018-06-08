import express from "express";
import bodyParser from 'body-parser';
import  bearerToken from 'express-bearer-token';

// Controllers (route handlers)

import * as projectManagerMiddleware from "./middleware/project-managers";
// API keys and Passport configuration


// Create Express server
const app = express();
app.use(bodyParser.json()); //body injector, json data send to req.body
app.use(bearerToken()); // req.token injector

// Express configuration
app.set("port", process.env.PORT || 3000);

/**
 * Primary app routes.
 */

app.use("/", projectManagerMiddleware.router);



export default app;
