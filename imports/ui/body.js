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
        // if (instance.checkedState.get('deleteChecked')) {
        //     console.log('records to delete: '+ Records.find({ checked: { $ne: true } }));
        //     // If hide completed is checked, filter records
        //     return Records.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });

        if (instance.checkedState.get('deleteChecked')) {
            instance.checkedState.set('deleteChecked', false); // reset delete button checked state
            // Records.remove(Records.find({ checked: { $ne: false } }));
            // const checkedRecords = Records.find({ 'checked': true }).fetch();
            // for(i = 0 ; i < checkedRecords.count(); i++) {
            //     console.log("i = " + i + " " + 'checkedRecords[i] = ' + checkedRecords);
            //     // Meteor.call('records.remove', checkedRecords[i]);
            // }
            // checkedRecords.forEach(function(myDoc) { console.log( "user: " + instance.findAll({check: true}) ); });
            // console.log( "user: " + checkedRecords.count() );
            // console.log( "checkedRecords._id: " + Records.rawDatabase() );
            // console.log( "checkedRecords._id: " + Object.keys(checkedRecords) );
            // console.log( "checkedRecords._id: " +checkedRecords );
            // console.log( "checkedRecords._id: " + Object.keys(checkedRecords['collection']) );
            // console.log( "checkedRecords._id: " + checkedRecords['collection']['name'] );
            // checkedRecords.forEach(function() { Meteor.call('records.remove', checkedRecords._id); });
            // checkedRecords.forEach(function(myDoc) { Meteor.call('records.remove', myDoc._id); });
            // console.log( "checkedRecords._id: " + Object.values(checkedRecords) );
            // console.log( "checkedRecords._id: " + Object.entries(checkedRecords) );
            // console.log( "checkedRecords._id: " +  Meteor.call('records.find'));
            console.log( "checkedRecords._id: " +  this);
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
    // 'click .delete-checked button'(event, instance) {
    //     console.log("event : " + event);
    //     console.log("event.target : " + event.target);
    //     console.log("event.target.checked : " + event.target.checked);
    //     instance.state.set('deleteChecked', event.target.checked);
    // },
    'change .hide-checked input'(event, instance) {
        // console.log("event : " + event);
        // console.log("event.target : " + event.target);
        // console.log("event.target.checked : " + event.target.checked);
        // console.log("instance : " + instance);
        // console.log("instance.value : " + instance);
        instance.state.set('hideChecked', event.target.checked);
    },
    // 'click li': function(){
    //     console.log("You clicked an li element");
    // },
    'click .delete-checked': function(event, instance){
        // console.log("You clicked an button element");
        // console.log('event.target.name = ' + event.target.name);
        // console.log('event.target.name = ' + event.target.name);
        // console.log('event = ' + Object.keys(event));
        // console.log('instance = ' + Object.keys(instance));
        instance.checkedState.set('deleteChecked', event.target.name === 'delete'); // set delete state
        // console.log('deleteChecked = ' + instance.checkedState.get('deleteChecked'));
    },
});