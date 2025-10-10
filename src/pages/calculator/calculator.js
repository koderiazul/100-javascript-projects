import './calculator.css';

const Calculator = {
  view: () => `
    <div id="calculator">
      <div id="display">0</div>
      <div id="buttons">
        <button class="btn clear">C</button>
        <button class="btn backspace">⌫</button>
        <button class="btn operator">%</button>
        <button class="btn operator">/</button>

        <button class="btn num">(</button>
        <button class="btn num">)</button>
        <button class="btn operator">*</button>
        <button class="btn operator">-</button>

        <button class="btn num">7</button>
        <button class="btn num">8</button>
        <button class="btn num">9</button>
        <button class="btn operator">+</button>

        <button class="btn num">4</button>
        <button class="btn num">5</button>
        <button class="btn num">6</button>
        <button class="btn equal">=</button>

        <button class="btn num">1</button>
        <button class="btn num">2</button>
        <button class="btn num">3</button>
        <button class="btn num">0</button>
        <button class="btn num">.</button>
      </div>
    </div>
  `,

  mount: () => {
    const display = document.querySelector('#display');
    const buttons = document.querySelectorAll('#buttons .btn');
    let current = '';

    function updateDisplay() {
      display.textContent = current || '0';
    }

    function calculate() {
      try {
        // Convert % into /100 for proper math evaluation
        const expression = current.replace(/%/g, '/100');
        const result = eval(expression);
        current = result.toString();
        updateDisplay();
      } catch {
        display.textContent = 'Error';
        current = '';
      }
    }

    function handleInput(value) {
      if (value === 'C') {
        current = '';
      } else if (value === '⌫') {
        current = current.slice(0, -1);
      } else if (value === '=') {
        calculate();
        return;
      } else {
        current += value;
      }
      updateDisplay();
    }

    // Handle button clicks
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        handleInput(btn.textContent);
      });
    });

    // Handle keyboard inputs
    document.addEventListener('keydown', (e) => {
      const key = e.key;

      if (/^[0-9+\-*/().%]$/.test(key)) {
        current += key;
        updateDisplay();
      } else if (key === 'Enter') {
        e.preventDefault();
        calculate();
      } else if (key === 'Backspace') {
        current = current.slice(0, -1);
        updateDisplay();
      } else if (key.toLowerCase() === 'c') {
        current = '';
        updateDisplay();
      }
    });
  },
};

export default Calculator;
