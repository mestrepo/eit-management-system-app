import { GraphQLDateTime } from 'graphql-iso-date'
import { Views, Records } from './records'

// A map of functions which return data for the schema.
const resolvers = {
  Date: GraphQLDateTime,
  Query: {
    getOneRecord(_, args){
      return Records.findOne(args.id)
    },
    getAllRecords() {
      return Records.find({}).fetch()
    },
  },
  Mutation: {
    addRecord(_, args) {
      let id = Records.insert({ text: args.text, createdAt: new Date() })
      return Records.findOne(id)
    },
    deleteRecord(_, args) {
      Records.remove(args.id)
      return args.id
    },
    // updateRecord(_, args) {
    //   let task = Records.findOne(args.id)
    //   Records.update(args.id)
    //   return Records.findOne(args.id)
    // },
  }
}

export default resolvers
