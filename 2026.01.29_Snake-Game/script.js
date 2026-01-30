const startBtn = document.getElementById('startBtn');
const startContainer = document.querySelector('.start-container');
const gameContainer = document.querySelector('.game-container');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let snake = [
    { x: 100, y: 100 },
    { x: 90, y: 100 },
    { x: 80, y: 100 }
]
let mouseDirection = { x: 1, y: 0 };
let gameLoopId = null;

startBtn.addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        startGame();
    }
});

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const head = snake[0];
    const headCenterX = head.x + 5;
    const headCenterY = head.y + 5;

    const dx = mouseX - headCenterX;
    const dy = mouseY - headCenterY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 10) {
        mouseDirection.x = dx / distance;
        mouseDirection.y = dy / distance;

        const speedFactor = Math.min(1, distance / 100);
        mouseDirection.x *= speedFactor;
        mouseDirection.y *= speedFactor;
    }

    console.log(`마우스 위치: (${mouseX}, ${mouseY})`);
    console.log(`방향: (${mouseDirection.x.toFixed(2)}, ${mouseDirection.y.toFixed(2)})`);
})

function startGame() {
    startContainer.style.transition = 'opacity 0.3s';
    startContainer.style.opacity = '0';

    setTimeout(() => {
        startContainer.style.display = 'none';
        gameContainer.style.display = 'block';

        gameContainer.style.opacity = '0';
        gameContainer.style.transition = 'opacity 0.3s';

        setTimeout(() => {
            gameContainer.style.opacity = '1';
        }, 10);

        createCanvas();
        initSnake();
        startGameLoop();
    }, 300);
}

function createCanvas() {
    canvas.width = 1200;
    canvas.height = 600;

    ctx.fillStyle = '#0F1C28';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function initSnake() {
    const centerX = Math.floor(canvas.width / 2 / 10) * 10;
    const centerY = Math.floor(canvas.height / 2 / 10) * 10;

    snake = [
        { x: centerX, y: centerY },
        { x: centerX - 10, y: centerY },
        { x: centerX - 20, y: centerY }
    ];
    mouseDirection = { x: 1, y: 0 };
}

function startGameLoop() {
    if (gameLoopId) clearInterval(gameLoopId);

    gameLoopId = setInterval(() => {
        moveSnake();
        updateScreen();
    }, 50);
}

function drawSnakeWithLines() {
    const CELL_SIZE = 10;
    const RADIUS = 5;

    // 1. 연결선 그리기 (먼저)
    if (snake.length > 1) {
        ctx.strokeStyle = 'rgb(146, 211, 146)';
        ctx.lineWidth = RADIUS * 2;  // 원 지름과 맞춤
        ctx.lineCap = 'round';       // 끝을 둥글게
        ctx.lineJoin = 'round';      // 연결점 둥글게

        ctx.beginPath();
        // 첫 점으로 이동
        ctx.moveTo(snake[0].x + CELL_SIZE / 2, snake[0].y + CELL_SIZE / 2);

        // 각 점들을 선으로 연결
        for (let i = 1; i < snake.length; i++) {
            ctx.lineTo(snake[i].x + CELL_SIZE / 2, snake[i].y + CELL_SIZE / 2);
        }
        ctx.stroke();
    }

    // 2. 원 그리기 (나중에 - 선 위에)
    snake.forEach((coord, index) => {
        ctx.fillStyle = index === 0 ? '#f24141ff' : 'rgb(146, 211, 146)';
        ctx.beginPath();
        ctx.arc(
            coord.x + CELL_SIZE / 2,
            coord.y + CELL_SIZE / 2,
            RADIUS,
            0, Math.PI * 2
        );
        ctx.fill();
    });
}

function moveSnake() {
    const head = snake[0];

    const SPEED = 5;

    const newHead = {
        x: head.x + mouseDirection.x * SPEED,
        y: head.y + mouseDirection.y * SPEED
    };

    // ✅ 이동 거리 계산
    const moveDistance = Math.sqrt(
        Math.pow(newHead.x - head.x, 2) +
        Math.pow(newHead.y - head.y, 2)
    );

    if (moveDistance < 1) {
        // 거의 움직이지 않았으면 충돌 검사 생략
        return;
    }

    if (gameOver(newHead.x, newHead.y)) {
        clearInterval(gameLoopId);
        gameLoopId = null;
        if (confirm('오락이 종료되였습니다. 다시 시작하시겠습니까?')) {
            createCanvas();
            initSnake();
            startGameLoop();
        }
        return;
    }

    snake.unshift(newHead);
    snake.pop();
}

function updateScreen() {
    ctx.fillStyle = '#0F1C28';
    ctx.fillRect(0, 0, 1200, 600);

    drawSnakeWithLines();
}

function gameOver(x, y) {
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
        return true;
    }

    for (let i = 3; i < snake.length; i++) {
        // 자기 몸 충돌검사 (이 부분 중요!)
        const segment = snake[i];
        const distance = Math.sqrt(
            Math.pow(x - (segment.x + 5), 2) +
            Math.pow(y - (segment.y + 5), 2)
        );
        if (distance < 10) {
            // 반경 5 + 여유 5
            return true;
        }
    }

    return false;
}

