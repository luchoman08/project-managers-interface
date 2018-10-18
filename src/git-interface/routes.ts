import { Request, Response, NextFunction } from "express";
import Octokit from "@octokit/rest";
import express from "express";
import * as project_controller from "./controllers/project-controller";
import * as sprints_controller from "./controllers/sprint-controller";
import { GITHUB_TOKEN } from "../config";

import { GraphQLClient } from "graphql-request";
export const router = express.Router();

function initOctoLoggedIn(token?: string): Octokit {
    if (!token) {
        return new Octokit();
    } else {
        return new Octokit({auth: `token ${token}`});
    }
}
function initGraphLoggedIn(token?: string): GraphQLClient {
    if (!token) {
        return new GraphQLClient("https://api.github.com/graphql");
    } else {
        return new GraphQLClient("https://api.github.com/graphql", {headers: {authorization: `bearer ${token}`}});
    }
}

router.use(function (req: Request, res: Response, next: NextFunction) {
    req.octokit = initOctoLoggedIn(GITHUB_TOKEN);
    req.graphql = initGraphLoggedIn(GITHUB_TOKEN);
    next();
});

router.use("/projects", project_controller.router);
router.use("/sprints", sprints_controller.router);