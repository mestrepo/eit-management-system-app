import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {Records} from '../api/records.js';

import './record.js';
import './body.html';

Template.body.helpers({
    records() {
        // Show newest tasks at the top
        return Records.find({}, {sort: {createdAt: -1}});
    },
});

Template.body.events({
    'submit .new-record'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;

        // set the values
        const firstname = target.firstname.value;
        const surname = target.surname.value;
        const gender = target.gender.value;
        const dob = target.dob.value;

        // Insert a record into the collection
        Meteor.call('records.insert', firstname, surname, gender, dob);

        // Clear form
        target.firstname.value = '';
        target.surname.value = '';
        target.gender.value = '';
        target.dob.value = '';
    },
});