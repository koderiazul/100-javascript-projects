import "./seven-seg-clock.css";

const SEGMENT_BCD = [
  "1111110", // 0
  "0110000", // 1
  "1101101", // 2
  "1111001", // 3
  "0110011", // 4
  "1011011", // 5
  "1011111", // 6
  "1110000", // 7
  "1111111", // 8
  "1111011", // 9
];

const SevenSegClock = {
  view: () => `
    <div id="seg-clock-container">
      <div class="seven-seg-clock">
        ${Array.from({ length: 6 })
          .map(
            (_, i) => `
              <div class="seg-digit">
                <span class="seg1"></span>
                <span class="seg2"></span>
                <span class="seg3"></span>
                <span class="seg4"></span>
                <span class="seg5"></span>
                <span class="seg6"></span>
                <span class="seg7"></span>
              </div>
              ${i === 1 || i === 3 ? `<div class="separator"><span></span><span></span></div>` : ""}
            `
          )
          .join("")}
      </div>
    </div>
  `,

  mount: () => {
    const elements = document.querySelectorAll(".seg-digit > span");
    const seperators = document.querySelectorAll(".separator > span");

    const updateSegments = (timeStr) => {
      for (let i = 0; i < timeStr.length; i++) {
        const digit = parseInt(timeStr[i], 10);
        const segmentMap = SEGMENT_BCD[digit];
        for (let j = 0; j < 7; j++) {
          const el = elements[i * 7 + j];
          if (segmentMap[j] === "1") {
            el.classList.add("active");
          } else {
            el.classList.remove("active");
          }
        }
      }
      seperators.forEach((sep) => {
        sep.style.opacity = 1;
      });
    };

    setInterval(() => {
      const now = new Date();
      let hour = now.getHours();
      const minute = now.getMinutes();
      const second = now.getSeconds();

      if (hour === 0) hour = 12;
      else if (hour > 12) hour -= 12;

      const timeStr = [
        hour.toString().padStart(2, "0"),
        minute.toString().padStart(2, "0"),
        second.toString().padStart(2, "0"),
      ].join("");

      updateSegments(timeStr);
    }, 1000);
  },
};

export default SevenSegClock;
