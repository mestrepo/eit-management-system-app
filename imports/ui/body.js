import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import {Records} from '../api/records.js';

import './record.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
    Meteor.subscribe('records');
});
Template.registerHelper('and',(a,b)=>{
    return a && b;
});
Template.body.helpers({
    records() {
        const instance = Template.instance();

        if (instance.state.get('deleteChecked')) {
            instance.state.set('deleteChecked', false); // reset delete button checked state
            const checkedRecords = Records.find({ 'checked': true });
            // securely delete all check boxed records
            checkedRecords.forEach(function(cr) {
                Meteor.call('records.remove', cr._id);
            });
        }
        if (instance.state.get('hideChecked')) {
            // If hide completed is checked, filter records
            return Records.find({ checked: { $ne: true } });
        }
        // Otherwise, return all of the records
        // Show oldest records at the top
        return Records.find({});
    },
    incompleteCount() {
        return Records.find({ checked: { $ne: true } }).count();
    },
});

Template.body.events({
    'submit .new-record'(event, instance) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;

        // set the values
        const firstname = target.firstname.value;
        const surname = target.surname.value;
        const gender = target.gender.value;
        const dob = target.dob.value;

        if (instance.state.get('readyToEdit')) {
            // update a record into the collection
            Meteor.call('records.update', instance.state.get('editId'), firstname, surname, gender, dob);

            // reset edit
            instance.state.set('readyToEdit', false);
            instance.state.set('editId', undefined);
        }
        else {
            // Insert a record into the collection
            Meteor.call('records.insert', firstname, surname, gender, dob);
        }

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
        instance.state.set('deleteChecked', event.target.name === 'delete'); // set delete state
    },
    'click #edit-records'(event, instance) {
        // Prevent default browser form submit
        event.preventDefault();

        const record = Records.findOne(this._id);

        // Get value from form element
        const editTarget = document.getElementById('new-record-for-edit');
        // console.log("editTarget id: " + editTarget.name);

        if (event.target.value === 'edit') {
            // set the values
            editTarget.firstname.value = record.firstname;
            editTarget.surname.value = record.surname;
            editTarget.gender.value = record.gender;
            editTarget.dob.value = record.dob;
        }

        // set ready to edit state
        instance.state.set('readyToEdit', true);
        instance.state.set('editId', this._id);
    },
});