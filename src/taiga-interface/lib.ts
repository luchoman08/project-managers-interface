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
    Sprint,
    Point
} from "../models";

import { Punctuation } from "../models/Punctuations";

export function taigaProjectToProject(
    taigaProject: TaigaProject): Project {
    console.log(taigaProject.members, 'taiga project ');
    const project: Project = new Project();
    project.id = taigaProject.id;
    project.description = taigaProject.description;
    project.sprints = taigaProject.milestones? taigaMilestonesToSprints(taigaProject.milestones) : new Array<Sprint>();
    project.developers = taigaProject.members? taigaMembershipsToDevelopers(taigaProject.members): new Array<Developer>();
    project.points = taigaProject.points? taigaProject.points: new Array<Point>();
    project.name = taigaProject.name;
    project.created_date = taigaProject.created_date;
    return project;
}

export function taigaProjectsToProjects(
    taigaMilestones: TaigaProject[]): Project[] {
    return taigaMilestones.map(taigaProjectToProject);
}

export function taigaMembershipToDeveloper(
    taigaMembership: TaigaMembership,
    taigaProject?: TaigaProject): Developer {
    const simpleDeveloper: Developer = new Developer();
    simpleDeveloper.id = taigaMembership.user;
    simpleDeveloper.color = taigaMembership.color;
    simpleDeveloper.full_name = taigaMembership.full_name;
    simpleDeveloper.role_name = taigaMembership.role_name;
    if ( taigaProject ) {
        simpleDeveloper.punctuations = extractPunctuationsFromProject(taigaProject);
    }
    return simpleDeveloper;
}

export function taigaMembershipsToDevelopers(
    taigaMemberships: TaigaMembership[],
    taigaProject?: TaigaProject): Developer[] {
    return taigaMemberships.map(taigaMembership => taigaMembershipToDeveloper(taigaMembership, taigaProject));
}

export function taigaStoryToUserStory(
    taigaUserStory: TaigaUserStory, project?: TaigaProject): UserStory {
    const userStory: UserStory = new UserStory();
    userStory.id = taigaUserStory.id;
    userStory.subject = taigaUserStory.subject;
    userStory.assigned_to = taigaUserStory.assigned_to;
    userStory.total_points = taigaUserStory.total_points;
    if ( project ) {
        userStory.punctuations = extractStoryPunctuationsFromProject( project, taigaUserStory);
    }
    return userStory;

}

export function taigaStoriesToUserStories(
    taigaUserStories: TaigaUserStory[], project?: TaigaProject): UserStory[] {
    return taigaUserStories.map(taigaUserStory => taigaStoryToUserStory(taigaUserStory, project));
}

export function taigaMilestoneToSprint(
    taigaMilestone: TaigaMilestone, project: TaigaProject): Sprint {
    const sprint: Sprint = new Sprint();
    sprint.id = taigaMilestone.id;
    sprint.name = taigaMilestone.name;
    sprint.user_stories = taigaMilestone.user_stories? taigaStoriesToUserStories(taigaMilestone.user_stories, project): new Array<UserStory>();
    sprint.estimated_start = taigaMilestone.estimated_start;
    sprint.estimated_finish = taigaMilestone.estimated_finish;
    return sprint;
}

export function taigaMilestonesToSprints(
    taigaMilestones: TaigaMilestone[], project?: TaigaProject): Sprint[] {
    return taigaMilestones.map(taigaMilestone => taigaMilestoneToSprint(taigaMilestone, project));
}

export function extractStoryPunctuationsFromProject(taigaProject: TaigaProject, taigaUserStory: TaigaUserStory): Punctuation[] {
    let punctuations: Punctuation[] = new Array<Punctuation>();
    for (let id_role of Object.keys(taigaUserStory.points)) {
        let role_name = taigaProject.roles.filter(role => role.id === Number(id_role))[0].name;
        let point_value = taigaProject.points.filter(point => point.id === taigaUserStory.points[id_role])[0].value;
        punctuations.push (new Punctuation(id_role, role_name, point_value));
    }
    return punctuations;
}
export function extractPunctuationsFromProject(taigaProject: TaigaProject): Punctuation[] {
    let punctuations: Punctuation[] = new Array<Punctuation>();
    let point_value = null; // default point value is null
    for (let role of taigaProject.roles.slice(0,4)) {
        punctuations.push (new Punctuation(role.id, role.name, point_value));
    }
    return punctuations;
}