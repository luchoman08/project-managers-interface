
import { Request, Response, NextFunction } from "express";
import request from "request";
import rp from 'request-promise';

import * as taigaInterface from "../lib";
import { TaigaUserStory } from '../models/TaigaUserStory';
import { UserStory } from '../../models/UserStory';
import express from "express";
import { taigaStoryToUserStory } from '../lib';
export const router = express.Router();
const base_url: String = "https://api.taiga.io/api/v1";
var bearerToken: string;
function getTaigaUserStory(id: number|string): TaigaUserStory {
    return rp(base_url + "/userstories/" + id).then(
        (body:string) => {
            return JSON.parse(body) as TaigaUserStory;
        }
    )
}

function getUserStory (id: number): Promise<UserStory> {
    let taigaUserStory: TaigaUserStory = new TaigaUserStory();
    let userStory: UserStory = new UserStory();
    return rp(base_url + "/userstories/" + id)
    .auth(null, null, true, bearerToken)
    .then( (body:HTMLBodyElement) =>{
        taigaUserStory = JSON.parse(String(body));
        userStory  = taigaInterface.taigaStoryToUserStory(taigaUserStory);
        return userStory;
        });
    }

function setUserStory(userStory: UserStory): Promise<UserStory> {
    return getTaigaUserStory(userStory.id)
    .then(
        (taigaUserStory: TaigaUserStory) => {
            console.log(taigaUserStory, 'version de historia de usuario');
            taigaUserStory.assigned_to = userStory.assigned_to;
            taigaUserStory.assigned_users = [userStory.assigned_to];
            return rp.patch(
                {
                    url: `${base_url}/userstories/${userStory.id}`,
                    json: taigaUserStory
                }
            )
            .auth(null, null, true, bearerToken)
            .then(
                (taigaUserStory: TaigaUserStory) => {
                    return taigaStoryToUserStory(taigaUserStory);
                }
            )
        }).catch(
            error =>  {
                return error.error;
            }
        );
}


function getProjectuserStories(project_id: String, callback: Function) {
    let taigaUserStories: TaigaUserStory[] = new Array<TaigaUserStory>();
    let userStories: UserStory[] = new Array<UserStory>();
    request({
            url: base_url + "/userstories",
            qs: {"project": project_id}
        },
        function (error, response, body) {
        taigaUserStories = JSON.parse(body);
        userStories  = taigaInterface.taigaStoriesToUserStories(taigaUserStories);
        callback(userStories);
        });
}

router.use(
    function (req: Request, res: Response, next) {
    bearerToken = req.token;

    const projectid = req.query.project;
    if (projectid) {
        getProjectuserStories (projectid,
            function (userStories: UserStory[]) {
                res.send(userStories);
            });
    }
    else {
        next();
    }
});
router.patch("/:id",
    function (req: Request, res: Response, next) {
        console.log(req.token, 'bearer token desde patch ');
        setUserStory(req.body as UserStory)
        .then(
            (taigaUserStory) => {
                res.send(taigaUserStory);
            })
            .catch(
                response => {
                    res.status(400).send(response.error);
                })

    }
);

router.get("/:id",
    function (req: Request, res: Response, next) {
        getUserStory(req.params.id)
        .then(
            (userStory: UserStory) => {
                res.json(userStory);
            })
            .catch(
                response => {
                    res.status(400).send(response.error);
                })

    }
);
