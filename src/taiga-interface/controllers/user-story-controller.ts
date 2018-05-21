
import { Request, Response, NextFunction } from "express";
import request from "request";
import * as taigaInterface from "../lib";
import  { TaigaUserStory }  from "../models/TaigaUserStory";
import { UserStory } from "../../models/UserStory";
import express from "express";
export const router = express.Router();
const base_url: String = "https://api.taiga.io/api/v1";

function getUserStory (id: number, callback: Function) {
    let taigaUserStory: TaigaUserStory = new TaigaUserStory();
    let userStory: UserStory = new UserStory();
    request(base_url + "/userstories/" + id, function (error, response, body) {
        taigaUserStory = JSON.parse(body);
        userStory  = taigaInterface.taigaStoryToUserStory(taigaUserStory);
        callback(userStory);
        });
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
router.get("/:id",
    function (req: Request, res: Response, next) {
        getUserStory (req.params.id,
        function (userStories: UserStory[]) {
            res.json(userStories);
        });
    }
);