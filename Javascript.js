var canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

var countblocks = document.getElementById("countblocks").value;
var col = countblocks;
var fieldWidth;
var fieldHeight;
var currentTheme = "Arktis";
var unsolved = "#ffa500";
var solved = "#9acd32";
var position = canvas.width / 3;

var score;
var highscore = document.cookie;
if (highscore == "")
    highscore = 0;

var errors;
var maxErrors;

/*var confetti;
let pieces = [];
let numberOfPieces = 100;
let lastUpdateTime = Date.now();*/

var minNumber;
var maxNumber;

document.addEventListener("mousedown", inputMouse, false);

var fields = [];

function init() {
    fullscreen();
    col = countblocks;
    canvas.width = window.innerWidth - 17;
    canvas.height = window.innerHeight - 17;
    fieldWidth = canvas.width / countblocks / 1.8;
    fieldHeight = canvas.height / countblocks / 1.8;

    col = countblocks;
    for (rows = 0; rows < countblocks; rows++) {
        for (columns = 0; columns < col; columns++) {
            fields[rows][columns].x = position - (countblocks - rows) / 2 * (fieldWidth) + columns * fieldWidth;
            fields[rows][columns].y = canvas.height / 2.3 + fieldHeight * countblocks / 3 - (fieldHeight + 3) * rows
        }
        col--;
    }
    col = countblocks;
}

function restart() {
    //confetti = 0;
    minNumber = +document.getElementById("minNum").value; //= 1;
    maxNumber = +document.getElementById("maxNum").value;
    countblocks = +document.getElementById("countblocks").value;
    maxErrors = +document.getElementById("maxFehler").value;
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
            if (rows === 0) {
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
    return Math.floor(Math.random() * ((maxNumber + 1) - minNumber) + minNumber);
}

//todo:
function fullscreen() {
}

function randomColor() {
    let colors = ['#f00', '#0f0', '#00f', '#0ff', '#f0f', '#ff0'];
    return colors[Math.floor(Math.random() * colors.length)];
}

//todo:Confetti
/*function update() {
    let now = Date.now(),
        dt = now - lastUpdateTime;

    for (let i = pieces.length - 1; i >= 0; i--) {
        let p = pieces[i];

        if (p.y > canvas.height) {
            pieces.splice(i, 1);
            continue;
        }

        p.y += p.gravity * dt;
        p.rotation += p.rotationSpeed * dt;
    }


    while (pieces.length < numberOfPieces) {
        pieces.push(new Piece(Math.random() * canvas.width, -20));
    }

    lastUpdateTime = now;

    setTimeout(update, 1);
}*/

/*function draw() {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(function (p) {
        ctx.save();

        ctx.fillStyle = p.color;

        ctx.translate(p.x + p.size / 2, p.y + p.size / 2);
        ctx.rotate(p.rotation);

        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);

        ctx.restore();
    });

    requestAnimationFrame(draw);
}*/

/*function Piece(x, y) {
    this.x = x;
    this.y = y;
    this.size = (Math.random() * 0.5 + 0.75) * 15;
    this.gravity = (Math.random() * 0.5 + 0.75) * 0.1;
    this.rotation = (Math.PI * 2) * Math.random();
    this.rotationSpeed = (Math.PI * 2) * (Math.random() - 0.5) * 0.001;
    this.color = randomColor();
}*/

//Ende Confetti

function drawScores() {
    if(currentTheme === "Dschungel")
    {
        ctx.beginPath();
        ctx.rect(0, 0, fieldWidth, fieldHeight);
        ctx.fillStyle = "#C9FFC7";
        ctx.lineWidth = 5;
        ctx.strokeStyle = "grey";
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    ctx.font = "16px Verdana";
    ctx.fillStyle = "#000000";
    ctx.fillText("Score:\t" + score, 20, /*canvas.height - */25);

    ctx.font = "16px Verdana";
    ctx.fillStyle = "#000000";
    ctx.fillText("Errors:\t" + errors, 20, /*canvas.height - */75);

    ctx.font = "16px Verdana";
    ctx.fillStyle = "#000000";
    ctx.fillText("Highscore:\t" + highscore, 20, /*canvas.height - */50);
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
                    if (input != null && input !== true) {
                        if (isNaN(input) === false)
                            fields[rows][columns].input = Number(input);
                        if (fields[rows][columns].input !== fields[rows][columns].result) {
                            errors++;
                            if (score > 0)
                                score--;
                            if (errors === maxErrors) {
                                alert(errors + " Fehler! Du hast verloren :(");
                                restart();
                            }
                        }
                    }
                }
            }
        }
        col--;
    }
}

function drawFields() {
    col = countblocks;
    for (rows = 0; rows < countblocks; rows++) {
        for (columns = 0; columns < col; columns++) {
            ctx.beginPath();
            ctx.rect(fields[rows][columns].x, fields[rows][columns].y, fieldWidth, fieldHeight);
            ctx.fillStyle = unsolved;
            if (fields[rows][columns].status === 1) {
                //todo: color of solved blocks
                ctx.fillStyle = solved;
            }
            ctx.lineWidth = 5;
            ctx.strokeStyle = "grey";
            ctx.stroke();
            ctx.fill();
            ctx.closePath();

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
            if (fields[rows][columns].status === 0) {
                i++;
                if (fields[rows][columns].input === fields[rows][columns].result) {
                    fields[rows][columns].status = 1;
                    score++;
                    if (score > highscore) {
                        highscore = score;
                        document.cookie = score + "; expires=Fri, 31 Dec 2100 12:00:00 UTC";
                    }

                }
            }
        }
        col--;
    }
    if (i === 0 /*&& confetti === 0*/) {
        alert('Sie sind ein Gewinner!!!');
        //confetti = 1;
        restart();
    }
}

function changeBkgrnd(src) {
    document.body.style.backgroundImage = "url(" + src + ")";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    if (src === "Hintergruende/Arktis.jpg") {
        position = canvas.width / 3;
        /*unsolved = "#ffa500";
        solved = "#9acd32";*/
        unsolved = "#14c9ff";
        solved = "#0080ff";
    } else if (src === "Hintergruende/Wueste.jpg") {
        position = canvas.width / 3;
        unsolved = "#ffff44";
        solved = "#ffb32a";
    }
    else if (src === "Hintergruende/Dschungel.png") {
        position = canvas.width / 2;
        unsolved = "#61ff00";
        solved = "#009c00";
    } else {
        position = canvas.width / 2;
        unsolved = "#c2baba";
        solved = "#a19b99";
    }
}

//faben
function main() {

    init();
    drawFields();
    checkResults();
    drawScores();


    /*
    //todo: laggy
    if (confetti) {
        while (pieces.length < numberOfPieces) {
            pieces.push(new Piece(Math.random() * canvas.width, Math.random() * canvas.height));
        }
        update();
        draw();
    }*/
    requestAnimationFrame(main);
}

restart();
main();
