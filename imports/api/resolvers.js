import { GraphQLDateTime } from 'graphql-iso-date'
import { Views, Records } from './records'
import { Eits } from './eits'
import {Meteor} from "meteor/meteor";

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

    getOneEIT(_, args){
      return Eits.findOne(args.id)
    },
    getAllEITs() {
      return Eits.find({}).fetch()
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
    updateRecord(_, args) {
      let record = Records.findOne(args.id)
      console.log("[RECORD] = " + record._id)
      Records.update(args.id, {
        $set: {
          firstname:  args.firstname,
          surname: args.surname,
          gender : args.gender,
          dob : args.dob,
          createdAt: new Date() // current time
        },
      })
      return Records.findOne(args.id)
    },

    addEIT(_, args) {
      let id = Eits.insert({
        firstname: args.firstname,
        surname: args.surname,
        gender: args.gender,
        dob: args.dob,
        ownerid: args.ownerid
      })
      console.log("[EIT._id: " + id)
      return Eits.findOne(id)
    },
    deleteEIT(_, args) {
      Eits.remove(args.id)
      return args.id
    },
    updateEIT(_, args) {
      let record = Eits.findOne(args.id)
      console.log("[EIT - update] = " + record._id)
      Eits.update(args.id, {
        $set: {
          firstname:  args.firstname,
          surname: args.surname,
          gender : args.gender,
          dob : args.dob,
          createdAt: new Date(), // current time
          ownerid: args.ownerid
        },
      })
      return Eits.findOne(args.id)
    },

  }
}

export default resolvers
