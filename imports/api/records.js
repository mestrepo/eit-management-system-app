import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Match } from 'meteor/check'

export const Records = new Mongo.Collection('records');

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish records that are public or belong to the current user
    Meteor.publish('records', function recordsPublication() {
        return Records.find({
            $or: [
                { private: { $ne: true } },
                { owner: this.userId },
            ],
        });
    });
}

function fieldValidation(firstname, surname, gender, dob) {
    const NonEmptyString = Match.Where((x) => {
        check(x, String);
        return x.length > 0;
    });
    // input validation
    check(firstname, NonEmptyString);
    check(surname, NonEmptyString);
    check(gender, NonEmptyString);
    check(dob, NonEmptyString);
}

Meteor.methods({
    'records.insert'(firstname, surname, gender, dob) {
        fieldValidation(firstname, surname, gender, dob);

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

        const record = Records.findOne(recordId);
        if (record.private && record.owner !== Meteor.userId()) {
            // If the record is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }

        Records.remove(recordId);
    },
    'records.setChecked'(recordId, setChecked) {
        check(recordId, String);
        check(setChecked, Boolean);

        const record = Records.findOne(recordId);
        if (record.private && record.owner !== Meteor.userId()) {
            // If the record is private, make sure only the owner can check it off
            throw new Meteor.Error('not-authorized');
        }

        Records.update(recordId, { $set: { checked: setChecked } });
    },
    'records.setPrivate'(recordId, setToPrivate) {
        check(recordId, String);
        check(setToPrivate, Boolean);

        const record = Records.findOne(recordId);

        // Make sure only the record owner can make a record private
        if (record.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Records.update(recordId, { $set: { private: setToPrivate } });
    },
    'records.update'(id, firstname, surname, gender, dob) {
        fieldValidation(firstname, surname, gender, dob);

        // Make sure the user is logged in before inserting a record
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Records.update(
            id, {
                $set: {
                    firstname : firstname,
                    surname : surname,
                    gender : gender,
                    dob : dob,
                    createdAt: new Date(), // current time
                    owner: Meteor.userId(),
                    username: Meteor.user().username,
                },
            });
    },
});