
import { Developer, UserStory, Sprint } from "./";
export class Project  {
    id: string;
    created_date: string; // long fo rmat
    description: string;
    sprints: Sprint[];
    points: any;
    roles: any;
    developers: Developer[];
    userStories: UserStory[];
    name: string;

    constructor() {}
}
