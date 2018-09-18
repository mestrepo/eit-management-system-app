import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import {Records} from '../api/records.js';

import './record.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    this.checkedState = new ReactiveDict();
    Meteor.subscribe('records');
});

Template.body.helpers({
    records() {
        const instance = Template.instance();

        if (instance.checkedState.get('deleteChecked')) {
            instance.checkedState.set('deleteChecked', false); // reset delete button checked state
            const checkedRecords = Records.find({ 'checked': true });
            checkedRecords.forEach(function(cr) {
                Meteor.call('records.remove', cr._id);
            });
        }
        if (instance.state.get('hideChecked')) {
            // If hide completed is checked, filter records
            return Records.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
        }
        // Otherwise, return all of the records
        // Show newest records at the top
        return Records.find({}, {sort: {createdAt: -1}});
    },
    incompleteCount() {
        return Records.find({ checked: { $ne: true } }).count();
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
    'change .hide-checked input'(event, instance) {
        instance.state.set('hideChecked', event.target.checked);
    },
    'click .delete-checked': function(event, instance){
        instance.checkedState.set('deleteChecked', event.target.name === 'delete'); // set delete state
    },
});