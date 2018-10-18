
import { Request, Response, NextFunction } from "express";
import request from "request";
import rp from "request-promise";
import * as taigaInterface from "../lib";
import  { TaigaMembership, TaigaProject }  from "../models/";

import express from "express";
import { Developer } from "../../models/Developer";
import * as projectController from "./project-controller";
export const router = express.Router();

const base_url: String = "https://api.taiga.io/api/v1";

function getDeveloper (id: number, callback: Function) {
    let taigaMembership: TaigaMembership = new TaigaMembership();
    let developer: Developer = new Developer();

    request(base_url + "/memberships/" + id, function (error, response, body) {
        taigaMembership = JSON.parse(body);
        developer  = taigaInterface.taigaMembershipToDeveloper(taigaMembership);
        callback(developer);
        });
    }


function getProjectDevelopers(project_id: String, callback: Function) {
    let taigaMemberships: TaigaMembership[] = new Array<TaigaMembership>();
    let developers: Developer[] = new Array<Developer>();
    request({
            url: base_url + "/memberships",
            qs: {"project": project_id}
        },
        function (error, response, body) {
            taigaMemberships = JSON.parse(body);
            projectController.getTaigaProject(<string>project_id)
            .then(
                (taigaProject: TaigaProject) => {
                    console.log("llamado a get project developers");
                    developers  = taigaInterface.taigaMembershipsToDevelopers(taigaMemberships, taigaProject);
                    callback(developers);
                }
            )
            .catch(
                (error: any) => {
                    callback(error);
                }
            );

        });
    }


router.use (
    function (req: Request, res: Response, next)  {
        console.log(req.url);
    const project = req.query.project;
    if (project) {
        getProjectDevelopers (project,
            function (developers: Developer[]) {
                res.send(developers);
            });
    }
    else {
        next();
    }
});
router.get("/:id",
    function (req: Request, res: Response, next) {
        getDeveloper (req.params.id,
            function (developer: Developer) {
                res.json(developer);
            }
        );
    }
);
