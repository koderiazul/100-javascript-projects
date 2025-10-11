import './color-picker.css';

const ColorPicker = {
  view: () => `
    <div id="color-picker-container">
       <div class="canvas-wrapper">
        <canvas id="color-area" width="300" height="500"></canvas>
        <div id="color-indicator"></div>
      </div>

      <label class="slider-label">Hue</label>
      <input type="range" id="hue-slider" min="0" max="360" value="0">

      <label class="slider-label">Alpha</label>
      <input type="range" id="alpha-slider" min="0" max="100" value="100">

      <div id="color-preview"></div>

      <div id="color-values">
        <input type="text" id="hex-value" readonly />
        <input type="text" id="rgb-value" readonly />
        <input type="text" id="hsl-value" readonly />
      </div>
    </div>
  `,

  mount: () => {
    const canvas = document.getElementById('color-area');
    const ctx = canvas.getContext('2d');
    const hueSlider = document.getElementById('hue-slider');
    const alphaSlider = document.getElementById('alpha-slider');
    const preview = document.getElementById('color-preview');
    const hexInput = document.getElementById('hex-value');
    const rgbInput = document.getElementById('rgb-value');
    const hslInput = document.getElementById('hsl-value');
    const indicator = document.getElementById('color-indicator');

    let hue = 0;
    let saturation = 1;
    let value = 1;
    let alpha = 1;
      let indicatorX = canvas.width;
    let indicatorY = 0;


    // HSV → RGB
    function hsvToRgb(h, s, v) {
      const c = v * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = v - c;
      let r = 0, g = 0, b = 0;

      if (h < 60) [r, g, b] = [c, x, 0];
      else if (h < 120) [r, g, b] = [x, c, 0];
      else if (h < 180) [r, g, b] = [0, c, x];
      else if (h < 240) [r, g, b] = [0, x, c];
      else if (h < 300) [r, g, b] = [x, 0, c];
      else [r, g, b] = [c, 0, x];

      return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
      };
    }

    // RGB → HEX
    function rgbToHex(r, g, b, a = 1) {
      const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');
      return (
        "#" +
        [r, g, b]
          .map((v) => v.toString(16).padStart(2, "0"))
          .join("") +
        (a < 1 ? alphaHex : "")
      );
    }

    // RGB → HSL
    function rgbToHsl(r, g, b, a = 1) {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = d / (1 - Math.abs(2 * l - 1));
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
          case g: h = ((b - r) / d + 2); break;
          case b: h = ((r - g) / d + 4); break;
        }
        h *= 60;
      }
      return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, ${a.toFixed(2)})`;
    }

    // draw color square
    function drawColorSquare() {
      const { r, g, b } = hsvToRgb(hue, 1, 1);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const whiteGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      whiteGrad.addColorStop(0, "white");
      whiteGrad.addColorStop(1, "transparent");
      ctx.fillStyle = whiteGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const blackGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      blackGrad.addColorStop(0, "transparent");
      blackGrad.addColorStop(1, "black");
      ctx.fillStyle = blackGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // update all displays
    function updateColor() {
      const { r, g, b } = hsvToRgb(hue, saturation, value);
      const hex = rgbToHex(r, g, b, alpha);
      const rgb = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
      const hsl = rgbToHsl(r, g, b, alpha);

      preview.style.backgroundColor = rgb;
      hexInput.value = hex;
      rgbInput.value = rgb;
      hslInput.value = hsl;

        // move indicator
      indicator.style.left = `${indicatorX}px`;
      indicator.style.top = `${indicatorY}px`;
    }

    // handle hue
    hueSlider.addEventListener('input', (e) => {
      hue = e.target.value;
      drawColorSquare();
      updateColor();
    });

    // handle alpha
    alphaSlider.addEventListener('input', (e) => {
      alpha = e.target.value / 100;
      updateColor();
    });

    // handle canvas drag for saturation/value
    function handleCanvas(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      saturation = Math.min(Math.max(x / canvas.width, 0), 1);
      value = 1 - Math.min(Math.max(y / canvas.height, 0), 1);

       indicatorX = Math.min(Math.max(x, 0), canvas.width);
      indicatorY = Math.min(Math.max(y, 0), canvas.height);

      updateColor();
    }

    canvas.addEventListener('mousedown', (e) => {
      handleCanvas(e);
      const move = (ev) => handleCanvas(ev);
      const up = () => {
        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', up);
      };
      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', up);
    });

    // init
    drawColorSquare();
    updateColor();
  },
};

export default ColorPicker;
