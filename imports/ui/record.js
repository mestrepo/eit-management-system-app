import { Template } from 'meteor/templating';

import { Records } from '../api/records.js';

import './record.html';

Template.record.events({
    'click .toggle-checked'() {
        // Set the checked property to the opposite of its current value
        Records.update(this._id, {
            $set: { checked: ! this.checked },
        });
    },
    'click .delete'() {
        Records.remove(this._id);
    },
});