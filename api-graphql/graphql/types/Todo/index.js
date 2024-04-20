// eslint-disable-next-line import/no-anonymous-default-export
export default `
  type Todo {
    _id: String!
    title: String!
    description: String!
    status: Boolean!
    dueDate: String!
  }

  type Query {
    findOne(_id: ID!): Todo!
    findAll: [Todo!]!
  }

  input CreateTodoInput {
    _id: String!
    title: String!
    description: String!
    status: Boolean!
    dueDate: String!
  }

  input UpdateTodoInput {
    title: String
    description: String
    status: Boolean
    dueDate: String
  } 

  type Mutation {
    createTodo(todo: CreateTodoInput): Todo!
    updateTodo(_id: String!, todo: UpdateTodoInput!): Todo!
    deleteTodo(_id: String!): Todo!
  }
`;



// export default `
//   type Todo {
//     _id: String!
//     title: String!
//     description: String!
//     status: Boolean!
//     dueDate: String!
//   }

  // type Query {
  //   findOne(_id: ID!): Todo!
  //   findAll: [Todo!]!
  // }

  // input CreateTodoInput {
  //   _id: String!
  //   title: String!
  //   description: String!
  //   status: Boolean!
  //   dueDate: String!
  // }
  
  // input UpdateTodoInput {
  //   title: String
  //   description: String
  //   status: Boolean
  //   dueDate: String
  // } 

//   type Mutation {
//     createTodo(todo: CreateTodoInput): Todo!
    // updateTodo(_id: String!, todo: UpdateTodoInput!): Todo!
    // deleteTodo(_id: String!): Todo!
//     deleteAll()
//   }
// `;
    