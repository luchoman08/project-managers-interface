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

function getProjectSprints(project_id: String, callback: Function) {
    let taigaMilestones: TaigaMilestone[] = new Array<TaigaMilestone>();
    let sprints: Sprint[] = new Array<Sprint>();
    request({
        url: base_url + "/milestones",
        qs: { "project": project_id }
    },
        function (error, response, body) {
            taigaMilestones = JSON.parse(body);
            sprints = taigaInterface.taigaMilestonesToSprints(taigaMilestones);
            callback(sprints);
        });
}

function getProjectSprintsWithUserStoryPoints(project_id: String, callback: Function) {
    let taigaMilestones: TaigaMilestone[] = new Array<TaigaMilestone>();
    let sprints: Sprint[] = new Array<Sprint>();
    rp({
        url: base_url + "/milestones",
        qs: { "project": project_id }
    }).then(
        (body: HTMLBodyElement) => {
            taigaMilestones = JSON.parse(String(body));
            projectController.getTaigaProject(<string>project_id)
            .then(
                (project: TaigaProject) => {
                    /* taiga milestones to sprint with project can extract user story punctuations */
                    sprints = taigaInterface.taigaMilestonesToSprints(taigaMilestones, project);
                    callback(sprints);
                }
            )
            .catch(
                (error: any) => {
                    callback( error);
                 }
            );

        }).catch(
            (error: any) => {
               callback( error);
            });
}
router.use(
    function (req: Request, res: Response, next) {
        const projectid = req.query.project;
        const append_points = req.query.append_points;
        console.log(append_points, " append points from get project sprints");
        if ( projectid ) {
            if ( append_points ) {
                getProjectSprintsWithUserStoryPoints(projectid,
                function(sprints: Sprint[]) {
                    res.send(sprints);
                });
            } else {
            getProjectSprints(projectid,
                function (sprints: Sprint[]) {
                    res.send(sprints);
                });
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