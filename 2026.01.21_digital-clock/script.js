const clockHourNum = document.querySelector('.clock-hours');
const clockMinuteNum = document.querySelector('.clock-minutes');
const clockSecondNum = document.querySelector('.clock-seconds');

const currentDate = document.querySelector('.current-date');

const stopWatchHourNum = document.querySelector('.stopwatch-hours');
const stopWatchMinuteNum = document.querySelector('.stopwatch-minutes');
const stopWatchSecondNum = document.querySelector('.stopwatch-seconds');
const stopWatchMsecondNum = document.querySelector('.stopwatch-mseconds');

const startBtn = document.querySelector('.start-btn');
const stopBtn = document.querySelector('.stop-btn');
const lapsBtn = document.querySelector('.lap-btn');
const resetBtn = document.querySelector('.reset-btn');

const lapsContainer = document.querySelector('.laps-section');

let stopwatchTime = 0;
let isStopwatchRunning = false;
let stopwatchTimerId;
let lapCount = 0;

window.addEventListener('DOMContentLoaded', () => {
    stopBtn.disabled = true;
})

function updateClock() {
    const now = new Date();

    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    clockHourNum.textContent = hours;
    clockMinuteNum.textContent = minutes;
    clockSecondNum.textContent = seconds;
    currentDate.textContent = now.toLocaleDateString('en-US', options);
}

updateClock();
setInterval(updateClock, 1000);

function formatStopwatchTime(ms) {
    let hours = Math.floor(ms / 3600000);
    let minutes = Math.floor((ms % 3600000) / 60000);
    let seconds = Math.floor((ms % 60000) / 1000);
    let mseconds = Math.floor((ms % 1000) / 10);

    return {
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        mseconds: mseconds.toString().padStart(2, '0')
    };
}

function updateStopwatchDisplay() {
    const time = formatStopwatchTime(stopwatchTime);

    stopWatchHourNum.textContent = time.hours;
    stopWatchMinuteNum.textContent = time.minutes;
    stopWatchSecondNum.textContent = time.seconds;
    stopWatchMsecondNum.textContent = time.mseconds;
}

function startStopwatch() {
    if (isStopwatchRunning) return;

    isStopwatchRunning = true;

    const startTime = Date.now() - stopwatchTime;

    stopwatchTimerId = setInterval(function() {
        stopwatchTime = Date.now() - startTime;
        updateStopwatchDisplay();
    }, 50);
}

startBtn.addEventListener('click', function() {
    startStopwatch();
    startBtn.disabled = true;
    stopBtn.disabled = false;
});

function stopStopWatch() {
    if (!isStopwatchRunning) return;

    isStopwatchRunning = false;
    clearInterval(stopwatchTimerId);
}

stopBtn.addEventListener('click', function() {
    stopStopWatch();
    startBtn.disabled = false;
    stopBtn.disabled = true;
});

function resetStopwatch() {
    stopStopWatch();
    stopwatchTime = 0;
    laps = [];
    lapCount = 0;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    updateLapsUI();
    updateStopwatchDisplay();
}

resetBtn.addEventListener('click', resetStopwatch);

let laps = [];

function lapsDisplay() {
    if (!isStopwatchRunning && stopwatchTime === 0) return;

    const time = formatStopwatchTime(stopwatchTime);

    laps.push(time);

    updateLapsUI();
}

function updateLapsUI() {
    // 내가 구현하기 말째하는 부분 - 무조건 기억!!!
    lapsContainer.innerHTML = '';
    laps.forEach((lap, index) => {
        const lapElement = document.createElement('div');
        lapElement.className = 'lap-item';
        lapElement.textContent = `Lap ${index + 1}: ${lap.hours}:${lap.minutes}:${lap.seconds}.${lap.mseconds}`;
        lapsContainer.appendChild(lapElement); 
    });
    lapsContainer.scrollTop = lapsContainer.scrollHeight;
}

lapsBtn.addEventListener('click', lapsDisplay);

// 키보드 event 추가
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (isStopwatchRunning) {
            stopStopWatch();
            startBtn.disabled = false;
            stopBtn.disabled = true;
        } else {
            startStopwatch();
            startBtn.disabled = true;
            stopBtn.disabled = false;
        }
    }
})