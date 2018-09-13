import { Template } from 'meteor/templating';

import './main.html';

if (Meteor.isClient) {
    console.log("I'm a client");
    Template.mytemplate.myFirstTemplateHelper = function () {
        return "my first template";
    }
}

if(Meteor.isServer) console.log("I'm a server");