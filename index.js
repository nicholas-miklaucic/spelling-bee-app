// Use ES module import syntax to import functionality from the module
// that we have compiled.
//
// Note that the `default` import is an initialization function which
// will "boot" the module and make it ready to use. Currently browsers
// don't support natively imported WebAssembly as an ES module, but
// eventually the manual initialization won't be required!
import init, { SpellingBeeGame } from './pkg/spelling_bee.js';


var main_words = "";
var swears = "";
$.get("./2of12inf.txt", function (data) {
    main_words = data;
});

$.get("./swears.txt", function (data) {
    swears = data;
});

const VALID = 0;
const ALREADY_PLAYED = 1;
const INVALID_WORD = 2;
const INVALID_LENGTH = 3;
const INVALID_LETTERS = 4;

const TIERS = {
    "Good Start": 0.02,
    "Moving Up": 0.05,
    "Good": 0.08,
    "Solid": 0.15,
    "Nice": 0.25,
    "Great": 0.4,
    "Amazing": 0.5,
    "Genius": 0.7,
    "Queen Bee": 1
};

// from
// https://dev.to/ananyaneogi/create-a-dark-light-mode-switch-with-css-variables-34l8
// with modification

function toggleTheme(_) {
    if (document.documentElement.getAttribute('data-theme') === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); //add this
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light'); //add this
    }
}

const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
}



