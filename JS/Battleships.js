var enemySquares = []

var mySquares = []

var myCanvas = document.getElementById("mySea")
var myContext = myCanvas.getContext("2d")

var enemyCanvas = document.getElementById("enemySea")
var enemyContext = enemyCanvas.getContext("2d")
var gapSize = 3
var numRows = 12
var numColumns = numRows
var squareSize = getSquareSize()
var sunkBoat = []
var lastHitIndex = null
var huntMode = false
var difficulty = "beginner"
var gameStarted = false


document.getElementById("difficulty").onchange = function () {
    difficulty = this.value
    console.log("Difficulty set to:", difficulty)
}

document.getElementById("startGame").onclick = function () {
    if (!gameStarted) {
        gameStarted = true
        document.getElementById("difficulty").disabled = true
        document.getElementById("startGame").disabled = true
        document.getElementById("mySea").onclick = gameSetupRound
        document.getElementById("flip").disabled = false
        hintMessage("Place your first ship to start playing!")
    }
}

var shipSizes = [
    { name: "Destroyer", length: 2 },
    { name: "Carrier", length: 5 },
    { name: "Battlship", length: 4 },
    { name: "Submarine", length: 3 },
    { name: "Cruiser", length: 3 }
]
var currentShipIndex = 0
var placingShipsHorizontally = true

document.getElementById("flip").onclick = function () {
    placingShipsHorizontally = !placingShipsHorizontally
    if (placingShipsHorizontally) {
        hintMessage("Placing ships horizontally")
    } else {
        hintMessage("Placing ships vertically")
    }
}


function createFriendlyGridSquare(rowNumber, columnNumber) {
    var square = {
        rowNr: rowNumber,
        columnNr: columnNumber,
        state: "water",
        getColor: mySeaColors,
        draw: drawSquare,
        changeState: updateSquareState,
        isClicked: coordinatesOverlap
    }
    return square
}


function insertEnemyGameMethods(squareIndex) {
    enemySquares[squareIndex].getColor = enemySeaColors
    enemySquares[squareIndex].draw = drawSquare
    enemySquares[squareIndex].changeState = updateSquareState
    enemySquares[squareIndex].isClicked = coordinatesOverlap
}


function drawSquare(context) {
    var x = this.columnNr * (squareSize + gapSize)
    var y = this.rowNr * (squareSize + gapSize)
    context.beginPath()
    context.fillStyle = this.getColor()
    context.rect(x, y, squareSize, squareSize)
    context.fill()
    context.font = "bold 10px sans-serif"
    context.fillStyle = "rgba(255, 255, 255, 0.8)"
    var squareIndex = this.rowNr * numColumns + this.columnNr
    context.fillText(squareIndex, x + 5, y + 15)
}


function updateSquareState(newState, context) {
    this.state = newState
    this.draw(context)

    var x = this.columnNr * (squareSize + gapSize)
    var y = this.rowNr * (squareSize + gapSize)

    if (newState == "miss") {
        context.beginPath()
        context.strokeStyle = "red"
        context.lineWidth = 2
        context.moveTo(x + 5, y + 5)
        context.lineTo(x + squareSize - 5, y + squareSize - 5)
        context.moveTo(x + squareSize - 5, y + 5)
        context.lineTo(x + 5, y + squareSize - 5)
        context.stroke()
    } else if (newState == "hit") {
        context.beginPath()
        context.strokeStyle = "limegreen"
        context.lineWidth = 3
        context.arc(x + squareSize / 2, y + squareSize / 2, squareSize / 4, 0, 2 * Math.PI)
        context.stroke()
    }
}


function coordinatesOverlap(x, y) {
    var squareX = this.columnNr * (squareSize + gapSize)
    var squareY = this.rowNr * (squareSize + gapSize)
    var fitsHorizontally = x >= squareX && x <= squareX + squareSize
    var fitsVertically = y >= squareY && y <= squareY + squareSize
    return fitsHorizontally && fitsVertically
}


function mySeaColors() {
    if (this.state == "water") {
        return "mediumslateblue"
    } else if (this.state == "miss") {
        return "lightcoral"
    } else if (this.state == "hit") {
        return "palegreen"
    } else if (this.state == "ship") {
        return "silver"
    }
}


function enemySeaColors() {
    if (this.state == "water") {
        return "darkslateblue"
    } else if (this.state == "miss") {
        return "crimson"
    } else if (this.state == "hit") {
        return "seagreen"
    } else if (this.state == "ship") {
        return "darkslateblue"
    }
}


