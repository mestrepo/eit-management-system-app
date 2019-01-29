import { gql } from 'apollo-server-express'

// The GraphQL schema
const typeDefs = gql`
  scalar Date
  type Query {
    getOneRecord(id: String!): Record
    getAllRecords: [Record]
  }
  type Mutation {
    addRecord(text: String!): Record
    deleteRecord(id: String!): String
#    updateRecord(id: String!): Record
  }
  type Record {
    _id: String
    text: String
    createdAt: Date
    checked: Boolean
  }
`

export default typeDefs
