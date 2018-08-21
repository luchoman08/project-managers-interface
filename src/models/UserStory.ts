import { Punctuation } from "./Punctuations";

export class UserStory {
    id: string;
    total_points: number;
    subject: string;
    assigned_to: number;
    punctuations: Punctuation[];
    constructor() {}
}
