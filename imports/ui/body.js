import { Template } from 'meteor/templating';

import { Records } from '../api/records.js';

import './body.html';

Template.body.helpers({
    records() {
        return Records.find({});
    },
});