function validPosition(firstSquareIndex, currentShipSize) {
    var isValid = true
    if (placingShipsHorizontally) {
        var colNr = mySquares[firstSquareIndex].columnNr
        var numAvailableSquares = numColumns - colNr
        if (numAvailableSquares < currentShipSize) {
            isValid = false
        }
        for (var i = 0; i < currentShipSize; i++) {
            var index = firstSquareIndex + i
            if (mySquares[index] && mySquares[index].state == "ship") {
                isValid = false
            }
        }
    } else {
        var rowNr = mySquares[firstSquareIndex].rowNr
        var numAvailableRows = numRows - rowNr
        if (numAvailableRows < currentShipSize) {
            isValid = false
        }
        for (var j = 0; j < currentShipSize; j++) {
            var index = firstSquareIndex + (j * numColumns)
            if (mySquares[index] && mySquares[index].state == "ship") {
                isValid = false
            }
        }
    }
    return isValid
}
function createEmptyEnemySea() {
    enemySquares = []
    for (var row = 0; row < numRows; row++) {
        for (var col = 0; col < numColumns; col++) {
            enemySquares.push({
                state: "water",
                rowNr: row,
                columnNr: col
            })
        }
    }
}

function enemyShips() {
    for (var s = 0; s < shipSizes.length; s++) {
        var size = shipSizes[s].length
        var horizontal = Math.random() < 0.5

        var placed = false

        while (!placed) {
            var startIndex = Math.floor(Math.random() * enemySquares.length)
            var colNr = enemySquares[startIndex].columnNr
            var numAvailableSquares = numColumns - colNr
            var valid = true

            if (numAvailableSquares < size) {
                valid = false
            } else {
                for (var i = startIndex; i < startIndex + size; i++) {
                    if (enemySquares[i] && enemySquares[i].state == "ship") {
                        valid = false
                    }
                }
            }

            if (valid) {
                for (var i = startIndex; i < startIndex + size; i++) {
                    enemySquares[i].state = "ship"
                    enemySquares[i].shipName = shipSizes[s].name
                }
                placed = true
            }
        }
    }
}


function placeShip(firstSquareIndex) {
    var currentShipSize = shipSizes[currentShipIndex].length

    if (validPosition(firstSquareIndex, currentShipSize)) {
        if (placingShipsHorizontally) {
            for (var i = 0; i < currentShipSize; i++) {
                var index = firstSquareIndex + i
                mySquares[index].changeState("ship", myContext)
                mySquares[index].shipName = shipSizes[currentShipIndex].name
            }
        } else {
            for (var j = 0; j < currentShipSize; j++) {
                var index = firstSquareIndex + (j * numColumns)
                mySquares[index].changeState("ship", myContext)
                mySquares[index].shipName = shipSizes[currentShipIndex].name
            }
        }

        currentShipIndex++

        if (currentShipIndex < shipSizes.length) {
            hintMessage("Place your " + shipSizes[currentShipIndex].name +
                " (length " + shipSizes[currentShipIndex].length + ")")
        } else {
            hintMessage("All ships placed! Click on enemy sea to start attacking.")
        }
    } else {
        hintMessage("Invalid position! Try again.")
    }
}





function hintMessage(message) {
    document.getElementById("hint").innerHTML = message
}


function createPlayerSea() {
    for (var rowNumber = 0; rowNumber < numRows; rowNumber++) {
        for (columnNumber = 0; columnNumber < numRows; columnNumber++) {
            var square = createFriendlyGridSquare(rowNumber, columnNumber)
            square.draw(myContext)
            mySquares.push(square)
        }
    }
    hintMessage("Place your " + shipSizes[currentShipIndex].name +
        " (length " + shipSizes[currentShipIndex].length + ")")
}

function getSquareSize() {
    var canvasWidth = myCanvas.width
    var optimalSquareSize = (canvasWidth / numRows) - gapSize
    return optimalSquareSize
}


function createEnemySea() {
    createEmptyEnemySea()
    enemyShips()

    for (var i = 0; i < enemySquares.length; i++) {
        insertEnemyGameMethods(i)
        enemySquares[i].draw(enemyContext)
    }
}


function playHumanTurn(mouseX, mouseY) {
    for (var i = 0; i < enemySquares.length; i++) {
        if (enemySquares[i].isClicked(mouseX, mouseY)) {
            if (enemySquares[i].state == "hit" || enemySquares[i].state == "miss") {
                hintMessage("You already attacked this spot! Try another one.")
                return
            }
            if (enemySquares[i].state == "water") {
                enemySquares[i].changeState("miss", enemyContext)
            }
            else if (enemySquares[i].state == "ship") {
                enemySquares[i].changeState("hit", enemyContext)
                shipSunk(enemySquares[i].shipName, enemySquares, true)
            }

        }
    }
}


function enemyAttack() {
    var targetIndex
    var randomMode = false

    if (difficulty == "beginner") {
        randomMode = true
    }

    if (difficulty == "medium") {
        randomMode = Math.random() < 0.5
    }


    if (!randomMode && huntMode && lastHitIndex !== null) {
        var possibleTargets = [
            lastHitIndex - numColumns,
            lastHitIndex + numColumns,
            lastHitIndex - 1,
            lastHitIndex + 1
        ]

        possibleTargets = possibleTargets.filter(i =>
            i >= 0 &&
            i < mySquares.length &&
            mySquares[i].state != "hit" &&
            mySquares[i].state != "miss"
        )

        if (possibleTargets.length > 0) {
            targetIndex = possibleTargets[Math.floor(Math.random() * possibleTargets.length)]
        } else {
            huntMode = false
        }
    }

    if (randomMode || !huntMode || targetIndex === undefined) {
        do {
            targetIndex = Math.floor(Math.random() * mySquares.length)
        } while (mySquares[targetIndex].state == "hit" || mySquares[targetIndex].state == "miss")
    }

    if (mySquares[targetIndex].state == "ship") {
        mySquares[targetIndex].changeState("hit", myContext)
        lastHitIndex = targetIndex
        huntMode = true
        checkIfShipIsSunk(mySquares[targetIndex].shipName, mySquares, false)
    } else {
        mySquares[targetIndex].changeState("miss", myContext)
    }
}

