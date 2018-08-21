
import { Request, Response, NextFunction } from "express";
import rp from 'request-promise';
import express from "express";

import * as taigaInterface from "../lib";
import { TaigaUserStory } from '../models/TaigaUserStory';
import { UserStory } from '../../models/UserStory';
import * as projectController from './project-controller';
import { taigaStoryToUserStory } from '../lib';
export const router = express.Router();
const base_url: String = "https://api.taiga.io/api/v1";
var bearerToken: string;
function getTaigaUserStory(id: number | string): Promise<TaigaUserStory> {
    return rp(base_url + "/userstories/" + id).then(
        (body: string) => {
            return JSON.parse(body) as TaigaUserStory;
        }
    )
}

function getUserStory(id: number): Promise<UserStory> {
    let taigaUserStory: TaigaUserStory = new TaigaUserStory();
    let userStory: UserStory = new UserStory();
    return rp(base_url + "/userstories/" + id)
        //.auth(null, null, true, bearerToken)
        .then((body: HTMLBodyElement) => {
            taigaUserStory = JSON.parse(String(body));
            console.log(taigaUserStory, 'taiga user story from get user story');
            userStory = taigaInterface.taigaStoryToUserStory(taigaUserStory);

            return userStory;
        })
        .catch(
            (error:any) => {
                return error;
            }
        );
}
function getUserStoryWithPoints(id: number, callback?: Function): void {
    let userStory: UserStory;
    let taigaUserStory: TaigaUserStory;
    getTaigaUserStory(id)
        .then(
            (_taigaUserStory: TaigaUserStory) => {
                taigaUserStory = _taigaUserStory;
                projectController.getTaigaProject(taigaUserStory.project)
                    .then(
                        project => {
                            /* Taiga user story to user story with taiga project as argument can extract user story punctuations */
                            userStory = taigaInterface.taigaStoryToUserStory(taigaUserStory, project);
                            callback(userStory);
                        }
                    )
            }
        )
        ;
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
                error => {
                    return error.error;
                }
            );
}


function getProjectuserStories(project_id: String, callback: Function) {
    let taigaUserStories: TaigaUserStory[] = new Array<TaigaUserStory>();
    let userStories: UserStory[] = new Array<UserStory>();
    rp({
        url: base_url + "/userstories",
        qs: { "project": project_id }
    },
        function (error: any, response: any, body: string) {
            taigaUserStories = JSON.parse(body);
            userStories = taigaInterface.taigaStoriesToUserStories(taigaUserStories);
            callback(userStories);
        });
}

router.use(
    function (req: Request, res: Response, next: Function) {
        bearerToken = req.token;

        const projectid = req.query.project;
        if (projectid) {
            getProjectuserStories(projectid,
                function (userStories: UserStory[]) {
                    res.send(userStories);
                });
        }
        else {
            next();
        }
    });
router.patch("/:id",
    function (req: Request, res: Response) {
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
    function (req: Request, res: Response) {
        let userStoryId = req.params.id;
        console.log(req.query, 'req query from get at user story' )
        let append_points: boolean = false;
        if ( req.query.append_points && ( Number(req.query.append_points) === 1 ) ) {
            append_points = true;
        }
        if ( append_points ) {
            getUserStoryWithPoints(userStoryId,
            (userStory: UserStory) => {
                res.json(userStory);
            });
        } else {
            console.log('hola desde router get ' + req.params.id)
            getUserStory(userStoryId)
                .then(
                    (userStory: UserStory) => {
                        console.log('hola desde router get user story' + userStory)
                        res.json(userStory);
                    })
                .catch(
                    response => {
                        console.log('hola desde router get user story catch')

                        res.status(400).send(response.error);
                    })
        }
    }
);
