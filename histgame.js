var games = new Meteor.Collection("games");
var questions = new Meteor.Collection("questions");

if (Meteor.isClient) {

    console.log("מה קורה חברה");

    Accounts.ui.config({
        passwordSignupFields:'USERNAME_AND_OPTIONAL_EMAIL'
    });


    Template.games_list.games = function () {
        return games.find();
    };

    Template.games_list.events({
        'click #add_game' : function () {
            var name = prompt("What is the name of this game?");
            if (name) {
                games.insert({name: name});
            }
            else {
                alert("תכתוב משהו!");
            }

        },
        'click .game_button': function(e, t) {
            Session.set("selected_game", e.target.id);
        }
    });


    Template.edit_questions.editing_questions = function() {
        return Session.equals("editing_questions", true);
    };

    Template.edit_questions.questions = function() {
        return questions.find();
    };

    Template.edit_questions.events({
        'click #add_question': function() {
            questions.insert({
                question_text: $("#question_text").val(),
                option1: $("#option1").val(),
                option2: $("#option2").val(),
                option3: $("#option3").val(),
                option4: $("#option4").val(),
                answer: $("#answer").val()
            })
        }
    });

    Template.game_quiz.questions = function() {
        if((!Session.equals("selected_game",null))&& (Session.get("selected_game")!= null) ){
            var game = games.findOne({_id: Session.get("selected_game")});
            if (game && game.questions) {
                return game.questions;
            }
        }
        return null;
    };


    Template.footer.is_admin = function() {
        var admins_list = {
            "y79ciudq4DvA2wPTs": true,
            "daniel_the_king2": true
        };
        console.log(Meteor.userId());
        if (admins_list[Meteor.userId()])
            return true;
        else
            return false;
    };

    function switch_to_editing_mode() {
        Session.set("editing_questions", true);
    }

    function finish_editing_mode() {
        Session.set("editing_questions", false);
    }

    Template.footer.events({
        'click #edit_questions_button': function() {
            alert("nyet");
            Session.set("editing_questions", true);
            alert(Session.get("editing_questions"));
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
