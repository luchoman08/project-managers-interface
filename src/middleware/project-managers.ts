import express from "express";
export const router = express.Router();
import * as taigaController from "../taiga-interface/taiga-router";
import * as git from "../git-interface/routes";

const  ProjectManagers = {
    TAIGA: {name: "tagia", abreviation: "t"},
    GIT: {name: "git", abreviation: "g"},
};
router.use(function(req, res, next) {
    if (req.query.pm) {
        const project_manager = req.query.pm;
        switch (String(project_manager)) {
            case ProjectManagers.GIT.abreviation: {
                console.log("kha");
                router.use(git.nativeRouter);
            }
        }
    }
    const project_manager = req.query.project_manager;
    switch (String(project_manager)) {
        case ProjectManagers.TAIGA.name: {
            router.use(taigaController.router);
            next();
            break;
        }
        case ProjectManagers.GIT.name: {
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
