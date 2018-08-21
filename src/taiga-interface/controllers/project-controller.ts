
import { Request, Response, NextFunction } from "express";
import request from "request";
import rp from 'request-promise';

import * as taigaInterface from "../lib";
import  { TaigaProject }  from "../models/";
import { Project } from "../../models/";

import express from "express";
export const router = express.Router();

const base_url: String = "https://api.taiga.io/api/v1";


export function getTaigaProject (id: number | string): Promise<TaigaProject> {
    let taigaProject: TaigaProject = new TaigaProject();
    return rp(base_url + "/projects/" + id)
    .then( (body: HTMLBodyElement) => {
        taigaProject = JSON.parse(String(body));
        return taigaProject;
        });
    }
export function getProject (id: number | string): Promise<Project> {
    let taigaProject: TaigaProject = new TaigaProject();
    let project: Project = new Project();
    return rp(base_url + "/projects/" + id)
    .then( (body: HTMLBodyElement) => {
        taigaProject = JSON.parse(String(body));
        project  = taigaInterface.taigaProjectToProject(taigaProject);
        return project;
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
    function (req: Request, res: Response) {
        getProject (req.params.id)
        .then(
            (project: Project) => {
                res.json(project);
            }
        )
    }
);
