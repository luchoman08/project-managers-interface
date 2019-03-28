import { Request, Response, NextFunction } from "express";
import Octokit from "@octokit/rest";
import express from "express";
import * as project_controller from "./controllers/project-controller";
import * as sprints_controller from "./controllers/sprint-controller";
import { GITHUB_TOKEN } from "../config";

import { GraphQLClient } from "graphql-request";
export const router = express.Router();
/**
 * This work with native git routes, example:
 * localhost:8000/luchoman08/moduloases should show the project information of a project
 * repo moduloases converted to `Project`
 */
export const nativeRouter = express.Router();
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
function initReqGitClients(req: Request, res: Response, next: NextFunction) {
    req.octokit = initOctoLoggedIn(GITHUB_TOKEN);
    req.graphql = initGraphLoggedIn(GITHUB_TOKEN);
    next();
}
router.use(initReqGitClients);
nativeRouter.use(initReqGitClients);
router.use("/projects", project_controller.router);
router.use("/sprints", sprints_controller.router);
nativeRouter.get("/:owner/:name/issues", async function(req, res) {
    try {
        const issues = await sprints_controller.getGitMilestones(
        <GraphQLClient>req.graphql,
        {owner: req.params.owner, name: req.params.name}
        );
        res.json(issues);
    } catch (e) {console.log(e, "at native router git get issues"); }

});

nativeRouter.get("/:owner/", async function(req, res) {
    try {
        const projects = await project_controller.getProjectsByMemberUsername(
        <Octokit>req.octokit,
        req.params.owner
        );
        res.json(projects);
    } catch (e) {console.log(e, "at native router git get issues"); }

});