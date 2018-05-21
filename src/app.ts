import express from "express";


// Controllers (route handlers)

import * as projectManagerMiddleware from "./middleware/project-managers";
// API keys and Passport configuration


// Create Express server
const app = express();



// Express configuration
app.set("port", process.env.PORT || 3000);

/**
 * Primary app routes.
 */

app.use("/", projectManagerMiddleware.router);



export default app;