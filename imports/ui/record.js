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
    // 'click .delete-selected-record button'() {
    //     // instance.state.set('deleteCompleted', event.target.checked);
    //     Records.remove(this._id);
    //     // Set the checked property to the opposite of its current value
    //     // Records.remove(this._id, {
    //     //     $set: { checked: ! this.checked },
    //     // });
    // },
});