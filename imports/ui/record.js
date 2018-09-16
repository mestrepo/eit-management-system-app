import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Records } from '../api/records.js';

import './record.html';

Template.record.helpers({
    isOwner() {
        return this.owner === Meteor.userId();
    },
});

Template.record.events({
    'click .toggle-checked'() {
        Meteor.call('records.setChecked', this._id, !this.checked);
    },
    'click .delete'() {
        Meteor.call('records.remove', this._id);
    },
    'click .toggle-private'() {
        Meteor.call('records.setPrivate', this._id, !this.private);
    },
    'click .delete-selected-record button'() {
        Meteor.call('records.remove', this._id);
    },
});