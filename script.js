let sessionLength = 25; // Initial session length
let breakLength = 5; // Initial break length
let timer = sessionLength * 60; // Initial timer in seconds
let isRunning = false; // To check if the timer is running
let isSession = true; // To check if the timer is in session or break mode
let interval; // To store the setInterval ID for the timer

// Elements
const timeLeft = document.getElementById('time-left');
const sessionLengthDisplay = document.getElementById('session-length');
const breakLengthDisplay = document.getElementById('break-length');
const timerLabel = document.getElementById('timer-label');
const startStopButton = document.getElementById('start_stop');
const resetButton = document.getElementById('reset');
const beep = document.getElementById('beep'); // The beep sound

// Update the timer display
function updateTimeDisplay() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timeLeft.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Start/Stop the timer
function startStop() {
    if (!isRunning) {
        // If the timer is paused and being resumed, start the countdown again
        if (interval === null) {
            interval = setInterval(countdown, 1000); // Resume countdown
            startStopButton.querySelector('i:nth-child(1)').style.display = 'none';
            startStopButton.querySelector('i:nth-child(2)').style.display = 'inline-block';
        } else {
            // If the timer is being started for the first time, sync it with the session length
            timer = sessionLength * 60;
            updateTimeDisplay();
            interval = setInterval(countdown, 1000); // Start countdown
            startStopButton.querySelector('i:nth-child(1)').style.display = 'none';
            startStopButton.querySelector('i:nth-child(2)').style.display = 'inline-block';
        }
    } else {
        // Pause the timer
        clearInterval(interval);
        interval = null; // Reset interval reference
        startStopButton.querySelector('i:nth-child(1)').style.display = 'inline-block';
        startStopButton.querySelector('i:nth-child(2)').style.display = 'none';
    }
    isRunning = !isRunning; // Toggle running state
}

// Countdown function to handle the timer
function countdown() {
    if (timer > 0) {
        timer--; // Decrease the timer by 1 second
        updateTimeDisplay();
    } else {
        console.log('Timer reached zero, playing beep...');
        beep.play().catch((error) => {
            console.log('Error playing beep sound:', error);
        });

        if (isSession) {
            // Switch to Break
            timer = breakLength * 60;
            timerLabel.textContent = "Break";
        } else {
            // Switch to Session
            timer = sessionLength * 60;
            timerLabel.textContent = "Session";
        }

        isSession = !isSession; // Toggle between session and break
        updateTimeDisplay(); // Update the UI immediately
    }
}

// Reset function to set the timer and break lengths back to default
function reset() {
    clearInterval(interval); // Stop any running timer
    isRunning = false;
    isSession = true;

    // Reset session and break lengths to their default values
    sessionLength = 25;
    breakLength = 5;

    // Update the display for session and break lengths
    sessionLengthDisplay.textContent = sessionLength;
    breakLengthDisplay.textContent = breakLength;

    // Reset the timer to the session length (25 minutes)
    timer = sessionLength * 60;
    updateTimeDisplay(); // Update the display for time-left

    // Reset beep sound
    beep.pause();
    beep.currentTime = 0; // Rewind to the beginning

    // Reset the timer label to 'Session'
    timerLabel.textContent = "Session";

    // Reset start/stop button icons
    startStopButton.querySelector('i:nth-child(1)').style.display = 'inline-block';
    startStopButton.querySelector('i:nth-child(2)').style.display = 'none';
}

// Increment/Decrement session length
function changeSessionLength(amount) {
    sessionLength = Math.max(1, sessionLength + amount); // Prevent it from going below 1
    sessionLength = Math.min(60, sessionLength); // Prevent it from going above 60
    sessionLengthDisplay.textContent = sessionLength;
    if (isSession) {
        timer = sessionLength * 60;
        updateTimeDisplay();
    }
}

// Increment/Decrement break length
function changeBreakLength(amount) {
    breakLength = Math.max(1, breakLength + amount); // Prevent it from going below 1
    breakLength = Math.min(60, breakLength); // Prevent it from going above 60
    breakLengthDisplay.textContent = breakLength;
    if (!isSession) {
        timer = breakLength * 60;
        updateTimeDisplay();
    }
}

// Add event listeners to buttons
document.getElementById('session-increment').addEventListener('click', () => changeSessionLength(1));
document.getElementById('session-decrement').addEventListener('click', () => changeSessionLength(-1));
document.getElementById('break-increment').addEventListener('click', () => changeBreakLength(1));
document.getElementById('break-decrement').addEventListener('click', () => changeBreakLength(-1));
startStopButton.addEventListener('click', startStop);
resetButton.addEventListener('click', reset);

// Initial time display
updateTimeDisplay();
