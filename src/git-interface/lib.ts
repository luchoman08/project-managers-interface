import Octokit, { IssuesListForRepoResponseItem, ReposListCollaboratorsResponseItem, ReposListPublicResponseItem, IssuesListMilestonesForRepoResponseItem } from "@octokit/rest";

import { UserStory, Developer, Project, Sprint } from "../models";

export function gitIssueToUserStory(issue: IssuesListForRepoResponseItem ): UserStory {
    console.log(issue.title);
    const userStory = new UserStory();
    userStory.assigned_to = issue.assignee ? issue.assignee.id : null;
    userStory.subject = issue.body;
    return userStory;
}
export function gitIssuesListToUserStories(issues: IssuesListForRepoResponseItem[]) {
    const userStories = issues.map(gitIssueToUserStory);
    return userStories;
}


export function gitMilestoneToSprint(milestone: IssuesListMilestonesForRepoResponseItem): Sprint {
    const sprint = new Sprint();
    sprint.id = String(milestone.id);
    sprint.estimated_finish = milestone.due_on;
    sprint.name = milestone.title;
    return sprint;
}
export function collaboratorToDeveloper(collaborator: ReposListCollaboratorsResponseItem): Developer {
    const developer = new Developer();
    developer.full_name = collaborator.login;
    return developer;
}
export function gitRepoToProject(repo: ReposListPublicResponseItem): Project {
    const project = new Project();
    if (repo.node_id) {
        project.id = repo.node_id;
    } else if (repo.id) {
        project.id = repo.node_id;
    }
    project.description = repo.description;
    project.name = repo.name;
    return project;
}



