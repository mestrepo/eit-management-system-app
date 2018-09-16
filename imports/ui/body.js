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

        // Insert a task into the collection
        Records.insert({
            firstname,
            surname,
            gender,
            dob,
            createdAt: new Date(), // current time
        });

        // Clear form
        target.firstname.value = '';
        target.surname.value = '';
        target.gender.value = '';
        target.dob.value = '';
    },
});