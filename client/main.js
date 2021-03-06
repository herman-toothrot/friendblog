// create an entries collection in the MongoDB db
Entries = new Meteor.Collection('entries');
var friendblog = new Friendblog();

Meteor.subscribe('userPresence');
Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
});

friendblog.setupRouter();

// expose the Entries collection to the entries template (as 'entries')
Template.entries.entries = function () {
    // return all entries sorted by time
    return Entries.find({}, { sort: { time: -1 }});
}

Template.friend_info.users_amount = function () {
    return Meteor.users.find().count() - 1;
}

Template.friend_info.users = function () {
    return Presences;
}

Template.friend_info.helpers({
    onlineUsers: function() {

        var users = _.map(Meteor.presences.find().fetch(), function(user) {
            return Meteor.users.findOne({_id :user.userId})
        });

        return users;
    },
    onlineCount: function() {
        return Meteor.presences.find().count();
    }
});

function currentUserIs(username) {
    var user = Meteor.user();
    return user.username === username;
}
Template.entries.helpers({
    currentUserIs: currentUserIs
});

Template.admin.helpers({
    currentUserIs: currentUserIs

});
// create events for the 'input' template
Template.input.events = {
    // map the event (click) for the control for the given selector
    'click input#sendMessage': function (event) {
        var user = Meteor.user();
        if (!user) {
            return;
        }

        var message = document.getElementById('message');
        if (message.value != '') {
            // add the entry to the list of entries
            Entries.insert({
                user: user,
                message: message.value,
                time: Date.now()
            });

            document.getElementById('message').value = '';
            message.value = '';
        }
    }
}

// create events for the 'entries' template
Template.entries.events = {
    // map the event (click) for the control for the given selector
    'click input#clear': function (event) {
        // make call to a server-side function to do remove the entries,
        // since you can't just call anything you want from the client
        Meteor.call('removeAllEntries');
    }
}
