import { TaigaPoint } from "./TaigaPoint";

export class TaigaUserStory {
    id: string;
    subject: string;
    points: { [id_role: string]: number; } ; // array of dict[id_role: id_point]
    points_unitary: number;
    assigned_users: any[];
    assigned_to: number;
    total_points: number;
    version: number;
    project: string; // project id
    constructor() {}
  }
