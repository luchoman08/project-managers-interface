import {
    TaigaUserStory,
    TaigaMembership,
    TaigaMilestone,
    TaigaProject
} from "./models";
import {
    Developer,
    UserStory,
    Project,
    Sprint
} from "../models/index";

export function taigaProjectToProject(
    taigaProject: TaigaProject): Project {
        const project: Project = new Project();
        project.id = taigaProject.id;
        project.description = taigaProject.description;
        project.name = taigaProject.name;
        project.created_date = taigaProject.created_date;
        return project;
    }

export function taigaProjectsToProjects(
    taigaMilestones: TaigaProject[]): Project[] {
        return taigaMilestones.map(taigaProjectToProject);
    }

export function taigaMembershipToDeveloper(
    taigaMembership: TaigaMembership): Developer {
        const simpleDeveloper: Developer = new Developer();
        simpleDeveloper.id = taigaMembership.id;
        simpleDeveloper.color = taigaMembership.color;
        simpleDeveloper.full_name = taigaMembership.full_name;
        simpleDeveloper.role_name = taigaMembership.role_name;
        return simpleDeveloper;
    }

export function taigaMembershipsToDevelopers(
    taigaMemberships: TaigaMembership[]): Developer[] {
        return taigaMemberships.map(taigaMembershipToDeveloper);
    }

export function taigaStoryToUserStory(
    taigaUserStory: TaigaUserStory): UserStory {
    const userStory: UserStory = new UserStory();
    userStory.id = taigaUserStory.id;
    userStory.subject = taigaUserStory.subject;
    userStory.total_points = taigaUserStory.total_points;
    return userStory;

}

export function taigaStoriesToUserStories(
    taigaUserStories: TaigaUserStory[]): UserStory[] {
        return taigaUserStories.map(taigaStoryToUserStory);
    }

    export function taigaMilestoneToSprint(
        taigaMilestone: TaigaMilestone): Sprint {
            const sprint: Sprint = new Sprint();
            sprint.id = taigaMilestone.id;
            sprint.name = taigaMilestone.name;
            sprint.user_stories = taigaStoriesToUserStories(taigaMilestone.user_stories);
            sprint.estimated_start = taigaMilestone.estimated_start;
            sprint.estimated_finish = taigaMilestone.estimated_finish;
            return sprint;
        }

    export function taigaMilestonesToSprints(
        taigaMilestones: TaigaMilestone[]): Sprint[] {
            return taigaMilestones.map(taigaMilestoneToSprint);
        }
