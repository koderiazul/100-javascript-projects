import './typing-speed-test.css';

const TypingSpeedTest = {
  view: () => `
    <div id="typing-test-container">
      <h1>Typing Speed Test</h1>
      <p id="quote"></p>
      <textarea id="input" placeholder="Start typing here..." disabled></textarea>

      <div id="stats">
        <div><strong>Time:</strong> <span id="time">0</span>s</div>
        <div><strong>WPM:</strong> <span id="wpm">0</span></div>
        <div><strong>Accuracy:</strong> <span id="accuracy">0%</span></div>
      </div>

      <div id="controls">
        <button id="start-btn">Start Test</button>
        <button id="reset-btn" disabled>Reset</button>
      </div>
    </div>
  `,

  mount: () => {
    const quoteEl = document.getElementById('quote');
    const inputEl = document.getElementById('input');
    const timeEl = document.getElementById('time');
    const wpmEl = document.getElementById('wpm');
    const accuracyEl = document.getElementById('accuracy');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    const quotes = [
      "The quick brown fox jumps over the lazy dog.",
      "JavaScript is the language of the web.",
      "Typing fast takes practice and patience.",
      "Frontend development combines logic and design.",
      "Clean code always beats clever code."
    ];

    let timer = null;
    let time = 0;
    let currentQuote = '';
    let started = false;

    function getRandomQuote() {
      return quotes[Math.floor(Math.random() * quotes.length)];
    }

    function startTest() {
      currentQuote = getRandomQuote();
      quoteEl.textContent = currentQuote;
      inputEl.value = '';
      inputEl.disabled = false;
      inputEl.focus();
      started = true;
      startBtn.disabled = true;
      resetBtn.disabled = false;
      time = 0;
      timeEl.textContent = '0';
      wpmEl.textContent = '0';
      accuracyEl.textContent = '0%';

      timer = setInterval(() => {
        time++;
        timeEl.textContent = time;
        calculateStats();
      }, 1000);
    }

    function resetTest() {
      clearInterval(timer);
      quoteEl.textContent = '';
      inputEl.value = '';
      inputEl.disabled = true;
      startBtn.disabled = false;
      resetBtn.disabled = true;
      time = 0;
      started = false;
      timeEl.textContent = '0';
      wpmEl.textContent = '0';
      accuracyEl.textContent = '0%';
    }

    function calculateStats() {
      const typedText = inputEl.value;
      const words = typedText.trim().split(/\s+/).filter(w => w.length > 0);
      const correctChars = typedText.split('').filter((ch, i) => ch === currentQuote[i]).length;
      const accuracy = currentQuote.length ? Math.round((correctChars / currentQuote.length) * 100) : 0;
      const wpm = time > 0 ? Math.round((words.length / time) * 60) : 0;

      accuracyEl.textContent = `${accuracy}%`;
      wpmEl.textContent = wpm;

      if (typedText === currentQuote) {
        clearInterval(timer);
        inputEl.disabled = true;
        startBtn.disabled = false;
        started = false;
      }
    }

    inputEl.addEventListener('input', calculateStats);
    startBtn.addEventListener('click', startTest);
    resetBtn.addEventListener('click', resetTest);
  }
};

export default TypingSpeedTest;