async function main() {
    const url_params = new URLSearchParams(window.location.search);
    if (!url_params.has("center") || !url_params.has("others")) {
        window.location.href = "setup.html";
    }

    await init();

    let numAlerts = 0;
    
    const center_letter = url_params.get('center').toLowerCase();
    let other_letters = url_params.get('others').toLowerCase();

    const game = SpellingBeeGame.new(other_letters, center_letter, main_words, swears);

    const max_score = game.max_score();
    $("#score-bar").attr("aria-valuemax", max_score);

    let curr_word = "";

    let played_words = [];
    $("#curr-word").empty();
    $("#played-words").empty();

    let scoreBar = new ProgressBar.Line("#score-bar", {
        strokeWidth: 5,
        trailColor: '#dfdfdf',
        from: { color: '#6796E0' },
        to: { color: '#5755d9' },
        step: function(state, bar, attachment) {
            bar.path.setAttribute('stroke', state.color);
        },
    });

    function makeWordBtn(word) {
        let btn = "<a href='https://www.merriam-webster.com/dictionary/" + word;
        btn += "' class='btn btn-link btn-word' role='button' aria-label='Define' target='_blank'>";
        btn += word + "</a>";
        return btn;
    }

    function makePanel() {
        played_words = played_words.sort();
        let letters = [center_letter];
        other_letters.split('').forEach(l => letters.push(l));
        letters = letters.sort();

        $("#played-words").empty();
        letters.forEach(function (letter) {
            let toAdd = "<div class='panel'>";
            toAdd += "<div class='panel-header'><div class='panel-title'>";
            toAdd += letter.toUpperCase();
            toAdd += "</div></div>";
            toAdd += "<div class='panel-body'>";
            played_words.filter(word => word[0].toUpperCase() == letter.toUpperCase()).forEach(function (word) {
                toAdd += makeWordBtn(word);
            });
            toAdd += "</div></div>";
            $("#played-words").append(toAdd);
        })
    }
    makePanel();

    function makeAlert(msg, toast_cls) {
        $("#alert-box").empty();
        numAlerts += 1;
        const oldNumAlerts = numAlerts;
        $("#alert-box").append(`<div class="toast toast-` + toast_cls + `" mx-auto">
  <button class="btn btn-clear float-right" id="close-toast-btn"></button>` + msg +
 '</div>');
        $("#close-toast-btn").on("click", function (evt) {
            $("#alert-box").empty();
        });
        setTimeout(function() {
            if (numAlerts == oldNumAlerts) {
                $("#alert-box").empty();
            }
        }, 2000);
    }

    $("#score-steps").empty();
    Object.entries(TIERS).sort((e1, e2) => e1[1] - e2[1]).forEach((arr, i) => {
        let name = arr[0];
        let prop = arr[1];
        const numPts = Math.round(prop * max_score);
        let toAdd = "<li class='step-item' id='step" + Math.round(prop * 100) + "'>";
        toAdd += ("<a href='#' class='tooltip' data-tooltip='" + numPts + " points'>" + name + "</a></li>");
        $("#score-steps").append(toAdd);
    });
    $("#step2").addClass("active");

    function setScore(score) {
        scoreBar.set(score / max_score);
        let string = score.toString();
        $("#score").text(string);

        let hasSet = false;
        Object.entries(TIERS).sort((e1, e2) => e2[1] - e1[1]).forEach((arr, i) => {
            let name = arr[0];
            let prop = arr[1];
            let numPts = Math.round(prop * max_score);
            let curr_step = $("#step" + Math.round(prop * 100));
            if (score >= numPts && !hasSet) {
                if (!curr_step.hasClass("active")) {
                    makeAlert("Congratulations, you got " + name + "!", "success");
                }
                curr_step.addClass("active");
                hasSet = true;
            } else {
                curr_step.removeClass("active");
            }
        });
    }

    function setNumPlayed(num) {
        let string = num.toString();
        $("#num-played").text(string);
    }

    function play(word) {
        const result = game.play(word);
        if (result === VALID) {
            played_words.push(word);
            makePanel();
            setNumPlayed(played_words.length);

            $("#alert-box").empty();
            setScore(game.score());

            if (game.is_pangram(word)) {
                makeAlert("Pangram!", "success");
            }

            curr_word = "";
            $("#curr-word").empty();
        } else if (result === ALREADY_PLAYED) {
            makeAlert("Already played!", "warning");
            curr_word = "";
            $("#curr-word").empty();
        } else if (result === INVALID_WORD) {
            makeAlert("That word couldn't be found in the lexicon", "error");
            curr_word = "";
            $("#curr-word").empty();
        } else if (result === INVALID_LENGTH) {
            makeAlert("Words need to be at least 4 letters long", "error");
        } else if (result === INVALID_LETTERS) {
            makeAlert("Words must contain the center letter", "error");
        } else {
            makeAlert("A strange error occurred", "error");
            curr_word = "";
            $("#curr-word").empty();
        }
    }

    function submit() {
        play(curr_word);
    }

    function makeSpan(letter) {
        if (letter === game.required_letter()) {
            return "<span class='curr-letter text-primary'>" +
                letter.toUpperCase() +
                "</span>";
        } else {
            return "<span class='curr-letter'>" +
                letter.toUpperCase() +
                "</span>";
        }
    }

    // from SO and this fiddle: http://jsfiddle.net/timdown/vXnCM/
    function setCaret() {
        let el = document.getElementById("curr-word");
        if (el.childNodes.length == 0) {
            return false;
        }
        let range = document.createRange();
        let sel = window.getSelection();
        range.setStart(el.childNodes[el.childNodes.length - 1], 1);
        range.setEnd(el.childNodes[el.childNodes.length - 1], 1);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        el.focus();
    }

    function handleKeyVal(key) {
        if (game.is_valid_partial_input(key)) {
            curr_word += key;
            $("#curr-word").append(makeSpan(key));
        } else if (key === "Enter") {
            submit();
        } else if (key === "Backspace") {
            if (curr_word !== "") {
                curr_word = curr_word.slice(0, -1);
                $("#curr-word").children().last().remove();
            }
        }

        // move cursor forward because it won't otherwise
        setCaret();
    }

    function handleKeyPress(event) {
        handleKeyVal(event.key);

        // don't type the letter, we auto-do that and color if need be
        event.preventDefault();
        return false;
    }

    for (let i = 0; i < 6; i += 1) {
        $("#other" + (i+1)).on("click", function(_) {
            handleKeyVal($("#other" + (i+1)).prop("value"));
        });
    }

    function updateLetters(letters) {
        for (let i = 0; i < 6; i += 1) {
            $("#other" + (i+1)).prop("value", letters.charAt(i));
        }
    }

    updateLetters(other_letters);

    // from https://stackoverflow.com/questions/3079385/str-shuffle-equivalent-in-javascript
    function shuffle(string) {
        var parts = string.split('');
        for (var i = parts.length; i > 0;) {
            var random = parseInt(Math.random() * i);
            var temp = parts[--i];
            parts[i] = parts[random];
            parts[random] = temp;
        }
        return parts.join('');
    }

    $("#center").prop("value", center_letter);
    $("#center").on("click", function(_) {
        handleKeyVal(center_letter);
    });

    $("#delete-btn").on("click", function(_) {
        handleKeyVal("Backspace");
    });

    $("#enter-btn").on("click", function(_) {
        handleKeyVal("Enter");
    });

    $("#shuffle-btn").on("click", function(_) {
        other_letters = shuffle(other_letters);
        updateLetters(other_letters);
    });

    // $("#soln-btn").on("click", function(_) {
    //     game.words.forEach(word => play(word));
    // })

    $("#submit").on("click", submit);
    $("#body").keydown(handleKeyPress);
    $("#curr-word").on("focus", setCaret);
    $("#toggle-theme").on("click", toggleTheme);
}

main();
