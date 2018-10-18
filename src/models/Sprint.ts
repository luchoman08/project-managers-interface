import { UserStory } from "./";

export class Sprint {
    id: string;
    name: string;
    estimated_start: string; //  iso date (YYYY-MM-DD)
    estimated_finish: string; // iso date (YYYY-MM-DD)
    user_stories: UserStory[];
    constructor () {
        this.estimated_finish = "";
        this.estimated_start = "";
    }
 }
export const SprintOfNotSolvedStories = "sprint_of_not_solved";