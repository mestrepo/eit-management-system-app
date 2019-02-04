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
                    console.log("[USER DOES NOT EXIST] : " + userId)
                } else {
                    userId = user._id;
                    console.log("[USER ALREADY EXIST] : " + userId)
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

            it("cannot delete someone else's eit", () => {
                // Set existing eit private
                Eits.update(eitId, {$set: { private: true}});

                // Generate random ID to rep another user
                const anotherUserId = Random.id();

                // Isolate delete method
                const deleteEit = Meteor.server.method_handlers['eits.remove'];

                // create fake userId object for method
                const fakeUserObject = {'userId' : anotherUserId};

                //Verify that exception is thrown
                assert.throws(function() {
                    // Run the method with `this` set to the fake UserObject
                    deleteEit.apply(fakeUserObject, [eitId]);
                }, Meteor.Error, 'not-authorized');

                // Verify that eit is not deleted
                assert.equal(Eits.find().count(), 1);
            });

            /**
             * Insert tests
             */
            it("can add eit", () => {
                // 1. housekeeping/set up environment
                const eit = {
                    firstname: "Moses",
                    surname: "2031",
                    gender: "M",
                    dob: "12/12/1990",
                    ownerid: "moses.eit",
                };

                // 2. get method unit
                const addEit = Meteor.server.method_handlers['eits.insert'];

                // 3. Setup fake global object
                // create fake user object
                let fakeUserObject = {
                    'userId': userId,
                    'username': username
                };

                // 4. Run method with fake object and required arguments
                addEit.apply(fakeUserObject, [eit.firstname, eit.surname, eit.gender, eit.dob, eit.ownerid]);

                // 5. Perform checks
                assert.equal(Eits.find().count(), 2);
            });

            it("cannot add eit if not logged in", () => {
                // 1. housekeeping/set up environment
                const eit = {
                    firstname: "Moses",
                    surname: "2031",
                    gender: "M",
                    dob: "12/12/1990",
                    ownerid: "moses.eit",
                };

                // 2. get method unit
                const addEit = Meteor.server.method_handlers['eits.insert'];

                // 3. Setup fake global object
                // create fake user object without userID
                // to emulate User not logged in
                let fakeUserObject = {
                    'username': username
                };

                // 4. Run method with fake object and required arguments
                // Verify that exception is thrown when trying to insert
                // when not logged in
                assert.throws(function() {
                    addEit.apply(fakeUserObject, [eit.firstname, eit.surname, eit.gender, eit.dob, eit.ownerid]);
                }, Meteor.Error, 'not-authorized');

                // 5. Perform checks
                assert.equal(Eits.find().count(), 1);
            });

            /**
             * Update EIT
             */
            it("update eit", () => {
                // Set existing eit private
                // Eits.update(eitId, {$set: { private: true}});


                // 1. housekeeping/set up environment
                const eit = {
                    firstname: "TestUpdatedFirstName",
                    surname: "TestUpdatedSurname",
                    gender: "test",
                    dob: "12/12/1990",
                    ownerid: "update.test.eit",
                };

                // 2. get method unit
                const updateEit = Meteor.server.method_handlers['eits.update'];

                // 3. Setup fake global object
                // create fake user object
                let fakeUserObject = {
                    'userId': userId,
                    'username': username
                };

                // 4. Run method with fake object and required arguments
                updateEit.apply(fakeUserObject, [eit.firstname, eit.surname, eit.gender, eit.dob, eit.ownerid]);

                // 5. Perform checks
                // only one record which is itself updated
                assert.equal(Eits.find().count(), 1);
                const updatedEitRecord = Eits.findOne({_id: userId});
                console.log("[UPDATE.EIT.TEST]: " + JSON.stringify(Eits.find().fetch()))
                assert.equal(eit, updatedEitRecord);
            });
        });
    });
}
