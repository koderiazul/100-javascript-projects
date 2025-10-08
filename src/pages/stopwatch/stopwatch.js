import "./stopwatch.css";

const Stopwatch = {
  view: () => `
    <div id="stopwatch-container">
      <h1>Stopwatch</h1>  
      <div id="display">00:00:00</div>
      <div id="controls">
        <button id="start-btn">Start</button>
        <button id="pause-btn" disabled>Pause</button>
        <button id="reset-btn">Reset</button>
      </div>
    </div>
  `,

  mount: () => {
    let startTime = null;
    let elapsedTime = 0;
    let timerInterval = null;

    const display = document.getElementById("display");
    const startBtn = document.getElementById("start-btn");
    const pauseBtn = document.getElementById("pause-btn");
    const resetBtn = document.getElementById("reset-btn");

    const formatTime = (time) => {
      const milliseconds = parseInt((time % 1000) / 10, 10);
      const seconds = Math.floor((time / 1000) % 60);
      const minutes = Math.floor((time / (1000 * 60)) % 60);
      return (
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds) +
        ":" +
        (milliseconds < 10 ? "0" + milliseconds : milliseconds)
      );
    };

    const updateDisplay = () => {
      const currentTime = Date.now();
      elapsedTime = currentTime - startTime;
      display.textContent = formatTime(elapsedTime);
    };

    startBtn.addEventListener("click", () => {
      if (!timerInterval) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateDisplay, 10);
        startBtn.disabled = true;
        pauseBtn.disabled = false;
      }
    });

    pauseBtn.addEventListener("click", () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
      }
    });

    resetBtn.addEventListener("click", () => {
      clearInterval(timerInterval);
      timerInterval = null;
      elapsedTime = 0;
      display.textContent = "00:00:00";
      startBtn.disabled = false;
      pauseBtn.disabled = true;
    });
  },
};

export default Stopwatch;
