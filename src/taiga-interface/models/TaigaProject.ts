import { TaigaMilestone } from "./";
import { TaigaMembership } from "./";
import { TaigaRole } from "./TaigaRole";
import { TaigaPoint } from "./TaigaPoint";
export class TaigaProject {
    id: string;
    members: TaigaMembership[];
    name: string;
    description: string;
    points: TaigaPoint[];
    roles: TaigaRole[];
    slug: string;
    milestones: any[];
    created_date: string; // ej.  "2018-05-04T15:50:11.858Z"
    constructor () {}

    searchPoint(id_point: string) {
      return this.points.filter (point => point.id === Number(id_point))[0];
    }
    searchRole(id_role: string) {
      return this.roles.filter (role => role.id === Number(id_role))[0];
    }
  }
