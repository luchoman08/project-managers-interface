
import { Developer, UserStory, Sprint } from "./";
export class Project  {
    id: string;
    created_date: string; // long format
    description: string;
    sprints: Sprint[];
    developers: Developer[];
    userStories: UserStory[];
    name: string;

    constructor() {}
}
