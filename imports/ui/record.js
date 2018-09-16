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
});