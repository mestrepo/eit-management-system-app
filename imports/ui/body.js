import { Template } from 'meteor/templating';

import { Records } from '../api/records.js';

import './body.html';

Template.body.helpers({
    records() {
        return Records.find({});
    },
});

Template.body.events({
    'submit .new-record'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const firstname = target.text.value;
        const surname = target.text.value;
        const gender = target.text.value;
        const dob = target.text.value;

        // Insert a task into the collection
        Records.insert({
            firstname,
            surname,
            gender,
            dob,
            createdAt: new Date(), // current time
        });

        // Clear form
        target.text.value = '';
    },
});