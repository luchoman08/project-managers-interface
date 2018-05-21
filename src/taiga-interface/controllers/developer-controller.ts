
import { Request, Response, NextFunction } from "express";
import request from "request";
import * as taigaInterface from "../lib";
import  { TaigaMembership }  from "../models/";
import { taigaMembershipsToDevelopers, taigaMembershipToDeveloper } from "../lib";
import { ServerResponse } from "http";
import express from "express";
import { Developer } from "../../models/Developer";
export const router = express.Router();

const base_url: String = "https://api.taiga.io/api/v1";

function getDeveloper (id: number, callback: Function) {
    let taigaMembership: TaigaMembership = new TaigaMembership();
    let developer: Developer = new Developer();
    request(base_url + "/memberships/" + id, function (error, response, body) {
        taigaMembership = JSON.parse(body);
        project  = taigaInterface.taigaMembershipToDeveloper(taigaMembership);
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
            developers  = taigaInterface.taigaMembershipsToDevelopers(taigaMemberships);
            callback(developers);
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