function shipSunk(shipName, squares, isEnemy) {
    if (!shipName) return

    var stillAlive = false

    for (var i = 0; i < squares.length; i++) {
        if (squares[i].shipName == shipName && squares[i].state == "ship") {
            stillAlive = true
        }
    }
    if (!stillAlive && !sunkBoat.includes(shipName)) {
        sunkBoat.push(shipName)
        if (isEnemy) {
            hintMessage("You sunk the enemy’s " + shipName + "!")
        } else {
            hintMessage("The enemy sunk your " + shipName + "!")
        }
    }
}

function winner() {
    var allEnemyShipsSunk = true
    var allMyShipsSunk = true

    for (var i = 0; i < enemySquares.length; i++) {
        if (enemySquares[i].state == "ship") {
            allEnemyShipsSunk = false
        }
    }

    for (var j = 0; j < mySquares.length; j++) {
        if (mySquares[j].state == "ship") {
            allMyShipsSunk = false
        }
    }

    if (allEnemyShipsSunk) {
        hintMessage("You won! All enemy ships are sunk!")
        endGame()
    } else if (allMyShipsSunk) {
        hintMessage("You lost! The enemy destroyed all your ships.")
        endGame()
    }
}

function endGame() {
    document.getElementById("enemySea").onclick = null;
    document.getElementById("mySea").onclick = null;

    console.log("Game Over");

    // Show final message and restart button
    const restartBtn = document.createElement("button");
    restartBtn.id = "restartGame";
    restartBtn.textContent = "Play Again";
    restartBtn.style.marginTop = "20px";
    restartBtn.style.padding = "10px 20px";
    restartBtn.style.fontSize = "1rem";
    restartBtn.style.backgroundColor = "#395258";
    restartBtn.style.color = "#FAEDCD";
    restartBtn.style.border = "none";
    restartBtn.style.borderRadius = "8px";
    restartBtn.style.cursor = "pointer";
    restartBtn.style.transition = "background 0.3s ease";
    restartBtn.onmouseenter = () => restartBtn.style.backgroundColor = "#B97C5E";
    restartBtn.onmouseleave = () => restartBtn.style.backgroundColor = "#395258";

    const hintDiv = document.getElementById("hint");
    hintDiv.appendChild(document.createElement("br"));
    hintDiv.appendChild(restartBtn);

    restartBtn.addEventListener("click", resetGame);
}


function gameSetupRound(clickEvent) {
    mouseX = clickEvent.offsetX
    mouseY = clickEvent.offsetY

    for (var i = 0; i < mySquares.length; i++) {
        if (mySquares[i].isClicked(mouseX, mouseY)) {
            placeShip(i)
            if (!gameStarted) {
                gameStarted = true
                document.getElementById("difficulty").disabled = true
                document.getElementById("startGame").disabled = true
                document.getElementById("flip").disabled = false
            }
            if (currentShipIndex == shipSizes.length) {
                createEnemySea()
                document.getElementById("flip").disabled = true
                document.getElementById("enemySea").onclick = nextTurn
                document.getElementById("mySea").onclick = ""
            }

        }
    }
}

function resetGame() {
    // Clear canvases and variables
    myContext.clearRect(0, 0, myCanvas.width, myCanvas.height);
    enemyContext.clearRect(0, 0, enemyCanvas.width, enemyCanvas.height);

    enemySquares = [];
    mySquares = [];
    sunkBoat = [];
    lastHitIndex = null;
    huntMode = false;
    gameStarted = false;
    currentShipIndex = 0;

    // Remove restart button
    const restartBtn = document.getElementById("restartGame");
    if (restartBtn) restartBtn.remove();

    // Re-enable game setup buttons
    document.getElementById("difficulty").disabled = false;
    document.getElementById("startGame").disabled = false;
    document.getElementById("flip").disabled = false;

    // Reset difficulty dropdown to previous or default
    difficulty = document.getElementById("difficulty").value;

    // Draw player sea again and rebind everything
    hintMessage("Game reset! Place your ships to start again.");
    createPlayerSea();
    document.getElementById("mySea").onclick = gameSetupRound;
}



function nextTurn(clickEvent) {
    hintMessage("Throw a bomb in enemy sea!")
    mouseX = clickEvent.offsetX
    mouseY = clickEvent.offsetY
    playHumanTurn(mouseX, mouseY)
    enemyAttack()
    winner()
}

createPlayerSea()
document.getElementById("mySea").onclick = gameSetupRound

