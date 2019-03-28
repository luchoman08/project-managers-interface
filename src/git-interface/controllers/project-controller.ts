
import express, { Request, Response } from "express";
import { Project } from "../../models";
import { GraphQLClient } from "graphql-request";
import Octokit, {
    ReposListPublicResponseItem
} from "@octokit/rest";
import { gitRepoToProject } from "../lib";
import { ProjectQueries } from "../graphql";
export const router = express.Router();
export async function getProject(g: GraphQLClient, id: string| number ): Promise<Project> {
    const repo = await g.request(ProjectQueries.getByNodeId, {id: id});
    return gitRepoToProject(<any>repo);
}

export async function getProjectsByMemberUsername(octo: Octokit, username: string): Promise<Project[]> {
    try {
        const {data: gitRepos} =  await octo.repos.listForUser({username:  username});
        const projects: Project[] = gitRepos.map(  (repo: ReposListPublicResponseItem ) =>
            gitRepoToProject(repo));
        return projects;
    } catch (err) {
        console.log(err);
    }
}

router.use (
    async function (req: Request, res: Response, next)  {
    const member = req.query.member;
    const slug = req.query.slug;
    if ( member ) {

        const projects = await getProjectsByMemberUsername(<Octokit>req.octokit, member);
        res.json(projects);
    }
    else {
        next();
    }
});
router.get("/:username/:reponame",
    async function (req: Request, res: Response) {
        const project = await getProject (req.params.username, req.params.reponame);
        res.json(project);
    }
);
