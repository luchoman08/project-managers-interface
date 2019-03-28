import express, { Request, Response } from "express";
import  {
    IssuesListMilestonesForRepoResponseItem
} from "@octokit/rest";
import { GraphQLClient } from "graphql-request";
import { MilestoneQueries, IssueQueries } from "../graphql";
import { Sprint, SprintOfNotSolvedStories } from "../../models/Sprint";
import { gitMilestoneToSprint } from "../lib";
export const router = express.Router();
type RepoInfo = {
    owner: string, name: string;
};
type ProjectId = string|number;
export async function getGitMilestones(graphql: GraphQLClient, repoInfo: ProjectId | RepoInfo): Promise<any> {
    if (typeof repoInfo === "string" || typeof repoInfo === "number" ) {
        console.log(repoInfo, "repoinfo");
        const miestonesResponse  = <any> await graphql.request(MilestoneQueries.listForProject, {projectId: repoInfo });
        const {node: {milestones: {nodes: _milestones}}} = miestonesResponse;
        return _milestones;
    } if ((<RepoInfo>repoInfo).owner !== undefined ) {
        const milestonesResponse = <any> await graphql.request(MilestoneQueries.listForProjectWithRepoInfo, <RepoInfo>repoInfo);
        const  {repository: {milestones: {nodes: _milestones}}} = milestonesResponse;
        return _milestones;
    }
}
async function getProjectSprints(graphql: GraphQLClient, repoInfo: ProjectId | RepoInfo): Promise<Sprint[]> {
    let milestones  = new Array<IssuesListMilestonesForRepoResponseItem>();
    console.log(graphql);
     try {
        milestones = await getGitMilestones(graphql, repoInfo );
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
        const projectId = req.query.project;
        const append_points = req.query.append_points;
        const owner = req.query.owner;
        const name = req.query.name;
        if ( projectId ) {
            if ( append_points === 1 ) {

            } else {
                const sprints = await getProjectSprints(<GraphQLClient>req.graphql, projectId);
                res.send(sprints);
            }
        } else if (typeof owner === "string" && typeof name === "string") {
            const repoInfo: RepoInfo = {owner: owner, name: name};

            const sprints = await getProjectSprints(<GraphQLClient>req.graphql, repoInfo);
            res.send(sprints);
        }
        else {
            next();
        }
    });