

export const  ProjectQueries =  {
    getByNodeId: `
    query node(id: $id) {
        ...on Repository {
            name,
            id,
            description
          }
    }
    `
};
export const IssueQueries = {
    listForProject: (states: Array<string>) =>  `
    query($projectId:ID!) {
        node(id:$projectId) {
        ...on Repository {
        name,
        issues(first: 100, states: [${states.join(",")}]) {
            nodes {
                title,
                body,
                assignees(first: 100) {
                    nodes {
                        name,
                        id,
                        login
                    }
                },
                id
            }
        }
        }
    }
    }
    `
};
export const MilestoneQueries = {
    listForProject : `
    query($projectId:ID!) {
        node(id:$projectId) {
        ...on Repository {
          name,
          milestones(first: 100) {
            nodes {
                title,
                description,
                id,
                dueOn
              }
            }
          }
        }
      }
    `
};