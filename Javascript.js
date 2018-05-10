var canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

var countblocks = document.getElementById("countblocks").value;
var col = countblocks;
var fieldWidth = canvas.width / countblocks / 2;
var fieldHeight = canvas.height / countblocks / 2;
var blockbackground = new Image();
blockbackground.src = 'block-background.jpeg';
var solved = ctx.createPattern(blockbackground, "no-repeat");

var score;
var highscore = getCookie(highscore);
if(highscore == "")
    highscore = 0;
var errors;

var minNumber = +document.getElementById("minNum").value; //= 1;
var maxNumber = +document.getElementById("maxNum").value;

document.addEventListener("mousedown", inputMouse, false);

var fields = [];

function init() {
    fullscreen();
    countblocks = document.getElementById("countblocks").value;
    col = countblocks;
    canvas.width = window.innerWidth - 17;
    canvas.height = window.innerHeight - 17;
    fieldWidth = canvas.width / countblocks / 2;
    fieldHeight = canvas.height / countblocks / 2;

    col = countblocks;
    for (rows = 0; rows < countblocks; rows++) {
        for (columns = 0; columns < col; columns++) {
            fields[rows][columns].x = canvas.width / 3 - (countblocks - rows) / 2 * (fieldWidth) + columns * fieldWidth;
            fields[rows][columns].y = canvas.height / 2.3 + fieldHeight * countblocks / 3 - (fieldHeight + 3) * rows
        }
        col--;
    }
    col = countblocks;
}

function restart() {
    score = 0;
    errors = 0;
    col = countblocks;
    for (rows = 0; rows < countblocks; rows++) {
        fields[rows] = [];
        for (columns = 0; columns < col; columns++) {
            fields[rows][columns] = {
                x: canvas.width / 2 - (countblocks - rows) / 2 * (fieldWidth) + columns * fieldWidth,
                y: canvas.height / 2 + fieldHeight * countblocks / 3 - (fieldHeight + 2) * rows,
                result: 0,
                status: 0,
                input: 0
            };
            if (rows == 0) {
                fields[rows][columns].result = getRandomNumber();
                fields[rows][columns].input = fields[rows][columns].result;
                fields[rows][columns].status = 1;
            }
            else
                fields[rows][columns].result = fields[rows - 1][columns].result + fields[rows - 1][columns + 1].result;
        }
        col--;
    }
    col = countblocks;
}

function getRandomNumber() {
    return (0 + Math.floor((Math.random() * maxNumber)) + minNumber);
}

//todo:
function fullscreen() {
}

function drawScores() {
    ctx.font = "16px Verdana";
    ctx.fillStyle = "#000000";
    ctx.fillText("Score:\t" + score, 20, canvas.height - 75);

    ctx.font = "16px Verdana";
    ctx.fillStyle = "#000000";
    ctx.fillText("Errors:\t" + errors, 20, canvas.height - 50);

    ctx.font = "16px Verdana";
    ctx.fillStyle = "#000000";
    ctx.fillText("Highscore:\t" + highscore, 20, canvas.height - 25);
}

//todo: nur Zahlen eingeben
function inputMouse(e) {
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;

    var input;
    //alert(x + "  " + y);
    col = countblocks;
    for (rows = 0; rows < countblocks; rows++) {
        for (columns = 0; columns < col; columns++) {
            if (x > fields[rows][columns].x && x < fields[rows][columns].x + fieldWidth) {
                if (y > fields[rows][columns].y && y < fields[rows][columns].y + fieldHeight) {
                    input = window.prompt("Geben Sie eine Zahl ein");
                    if (input != null && input != true) {
                        if (isNaN(input) == false)
                            fields[rows][columns].input = Number(input);
                        if (fields[rows][columns].input != fields[rows][columns].result) {
                            errors++;
                            if (score > 0)
                                score--;
                            if (errors == 3) {
                                alert("Drei Fehler! Du hast verloren :(");
                            }
                        }
                    }
                }
            }
        }
        col--;
    }
}

