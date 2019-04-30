import { Request, Response, NextFunction } from "express";
import request from "request";
import * as taigaInterface from "../lib";
import { TaigaMilestone, TaigaProject } from "../models/";
import { Sprint, Project } from "../../models/";
import express from "express";
import rp from "request-promise";
import * as projectController from "./project-controller";

export const router = express.Router();
const base_url: String = "https://api.taiga.io/api/v1";

async function getSprint(id: number, projectId: number|string): Promise<Sprint> {
    let taigaMilestone: TaigaMilestone = new TaigaMilestone();
    let sprint: Sprint = new Sprint();
    const project = await projectController.getTaigaProject(projectId);
    return rp(base_url + "/milestones/" + id, function (error, response, body) {
        taigaMilestone = JSON.parse(body);
        sprint = taigaInterface.taigaMilestoneToSprint(taigaMilestone, project);
        return sprint;
    });
}

async function getProjectSprints(project_id: String): Promise<Sprint[]> {
    const response = await rp({
        url: base_url + "/milestones",
        qs: { "project": project_id }
    });
    console.log(response, 'taiga reponse at get project milestone');
    const taigaMilestones: TaigaMilestone[] = JSON.parse(response);
     const sprints = taigaInterface.taigaMilestonesToSprints(taigaMilestones);
     return sprints;
}

async function getProjectSprintsWithUserStoryPoints(project_id: String): Promise<any> {
    const response = await rp({
        url: base_url + "/milestones",
        qs: { "project": project_id }
    });
    const taigaMilestones = JSON.parse(response);
    const taigaProject = await projectController.getTaigaProject(<string>project_id);
   const sprints = taigaInterface.taigaMilestonesToSprints(taigaMilestones, taigaProject);
    return sprints;
}
router.use(
    async function (req: Request, res: Response, next) {
        const projectid = req.query.project;
        const append_points = req.query.append_points;
        console.log(append_points, " append points from get project sprints");
        if ( projectid ) {
            if ( append_points ) {
                const sprints = await getProjectSprintsWithUserStoryPoints(projectid);
                res.json(sprints);
            } else {
            const sprints = await getProjectSprints(projectid);
            res.json(sprints);
            }
        }
        else {
            next();
        }
    });
router.get("/:id",
    async function (req: Request, res: Response, next) {
        const sprint_id = req.params.id;
        const project_id = req.params.project_id;
        const sprint = await getSprint(sprint_id, project_id);
        return res.json(sprint);
    }
);