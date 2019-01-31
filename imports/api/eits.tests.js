/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
import { Accounts } from "meteor/accounts-base";

import { Eits } from './eits';

if (Meteor.isServer) {
    describe('Eits', () => {
        describe('methods', () => {
            const username = 'me';
            let eitId, userId;

            before(() => {
                // Create user if not already created
                // This is a user that would login to the app
                const user = Meteor.users.findOne({username: username});
                if (!user) {
                    userId = Accounts.createUser({
                        'username': username,
                        'email': username + '@email.org',
                        'password' : username+ 'password'
                    })
                } else {
                    userId = user._id;
                }
            });

            beforeEach(() => {
                Eits.remove({});
                eitId = Eits.insert({
                    firstname: 'test firstname',
                    surname: 'test surname',
                    gender: 'test gender',
                    dob: '01/31/2019',
                    ownerid: "moses.eit",
                });
            });

            /**
             * Delete tests
             */
            it('can delete owned eit', () => {
                // Find the internal implementation of the eit method so we can
                // test it in isolation
                const deleteEit = Meteor.server.method_handlers['eits.remove'];

                // Set up a fake method invocation that looks like what the method expects
                const invocation = { userId };

                // Run the method with `this` set to the fake invocation
                deleteEit.apply(invocation, [eitId]);

                // Verify that the method does what we expected
                assert.equal(Eits.find().count(), 0);
            });
        });
    });
}
