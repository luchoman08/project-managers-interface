
import { Request, Response } from "express";
import request from "request";
import rp from "request-promise";

import * as taigaInterface from "../lib";
import  { TaigaProject }  from "../models/";
import { Project } from "../../models/";

import express from "express";
export const router = express.Router();

const base_url: String = "https://api.taiga.io/api/v1";


export async function getTaigaProject (id: number | string): Promise<TaigaProject> {
    const response = await rp(base_url + "/projects/" + id);
    return response;
    }
export async function getProject (id: number | string): Promise<Project> {
    let taigaProject: TaigaProject = new TaigaProject();
    let project: Project = new Project();
    const body = await rp(base_url + "/projects/" + id);
    taigaProject = JSON.parse(String(body));
    project  = taigaInterface.taigaProjectToProject(taigaProject);
    return project;
    }

async function  getProjectBySlug(slug: string): Promise<Project> {
    let taigaProject: TaigaProject = new TaigaProject();
    let project: Project = new Project();
    const response = await rp({
            url: base_url + "/projects/by_slug",
            qs: {"slug": slug}
        });
    taigaProject = JSON.parse(response);
    project  = taigaInterface.taigaProjectToProject(taigaProject);
    return project;
}

async function getProjectsByMemberId(member_id: String): Promise<Project[]> {
    const taigaProjects = await  rp({
            url: base_url + "/projects",
            qs: {"member": member_id}
        });
    const projects  = taigaInterface.taigaProjectsToProjects(taigaProjects);
    return projects;
    }
router.use (
    async function (req: Request, res: Response, next)  {
        console.log(req.url);
    const member = req.query.member;
    const slug = req.query.slug;
    if (member) {
        const project = await getProjectsByMemberId (member);
        return project;
    }
    else if (slug) {
        console.log(slug);
        const project = await getProjectBySlug (slug);
        res.json(project);
    }
    else {
        next();
    }
});
router.get("/:id",
    async function (req: Request, res: Response) {
        const project =  await getProject (req.params.id);
        res.send(project);
    }
);
