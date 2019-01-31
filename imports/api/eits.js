import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Match } from 'meteor/check'

export const Eits = new Mongo.Collection('eits');

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish eits that are public or belong to the current user
    Meteor.publish('eits', function recordsPublication() {
        return Eits.find({
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
    'eits.insert'(firstname, surname, gender, dob) {
        fieldValidation(firstname, surname, gender, dob);

        // Make sure the user is logged in before inserting a eit
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Eits.insert({
            firstname,
            surname,
            gender,
            dob,
            createdAt: new Date(), // current time
            owner: Meteor.userId(),
            ownerid: Meteor.user().username,
        });
    },
    'eits.remove'(eitId) {
        check(eitId, String);

        const eit = Eits.findOne(eitId);
        if (eit.private && eit.owner !== Meteor.userId()) {
            // If the eit is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }

        Eits.remove(eitId);
    },
    'eits.setChecked'(eitId, setChecked) {
        check(eitId, String);
        check(setChecked, Boolean);

        const eit = Eits.findOne(eitId);
        if (eit.private && eit.owner !== Meteor.userId()) {
            // If the eit is private, make sure only the owner can check it off
            throw new Meteor.Error('not-authorized');
        }

        Eits.update(eitId, { $set: { checked: setChecked } });
    },
    'eits.setPrivate'(eitId, setToPrivate) {
        check(eitId, String);
        check(setToPrivate, Boolean);

        const eit = Eits.findOne(eitId);

        // Make sure only the eit owner can make a eit private
        if (eit.owner !== Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Eits.update(eitId, { $set: { private: setToPrivate } });
    },
    'eits.update'(id, firstname, surname, gender, dob) {
        fieldValidation(firstname, surname, gender, dob);

        // Make sure the user is logged in before inserting a eit
        if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        Eits.update(
            id, {
                $set: {
                    firstname : firstname,
                    surname : surname,
                    gender : gender,
                    dob : dob,
                    createdAt: new Date(), // current time
                    owner: Meteor.userId(),
                    ownerid: Meteor.user().username,
                },
            });
    },
});
