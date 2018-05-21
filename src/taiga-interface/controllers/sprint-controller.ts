import { Request, Response, NextFunction } from "express";
import request from "request";
import * as taigaInterface from "../lib";
import  { TaigaMilestone }  from "../models/";
import { Sprint } from "../../models/";
import express from "express";
import { taigaMilestonesToSprints, taigaMilestoneToSprint } from "../lib";
export const router = express.Router();
const base_url: String = "https://api.taiga.io/api/v1";

function getSprint (id: number, callback: Function) {
    let taigaMilestone: TaigaMilestone = new TaigaMilestone();
    let sprint: Sprint = new Sprint();
    request(base_url + "/milestones/" + id, function (error, response, body) {
        taigaMilestone = JSON.parse(body);
        sprint  = taigaInterface.taigaMilestoneToSprint(taigaMilestone);
        callback(sprint);
        });
    }

function getProjectSprints(project_id: String, callback: Function) {
    let taigaMilestones: TaigaMilestone[] = new Array<TaigaMilestone>();
    let sprints: Sprint[] = new Array<Sprint>();
    request({
            url: base_url + "/milestones",
            qs: {"project": project_id}
        },
        function (error, response, body) {
        taigaMilestones = JSON.parse(body);
        sprints  = taigaInterface.taigaMilestonesToSprints(taigaMilestones);
        callback(sprints);
        });
    }

router.use(
    function (req: Request, res: Response, next) {
    const projectid = req.query.project;
    if (projectid) {
        getProjectSprints (projectid,
            function (sprints: Sprint[]) {
                res.send(sprints);
            });
    }
    else {
        next();
    }
});
router.get("/:id",
    function (req: Request, res: Response, next) {
        getSprint (req.params.id,
        function (sprints: Sprint[]) {
            res.json(sprints);
        });
    }
);