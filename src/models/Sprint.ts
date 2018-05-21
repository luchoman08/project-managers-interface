import { UserStory } from "./";

export class Sprint {
    id: string;
    name: string;
    estimated_start: string; //  iso date (YYYY-MM-DD)
    estimated_finish: string; // iso date (YYYY-MM-DD)
    user_stories: UserStory[];
}
