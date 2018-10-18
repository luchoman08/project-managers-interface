import { Request, Response } from "express";
import express from "express";
export const router = express.Router();
import * as taigaUserStoriesControler from "./controllers/user-story-controller";
import * as taigaProjectsController from "./controllers/project-controller";
import * as taigaSprintsController from "./controllers/sprint-controller";
import * as taigaDevelopersConroller from "./controllers/developer-controller";

router.use("/projects", taigaProjectsController.router);
router.use("/userstories", taigaUserStoriesControler.router);

router.use("/sprints", taigaSprintsController.router);
router.use("/developers", taigaDevelopersConroller.router);