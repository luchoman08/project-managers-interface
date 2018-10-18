
declare namespace Express {
    export interface Request {
       octokit?: Object;
       graphql?: Object;
       token: string;
    }
 }