import { Punctuation } from "./Punctuations";

export class Developer {
    id: string; //id as a membership, no taiga user
    full_name: string;
    role_name: string;
    user: number; // id of taiga user 
    available_hours_per_week: number;
    punctuations: Punctuation[];
    color: string;
    constructor() {
	this.available_hours_per_week=null;
	}

}