//todo: centered - Joni
function drawFields() {
    col = countblocks;
    for (rows = 0; rows < countblocks; rows++) {
        for (columns = 0; columns < col; columns++) {
            ctx.beginPath();
            ctx.rect(fields[rows][columns].x, fields[rows][columns].y, fieldWidth, fieldHeight);
            ctx.fillStyle = "#ffa500";
            if (fields[rows][columns].status === 1) {
                //ctx.fillStyle = "#9acd32";
                ctx.fillStyle = solved;
            }
            ctx.lineWidth = 5;
            ctx.strokeStyle = "grey";
            ctx.stroke();
            ctx.fill();
            ctx.closePath();

            //todo: Zahlen nicht zentriert
            if (fields[rows][columns].input !== 0) {
                ctx.font = "16px Verdana";
                ctx.fillStyle = "#000000";
                ctx.fillText(fields[rows][columns].input, fields[rows][columns].x + fieldWidth / 2 - 4, fields[rows][columns].y + fieldHeight / 2 + 8);
            }
        }
        col--;
    }
}

function checkResults() {
    col = countblocks;
    var i = 0;
    for (rows = 0; rows < countblocks; rows++) {
        for (columns = 0; columns < col; columns++) {
            if (fields[rows][columns].status == 0) {
                i++;
                if (fields[rows][columns].input == fields[rows][columns].result) {
                    fields[rows][columns].status = 1;
                    score++;
                    if (score > highscore)
                        highscore = score;
                }
            }
        }
        col--;
    }
    if (i == 0) {
        alert('Sie sind ein Gewinner!!!');
        //draw();
        restart();
    }
}

function setCookie(highscore) {
    document.cookie = highscore + ";path=/";
}

function getCookie(highscore) {
    var name = highscore+"=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/*let confetti = document.getElementById('confetti');
let conf = confetti.getContext('2d');
confetti.width = canvas.width;
confetti.height = canvas.height;
let pieces = [];
let numberOfPieces = 50;
let lastUpdateTime = Date.now();

function randomColor () {
    let colors = ['#f00', '#0f0', '#00f', '#0ff', '#f0f', '#ff0'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function update () {
    let now = Date.now(),
        dt = now - lastUpdateTime;

    for (let i = pieces.length - 1; i >= 0; i--) {
        let p = pieces[i];

        if (p.y > confetti.height) {
            pieces.splice(i, 1);
            continue;
        }

        p.y += p.gravity * dt;
        p.rotation += p.rotationSpeed * dt;
    }


    while (pieces.length < numberOfPieces) {
        pieces.push(new Piece(Math.random() * confetti.width, -20));
    }

    lastUpdateTime = now;

    setTimeout(update, 1);
}

function draw () {
    conf.clearRect(0, 0, confetti.width, confetti.height);

    pieces.forEach(function (p) {
        conf.save();

        conf.fillStyle = p.color;

        conf.translate(p.x + p.size / 2, p.y + p.size / 2);
        conf.rotate(p.rotation);

        conf.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);

        conf.restore();
    });

    requestAnimationFrame(draw);
}

function Piece (x, y) {
    this.x = x;
    this.y = y;
    this.size = (Math.random() * 0.5 + 0.75) * 15;
    this.gravity = (Math.random() * 0.5 + 0.75) * 0.1;
    this.rotation = (Math.PI * 2) * Math.random();
    this.rotationSpeed = (Math.PI * 2) * (Math.random() - 0.5) * 0.001;
    this.color = randomColor();
}

while (pieces.length < numberOfPieces) {
    pieces.push(new Piece(Math.random() * confetti.width, Math.random() * confetti.height));
}*/

function main() {
    init();
    drawFields();
    checkResults();
    setCookie(highscore);
    drawScores();
    requestAnimationFrame(main);
    //todo: Gabs dreschn
    //setCookie(highscore);
}

restart();
main();