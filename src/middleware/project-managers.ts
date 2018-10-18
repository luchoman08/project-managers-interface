import express from "express";
export const router = express.Router();
import * as taigaController from "../taiga-interface/taiga-router";
import * as git from "../git-interface/routes";
router.use(function(req, res, next) {
    const project_manager = req.query.project_manager;
    switch (String(project_manager)) {
        case "taiga": {
            router.use(taigaController.router);
            next();
            break;
        }
        case "git": {
            router.use(git.router);
            next();
            break;
        }
        default: {
            next();
            // res.status(400).json({error: "Project manager not specified (specify this in 'project_manager' param, options: taiga, zoho"});
        }
    }
});
