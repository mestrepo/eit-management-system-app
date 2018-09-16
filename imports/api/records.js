import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Records = new Mongo.Collection('records');

Meteor.methods({
    'records.insert'(firstname, surname, gender, dob) {
        // input validation
        check(firstname, String);
        check(surname, String);
        check(gender, String);
        check(dob, String);

        // Make sure the user is logged in before inserting a record
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Records.insert({
            firstname,
            surname,
            gender,
            dob,
            createdAt: new Date(), // current time
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });
    },
    'records.remove'(recordId) {
        check(recordId, String);

        Records.remove(recordId);
    },
    'records.setChecked'(recordId, setChecked) {
        check(recordId, String);
        check(setChecked, Boolean);

        Records.update(recordId, { $set: { checked: setChecked } });
    },
});