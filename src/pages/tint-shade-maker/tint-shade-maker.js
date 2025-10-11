import './tint-shade-maker.css';

const TintShadeMaker = {
  view: () => `
    <div id="tint-shade-maker">
      <h1>Tint & Shade Maker</h1>
      <div class="input-group">
        <label for="color-input">Enter a Hex Color:</label>
        <input type="text" id="color-input" placeholder="#3498db" maxlength="7" />
        <button id="generate-btn">Generate</button>
      </div>

      <div class="result-container">
        <div class="section">
          <h2>Tints</h2>
          <div id="tints" class="color-grid"></div>
        </div>
        <div class="section">
          <h2>Shades</h2>
          <div id="shades" class="color-grid"></div>
        </div>
      </div>
    </div>
  `,

  mount: () => {
    const input = document.getElementById('color-input');
    const btn = document.getElementById('generate-btn');
    const tintsContainer = document.getElementById('tints');
    const shadesContainer = document.getElementById('shades');

    const hexToRgb = (hex) => {
      hex = hex.replace(/^#/, '');
      if (hex.length === 3) {
        hex = hex.split('').map((x) => x + x).join('');
      }
      const num = parseInt(hex, 16);
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
      };
    };

    const rgbToHex = (r, g, b) => {
      const toHex = (v) => {
        const h = v.toString(16);
        return h.length === 1 ? '0' + h : h;
      };
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    const generateTints = (rgb) => {
      const tints = [];
      for (let i = 1; i <= 10; i++) {
        const ratio = i / 10;
        tints.push({
          hex: rgbToHex(
            Math.round(rgb.r + (255 - rgb.r) * ratio),
            Math.round(rgb.g + (255 - rgb.g) * ratio),
            Math.round(rgb.b + (255 - rgb.b) * ratio)
          ),
        });
      }
      return tints;
    };

    const generateShades = (rgb) => {
      const shades = [];
      for (let i = 1; i <= 10; i++) {
        const ratio = i / 10;
        shades.push({
          hex: rgbToHex(
            Math.round(rgb.r * (1 - ratio)),
            Math.round(rgb.g * (1 - ratio)),
            Math.round(rgb.b * (1 - ratio))
          ),
        });
      }
      return shades;
    };

    const renderColors = (container, colors) => {
      container.innerHTML = '';
      colors.forEach((c) => {
        const div = document.createElement('div');
        div.className = 'color-box';
        div.style.backgroundColor = c.hex;
        div.textContent = c.hex;
        div.addEventListener('click', () => {
          navigator.clipboard.writeText(c.hex);
          div.classList.add('copied');
          setTimeout(() => div.classList.remove('copied'), 800);
        });
        container.appendChild(div);
      });
    };

    btn.addEventListener('click', () => {
      const hex = input.value.trim();
      if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        alert('Please enter a valid hex color (e.g., #ff0000)');
        return;
      }

      const rgb = hexToRgb(hex);
      renderColors(tintsContainer, generateTints(rgb));
      renderColors(shadesContainer, generateShades(rgb));
    });
  },
};

export default TintShadeMaker;
