import express, { Request, Response, NextFunction } from "express";
import Octokit, {
    IssuesListMilestonesForRepoResponseItem
} from "@octokit/rest";
import { GraphQLClient } from "graphql-request";
import { MilestoneQueries, IssueQueries } from "../graphql";
import { Sprint, SprintOfNotSolvedStories } from "../../models/Sprint";
import { gitMilestoneToSprint } from "../lib";
export const router = express.Router();

async function getProjectSprints(graphql: GraphQLClient, projectId: string|number): Promise<Sprint[]> {
    let milestones  = new Array<IssuesListMilestonesForRepoResponseItem>();
    console.log(graphql);
     try {
        const miestonesResponse  = <any> await graphql.request(MilestoneQueries.listForProject, {projectId: projectId });
        console.log(miestonesResponse);
        const {node: {milestones: {nodes: _milestones}}} = miestonesResponse;
        milestones = _milestones;
    } catch (err) {
        console.log(err);
        throw Error(err);
    }
    const defaultSprint = new Sprint();
    defaultSprint.name = "Sprint por defecto (historias no asignadas en sprints)";
    defaultSprint.id = SprintOfNotSolvedStories;
    const sprints = milestones.map(gitMilestoneToSprint);
    sprints.push(defaultSprint);
    return sprints;
}

router.use(
    async function (req: Request, res: Response, next) {
        const projectid = req.query.project;
        const append_points = req.query.append_points;

        if ( projectid ) {
            if ( append_points === 1 ) {

            } else {
                const sprints = await getProjectSprints(<GraphQLClient>req.graphql, projectid);
                res.send(sprints);
            }
        }
        else {
            next();
        }
    });