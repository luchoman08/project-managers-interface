import { Request, Response } from "express";
import express from "express";
export const router = express.Router();
import * as taigaUserStoriesControler from "./user-story-controller";
import * as taigaProjectsController from "./project-controller";
import * as taigaSprintsController from "./sprint-controller";
import * as taigaDevelopersConroller from "./developer-controller";

router.use("/projects", taigaProjectsController.router);
router.use("/userstories", taigaUserStoriesControler.router);

router.use("/sprints", taigaSprintsController.router);
router.use("/developers", taigaDevelopersConroller.router);