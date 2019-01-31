import { gql } from 'apollo-server-express'

// The GraphQL schema
const typeDefs = gql`
  scalar Date
  type Query {
    getOneRecord(id: String!): Record
    getAllRecords: [Record]
    
    getOneEIT(id: String!): EIT
    getAllEITs: [EIT]
  }
  type Mutation {
    addRecord(text: String!): Record
    deleteRecord(id: String!): String
    updateRecord(
      id: String!, 
      firstname: String!, 
      surname: String!, 
      gender: String!, 
      dob: String!
    ): UserRecord
    
    addEIT(
      firstname: String!, 
      surname: String!, 
      gender: String!, 
      dob: String!,
      ownerid: String!
    ): EIT
    deleteEIT(id: String!): EIT
    updateEIT(
      id: String!,
      firstname: String, 
      surname: String, 
      gender: String, 
      dob: String,
      ownerid: String,
    ): EIT
  }
  type Record {
    _id: String
    text: String
    createdAt: Date
    checked: Boolean
  }

  type UserRecord {
    _id: String
    firstname: String
    surname: String
    gender: String
    dob: String
  }
  
  type EIT {
    _id: String
    firstname: String
    surname: String
    gender: String
    dob: String
    ownerid: String
  }
`

export default typeDefs
