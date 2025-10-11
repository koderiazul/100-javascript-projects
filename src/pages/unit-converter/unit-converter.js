import './unit-converter.css';

const UnitConverter = {
  view: () => `
    <div id="unit-converter">
      <h2 class="title">Smart Unit Converter</h2>

      <div class="converter-card">
        <div class="field">
          <label>Category</label>
          <select id="category">
            <option value="length">Length (px, em, rem, %)</option>
            <option value="angle">Angle (deg, rad, turn)</option>
            <option value="time">Time (ms, s, min, hr)</option>
          </select>
        </div>

        <div class="field">
          <label>Value</label>
          <input type="number" id="input-value" placeholder="Enter number" />
        </div>

        <div class="unit-row">
          <div class="field">
            <label>From</label>
            <select id="from-unit"></select>
          </div>

          <button id="swap-btn" title="Swap Units">⇄</button>

          <div class="field">
            <label>To</label>
            <select id="to-unit"></select>
          </div>
        </div>

        <button id="convert-btn">Convert</button>

        <div class="result-box">
          <label>Result</label>
          <input type="text" id="output-value" readonly />
        </div>
      </div>

      <p class="note">Select a category to view relevant units only</p>
    </div>
  `,

  mount: () => {
    const category = document.getElementById('category');
    const fromUnit = document.getElementById('from-unit');
    const toUnit = document.getElementById('to-unit');
    const input = document.getElementById('input-value');
    const output = document.getElementById('output-value');
    const convertBtn = document.getElementById('convert-btn');
    const swapBtn = document.getElementById('swap-btn');

    const BASE_FONT_SIZE = 16;
    const PERCENT_BASE = 100;

    // Category → available units
    const categoryUnits = {
      length: ['px', 'em', 'rem', '%'],
      angle: ['deg', 'rad', 'turn'],
      time: ['ms', 's', 'min', 'hr'],
    };

    // Conversion logic grouped by category
    const conversions = {
      length: {
        px: {
          px: (v) => v,
          em: (v) => v / BASE_FONT_SIZE,
          rem: (v) => v / BASE_FONT_SIZE,
          '%': (v) => (v / BASE_FONT_SIZE) * PERCENT_BASE,
        },
        em: {
          px: (v) => v * BASE_FONT_SIZE,
          em: (v) => v,
          rem: (v) => v,
          '%': (v) => v * 100,
        },
        rem: {
          px: (v) => v * BASE_FONT_SIZE,
          em: (v) => v,
          rem: (v) => v,
          '%': (v) => v * 100,
        },
        '%': {
          px: (v) => (v / 100) * BASE_FONT_SIZE,
          em: (v) => v / 100,
          rem: (v) => v / 100,
          '%': (v) => v,
        },
      },

      angle: {
        deg: {
          deg: (v) => v,
          rad: (v) => (v * Math.PI) / 180,
          turn: (v) => v / 360,
        },
        rad: {
          deg: (v) => (v * 180) / Math.PI,
          rad: (v) => v,
          turn: (v) => v / (2 * Math.PI),
        },
        turn: {
          deg: (v) => v * 360,
          rad: (v) => v * 2 * Math.PI,
          turn: (v) => v,
        },
      },

      time: {
        ms: {
          ms: (v) => v,
          s: (v) => v / 1000,
          min: (v) => v / 60000,
          hr: (v) => v / 3600000,
        },
        s: {
          ms: (v) => v * 1000,
          s: (v) => v,
          min: (v) => v / 60,
          hr: (v) => v / 3600,
        },
        min: {
          ms: (v) => v * 60000,
          s: (v) => v * 60,
          min: (v) => v,
          hr: (v) => v / 60,
        },
        hr: {
          ms: (v) => v * 3600000,
          s: (v) => v * 3600,
          min: (v) => v * 60,
          hr: (v) => v,
        },
      },
    };

    // Populate units dynamically
    const updateUnits = () => {
      const units = categoryUnits[category.value];
      fromUnit.innerHTML = units.map((u) => `<option value="${u}">${u}</option>`).join('');
      toUnit.innerHTML = units.map((u) => `<option value="${u}">${u}</option>`).join('');
    };

    const convert = () => {
      const val = parseFloat(input.value);
      if (isNaN(val)) {
        output.value = 'Enter a valid number';
        return;
      }

      const cat = category.value;
      const from = fromUnit.value;
      const to = toUnit.value;

      const converter = conversions[cat]?.[from]?.[to];
      if (converter) {
        const result = converter(val);
        output.value = parseFloat(result.toFixed(4)) + to;
      } else {
        output.value = 'N/A';
      }
    };

    // Initialize
    updateUnits();

    category.addEventListener('change', updateUnits);
    convertBtn.addEventListener('click', convert);
    input.addEventListener('keydown', (e) => e.key === 'Enter' && convert());
    swapBtn.addEventListener('click', () => {
      const tmp = fromUnit.value;
      fromUnit.value = toUnit.value;
      toUnit.value = tmp;
    });
  },
};

export default UnitConverter;
