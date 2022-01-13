const playArea = document.querySelector(".playArea")
const scoreBoard = document.querySelector("#score")

let snake = ["0x7", "0x6", "0x5", "0x4", "0x3", "0x2", "0x1", "0x0"]

// horizontal movement in the begining
let x = 0
let y = 1


let score = 0

let pause = false

initPlayArea()

play()


function initPlayArea() {
    for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
            let cell = document.createElement("div")
            cell.classList.add("cell")
            cell.id = `${i}x${j}`

            playArea.appendChild(cell)
        }
    }
}

function delay(n) {
    return new Promise(function (resolve) {
        setTimeout(resolve, n * 1000);
    });
}

function displaySnake() {
    // remove old snake
    if (document.querySelector(".snakeHead"))
        document.querySelector(".snakeHead").classList.remove("snakeHead")
    Array.from(document.querySelectorAll(".snakeBody")).forEach(element => {
        element.classList.remove("snakeBody")
    })

    // add next frame
    document.getElementById(snake[0]).classList.add("snakeHead")
    for (let i = 1; i < snake.length; i++) {
        document.getElementById(snake[i]).classList.add("snakeBody")
    }
}

async function play() {
    enableInput()

    // start with 4 food cells
    addFood()
    addFood()
    addFood()
    addFood()

    while (true) {
        checkState()

        if (pause) {
            document.querySelector("#info").innerHTML = "GAME OVER!!!"
            break
        }

        displaySnake()
        moveSnake(x, y)
        await delay(0.125)
    }
}

function moveSnake(x, y) {
    let prev = snake[0]
    const head = snake[0].split("x")

    snake[0] = `${parseInt(head[0]) + x}x${parseInt(head[1]) + y}`

    let temp

    for (let i = 1; i < snake.length; i++) {
        temp = snake[i]
        snake[i] = prev
        prev = temp
    }
}

function addFood() {
    let foodX, foodY

    // find an empty cell
    do {
        cellNo = Math.floor((Math.random() * 625));
        foodX = Math.floor(cellNo / 25)
        foodY = (cellNo % 25)

    } while (document.getElementById(`${foodX}x${foodY}`).classList.contains("snakeBody") || document.getElementById(`${foodX}x${foodY}`).classList.contains("snakeHead") || document.getElementById(`${foodX}x${foodY}`).classList.contains("food"))

    document.getElementById(`${foodX}x${foodY}`).classList.add("food")
}

function checkState() {
    const head = snake[0].split("x")
    let headX = head[0]
    let headY = head[1]

    // wall collison
    if (headX < 0 || headX > 24 || headY < 0 || headY > 24) {
        pause = true
        return
    }

    // self collison
    if (document.getElementById(snake[0]).classList.contains("snakeBody")) {
        pause = true
    }

    // food collison
    if (document.getElementById(snake[0]).classList.contains("food")) {
        let tail = snake[snake.length - 1].split("x")
        let tailX = parseInt(tail[0])
        let tailY = parseInt(tail[1])
        snake.push(`${tailX}x${tailY}`)

        // remove the food
        document.getElementById(snake[0]).classList.remove("food")

        // add new food
        addFood()

        // increase score
        score++
        scoreBoard.innerHTML = score

    }
}


function enableInput() {
    let prevKeypressed

    document.addEventListener('keypress', e => {

        // movement controlls
        // prevent movement in the opposite direction of current movement
        if (e.key === 'w' && prevKeypressed != 's') {
            x = -1
            y = 0

            prevKeypressed = 'w'
        }
        else if (e.key === 's' && prevKeypressed != 'w') {
            x = 1
            y = 0

            prevKeypressed = 's'
        }
        else if (e.key === 'd' && prevKeypressed != 'a') {
            x = 0
            y = 1

            prevKeypressed = 'd'
        }
        else if (e.key === 'a' && prevKeypressed != 'd') {
            x = 0
            y = -1

            prevKeypressed = 'a'
        }

        // pause
        if (e.key === 'p')
            pause = true
    })
}