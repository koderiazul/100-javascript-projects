import './multiplication-table-generator.css';

const MultiplicationTableGenerator = {
  view: () => /*html*/ `
    <div id="table-generator-container">
      <h1>Multiplication Table Generator</h1>

      <div id="input-section">
        <label>From: <input type="number" id="from-value" min="1" value="2" /></label>
        <label>To: <input type="number" id="to-value" min="1" value="100" /></label>
        <label>Per Page: <input type="number" id="per-page" min="1" value="20" /></label>
        <button id="generate-btn">Generate</button>
      </div>

      <div id="progress"></div>
      <div id="pagination-controls"></div>
      <div id="table-output" class="table-output"></div>
    </div>
  `,

  mount: () => {
    const fromInput = document.getElementById('from-value');
    const toInput = document.getElementById('to-value');
    const perPageInput = document.getElementById('per-page');
    const generateBtn = document.getElementById('generate-btn');
    const output = document.getElementById('table-output');
    const pagination = document.getElementById('pagination-controls');
    const progress = document.getElementById('progress');

    let from = 0, to = 0, perPage = 20, totalPages = 0, currentPage = 1;
    let cancelRender = false;

    generateBtn.addEventListener('click', () => {
      cancelRender = true; // stop any current render
      setTimeout(() => { cancelRender = false; startGeneration(); }, 50);
    });

    function startGeneration() {
      from = parseInt(fromInput.value);
      to = parseInt(toInput.value);
      perPage = parseInt(perPageInput.value);

      if (isNaN(from) || isNaN(to) || from <= 0 || to <= 0 || to < from) {
        alert('Please enter valid numbers.');
        return;
      }

      totalPages = Math.ceil((to - from + 1) / perPage);
      currentPage = 1;
      progress.textContent = `Total ${totalPages} pages available`;
      renderPagination();
      renderPage(currentPage);
    }

    function renderPagination() {
      pagination.innerHTML = '';

      const prevBtn = document.createElement('button');
      prevBtn.textContent = 'Prev';
      prevBtn.disabled = currentPage === 1;
      prevBtn.onclick = () => changePage(currentPage - 1);

      const nextBtn = document.createElement('button');
      nextBtn.textContent = 'Next';
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.onclick = () => changePage(currentPage + 1);

      const pageInfo = document.createElement('span');
      pageInfo.textContent = ` Page ${currentPage} of ${totalPages} `;

      pagination.append(prevBtn, pageInfo, nextBtn);
    }

    function changePage(newPage) {
      if (newPage < 1 || newPage > totalPages) return;
      cancelRender = true;
      setTimeout(() => {
        cancelRender = false;
        currentPage = newPage;
        renderPagination();
        renderPage(currentPage);
      }, 50);
    }

    async function renderPage(page) {
      output.innerHTML = '';
      const start = from + (page - 1) * perPage;
      const end = Math.min(start + perPage - 1, to);
      progress.textContent = `Rendering tables ${start} to ${end}...`;

      const CHUNK_SIZE = 50; // render 50 tables asynchronously per frame
      let n = start;

      while (n <= end) {
        if (cancelRender) return; // stop rendering if user switches page

        const fragment = document.createDocumentFragment();
        const limit = Math.min(n + CHUNK_SIZE - 1, end);

        for (; n <= limit; n++) {
          const section = document.createElement('div');
          section.className = 'table-section';
          section.innerHTML = `<h3>${n} Times Table</h3>`;
          let rows = '';
          for (let i = 1; i <= 10; i++) {
            rows += `<div class="table-row">${n} × ${i} = ${n * i}</div>`;
          }
          section.innerHTML += rows;
          fragment.appendChild(section);
        }

        output.appendChild(fragment);
        progress.textContent = `Showing ${start}-${Math.min(n - 1, end)} of ${to - from + 1}`;
        await new Promise(r => requestAnimationFrame(r)); // yield to keep UI responsive
      }

      progress.textContent = `✅ Completed page ${page}`;
    }
  },
};

export default MultiplicationTableGenerator;
