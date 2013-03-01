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
            var user_name = "";
//            if (Meteor.userId()) {
//                user_name = Meteor.users.findOne({_id: Meteor.userId}).username;
//            }
            var name = prompt("What is the name of this game?", user_name);
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

    Template.game_quiz.helpers({
        questions: function() {
            return questions.find();
        },
        inside_game: function() {
            if (Session.get("selected_game"))
                return true;
            else
                return false;
        }
    });

    Template.game_quiz.events({
        'click .answer-button': function(event) {
            event.preventDefault();
            var nquestions = questions.find().count();
            var right_answers = 0;
            var game = games.findOne({_id: Session.get("selected_game")});
            console.log(game.answers);
            _.each(game.answers, function(answer) {
                var question = questions.findOne({_id: answer.question_id});
                if (question.answer == answer.option_id) {
                    right_answers++;
                }
            });
            var score = Math.round((right_answers/nquestions)*100);
            alert("הציון שלך הוא: " + score);
            games.update({_id: game._id}, {name: game.name + " - " + score, finished: true});
        },
        'click .question-option': function(event) {
            event.preventDefault();
            var option_id = event.target.id;
            $("#" + option_id).addClass("btn-warning");
            console.log(option_id);
            var question_id = option_id.split("_")[0];
            console.log(question_id);
            var option_id = parseInt(option_id.split("_")[1]);
            console.log(option_id);
            for (var i = 1; i <= 4; i++) {
                var opt = $("#" + question_id + "_" + i);
                if (i != option_id && opt.hasClass("btn-warning")) {
                    opt.removeClass("btn-warning");
                    games.update({_id: Session.get("selected_game")}, {
                        $pull: { answers: {question_id: question_id, option_id: i}}
                    });
                }
            }
            games.update({_id: Session.get("selected_game")}, {
                $addToSet: { answers: {question_id: question_id, option_id: option_id}}
            });
            console.log(games.findOne({_id: Session.get("selected_game")}));
        }
    });


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
            Session.set("editing_questions", true);
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
