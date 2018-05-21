
import { Request, Response, NextFunction } from "express";
import request from "request";
import * as taigaInterface from "../lib";
import  { TaigaProject }  from "../models/";
import { Project } from "../../models/";
import { taigaProjectsToProjects } from "../lib";
import { ServerResponse } from "http";
import express from "express";
export const router = express.Router();

const base_url: String = "https://api.taiga.io/api/v1";

function getProject (id: number, callback: Function) {
    let taigaProject: TaigaProject = new TaigaProject();
    let project: Project = new Project();
    request(base_url + "/projects/" + id, function (error, response, body) {
        taigaProject = JSON.parse(body);
        project  = taigaInterface.taigaProjectToProject(taigaProject);
        callback(project);
        });
    }

function getProjectBySlug(slug: string, callback: Function) {
    let taigaProject: TaigaProject = new TaigaProject();
    let project: Project = new Project();
    request({
            url: base_url + "/projects/by_slug",
            qs: {"slug": slug}
        },
        function (error, response, body) {
            taigaProject = JSON.parse(body);
            project  = taigaInterface.taigaProjectToProject(taigaProject);
            callback(project);
        });
}

function getProjectsByMemberId(member_id: String, callback: Function) {
    let taigaProjects: TaigaProject[] = new Array<TaigaProject>();
    let projects: Project[] = new Array<Project>();
    request({
            url: base_url + "/projects",
            qs: {"member": member_id}
        },
        function (error, response, body) {
            taigaProjects = JSON.parse(body);
            projects  = taigaInterface.taigaProjectsToProjects(taigaProjects);
            callback(projects);
        });
    }


router.use (
    function (req: Request, res: Response, next)  {
        console.log(req.url);
    const member = req.query.member;
    const slug = req.query.slug;
    if (member) {
        getProjectsByMemberId (member,
            function (projects: Project[]) {
                res.json(projects);
            });
    }
    else if (slug) {
        console.log(slug);
        getProjectBySlug (slug,
            function (project: Project) {
                res.json(project);
            });
    }
    else {
        next();
    }
});
router.get("/:id",
    function (req: Request, res: Response, next) {
        getProject (req.params.id,
            function (projects: Project[]) {
                res.json(projects);
            }
        );
    }
);
