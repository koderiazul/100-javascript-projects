import './calendar.css';

const Calendar = {
  view: () => `
    <div id="app-calendar" class="cal-root">
      <header class="cal-header">
        <div class="cal-left">
          <button class="cal-btn" data-action="prev">◀</button>
          <button class="cal-btn" data-action="today">Today</button>
          <button class="cal-btn" data-action="next">▶</button>
        </div>
        <div class="cal-title" data-role="title"></div>
        <div class="cal-right">
          <input type="search" placeholder="Search events..." class="cal-search" data-role="search">
          <select class="cal-view-select" data-role="viewSelect">
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
            <option value="agenda">Agenda</option>
          </select>
        </div>
      </header>

      <main class="cal-body" data-role="body">
        <div class="cal-grid" data-role="grid"></div>
        <aside class="cal-side">
          <h3>Events</h3>
          <ul class="cal-events-list" data-role="eventsList"></ul>
          <button class="cal-btn" data-action="newEvent">+ New event</button>
        </aside>
      </main>

      <!-- Modal -->
      <div class="cal-modal" data-role="modal" aria-hidden="true">
        <form class="cal-form" data-role="form">
          <h3 data-role="modalTitle">New event</h3>
          <label>Title <input name="title" required></label>
          <label>Date <input name="date" type="date" required></label>
          <label>Start <input name="start" type="time"></label>
          <label>End <input name="end" type="time"></label>
          <label>Recurring
            <select name="recurring">
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
          <label>Color <input name="color" type="color" value="#2b8cff"></label>
          <textarea name="notes" placeholder="Notes (optional)"></textarea>

          <div class="cal-form-actions">
            <button type="submit" class="cal-btn">Save</button>
            <button type="button" class="cal-btn cal-btn-muted" data-action="cancel">Cancel</button>
            <button type="button" class="cal-btn cal-btn-danger" data-action="delete" style="display:none">Delete</button>
          </div>
        </form>
      </div>

      <!-- Tiny tooltip for a quick event preview -->
      <div class="cal-tooltip" data-role="tooltip"></div>
    </div>
  `,

  mount: (root = document.getElementById('app-calendar')) => {
    if (!root) root = document.querySelector('#app-calendar');

    const state = {
      view: 'month',
      date: new Date(),
      events: [],
      editingEventId: null,
    };

    // ---- Persistent storage helpers ----
    const STORAGE_KEY = 'advanced_calendar_events_v1';
    function loadEvents() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        state.events = raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.error('Failed to load events', e);
        state.events = [];
      }
    }
    function saveEvents() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.events));
    }

    // Simple ID generator
    const uid = () => Math.random().toString(36).slice(2, 9);

    // ---- DOM refs ----
    const titleEl = root.querySelector('[data-role="title"]');
    const gridEl = root.querySelector('[data-role="grid"]');
    const eventsListEl = root.querySelector('[data-role="eventsList"]');
    const modalEl = root.querySelector('[data-role="modal"]');
    const tooltipEl = root.querySelector('[data-role="tooltip"]');
    const searchInput = root.querySelector('[data-role="search"]');
    const viewSelect = root.querySelector('[data-role="viewSelect"]');
    const form = root.querySelector('[data-role="form"]');

    // ---- Rendering helpers ----
    function formatMonthYear(date) {
      return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    }

    function startOfWeek(d) {
      const day = new Date(d);
      const diff = day.getDate() - day.getDay();
      day.setDate(diff);
      day.setHours(0,0,0,0);
      return day;
    }

    function daysInMonth(year, month) {
      return new Date(year, month + 1, 0).getDate();
    }

    function sameDay(d1, d2) {
      return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    }

    function renderTitle() {
      titleEl.textContent = formatMonthYear(state.date);
    }

    function renderGrid() {
      gridEl.innerHTML = '';
      if (state.view === 'month') renderMonthGrid();
      else if (state.view === 'week') renderWeekGrid();
      else if (state.view === 'day') renderDayView();
      else renderAgendaView();
    }

    function getEventsForDay(date) {
      // include recurring events (basic handling)
      const res = [];
      state.events.forEach(ev => {
        const evDate = new Date(ev.date);
        if (ev.recurring === 'none') {
          if (sameDay(evDate, date)) res.push(ev);
        } else if (ev.recurring === 'daily') {
          if (new Date(ev.date) <= date) res.push(ev);
        } else if (ev.recurring === 'weekly') {
          // check weekday match and date after start
          if (new Date(ev.date) <= date && evDate.getDay() === date.getDay()) res.push(ev);
        } else if (ev.recurring === 'monthly') {
          if (new Date(ev.date) <= date && evDate.getDate() === date.getDate()) res.push(ev);
        }
      });
      return res;
    }

    function renderMonthGrid() {
      const year = state.date.getFullYear();
      const month = state.date.getMonth();
      const first = new Date(year, month, 1);
      const startDay = first.getDay();
      const total = daysInMonth(year, month);

      // Weekdays header
      const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      const headerRow = document.createElement('div');
      headerRow.className = 'cal-row cal-weekdays';
      weekdays.forEach(w => {
        const d = document.createElement('div'); d.className = 'cal-cell cal-weekday'; d.textContent = w; headerRow.appendChild(d);
      });
      gridEl.appendChild(headerRow);

      // Fill dates
      let row;
      let dayCount = 1 - startDay; // could be negative -> previous month's tail
      while (dayCount <= total) {
        row = document.createElement('div');
        row.className = 'cal-row';
        for (let i=0;i<7;i++){
          const cell = document.createElement('div');
          cell.className = 'cal-cell cal-day';
          const cellDate = new Date(year, month, dayCount);
          cell.dataset.date = cellDate.toISOString();

          const num = document.createElement('div');
          num.className = 'cal-day-number';
          num.textContent = cellDate.getDate();
          if (cellDate.getMonth() !== month) num.classList.add('cal-day-muted');
          if (sameDay(cellDate, new Date())) num.classList.add('cal-day-today');

          cell.appendChild(num);

          // events preview
          const evs = getEventsForDay(cellDate);
          const evPreview = document.createElement('div'); evPreview.className = 'cal-day-events';
          evs.slice(0,3).forEach(ev => {
            const b = document.createElement('div'); b.className = 'cal-event-pill'; b.textContent = ev.title; b.title = ev.title; b.style.background = ev.color || '#2b8cff';
            b.dataset.eventId = ev.id;
            evPreview.appendChild(b);
          });
          if (evs.length > 3) {
            const more = document.createElement('div'); more.className = 'cal-more'; more.textContent = `+${evs.length - 3}`; evPreview.appendChild(more);
          }

          cell.appendChild(evPreview);

          // click handler to open day or create event
          cell.addEventListener('click', (e) => {
            // if clicking on an event pill
            const pill = e.target.closest('.cal-event-pill');
            if (pill) { openEditEvent(pill.dataset.eventId); e.stopPropagation(); return; }
            openNewEvent(cellDate);
          });

          // hover preview tooltip
          cell.addEventListener('mouseenter', (e) => {
            const items = getEventsForDay(cellDate);
            if (!items.length) { tooltipEl.style.opacity = '0'; return; }
            tooltipEl.innerHTML = items.map(it => `<div class=\"tt-item\"><b>${escapeHtml(it.title)}</b><div class=\"tt-time\">${it.start || ''} ${it.end?'- '+it.end:''}</div></div>`).join('');
            tooltipEl.style.opacity = '1';
            const rect = cell.getBoundingClientRect();
            tooltipEl.style.left = (rect.right + 8) + 'px';
            tooltipEl.style.top = (rect.top) + 'px';
          });
          cell.addEventListener('mouseleave', () => { tooltipEl.style.opacity = '0'; });

          row.appendChild(cell);
          dayCount++;
        }
        gridEl.appendChild(row);
      }
    }

    function renderWeekGrid() {
      // Simple horizontal week view with days and events listed
      const focused = startOfWeek(state.date);
      const header = document.createElement('div'); header.className = 'cal-row cal-weekdays';
      for (let i=0;i<7;i++){
        const d = new Date(focused); d.setDate(focused.getDate()+i);
        const col = document.createElement('div'); col.className = 'cal-col-week';
        const head = document.createElement('div'); head.className='cal-col-head'; head.textContent = d.toLocaleDateString(undefined,{weekday:'short', month:'short', day:'numeric'});
        col.appendChild(head);

        const body = document.createElement('div'); body.className='cal-col-body';
        const evs = getEventsForDay(d);
        evs.forEach(ev => {
          const it = document.createElement('div'); it.className='cal-event-block'; it.textContent = `${ev.start?ev.start+' - ':''}${ev.title}`; it.style.borderLeft = `4px solid ${ev.color||'#2b8cff'}`; it.dataset.eventId = ev.id;
          it.addEventListener('click',()=> openEditEvent(ev.id));
          body.appendChild(it);
        });
        col.appendChild(body);
        header.appendChild(col);
      }
      gridEl.appendChild(header);
    }

    function renderDayView() {
      const day = new Date(state.date);
      const head = document.createElement('div'); head.className='cal-dayview-head'; head.textContent = day.toLocaleDateString();
      gridEl.appendChild(head);
      const body = document.createElement('div'); body.className='cal-dayview-body';
      const evs = getEventsForDay(day);
      evs.forEach(ev=>{
        const it = document.createElement('div'); it.className='cal-event-row'; it.innerHTML = `<div class=\"ev-time\">${ev.start||''}${ev.end?' - '+ev.end:''}</div><div class=\"ev-body\"><b>${escapeHtml(ev.title)}</b><div class=\"ev-notes\">${escapeHtml(ev.notes||'')}</div></div>`;
        it.dataset.eventId = ev.id; it.addEventListener('click',()=>openEditEvent(ev.id));
        body.appendChild(it);
      });
      gridEl.appendChild(body);
    }

    function renderAgendaView() {
      const start = new Date(state.date); start.setDate(start.getDate()-30);
      const end = new Date(state.date); end.setDate(end.getDate()+30);
      const list = document.createElement('div'); list.className='cal-agenda';
      const days = [];
      for (let d=new Date(start); d<=end; d.setDate(d.getDate()+1)) days.push(new Date(d));
      days.forEach(d => {
        const evs = getEventsForDay(d);
        if (!evs.length) return;
        evs.forEach(ev => {
          const row = document.createElement('div'); row.className='cal-agenda-row'; row.innerHTML = `<div class=\"ag-date\">${d.toLocaleDateString()}</div><div class=\"ag-title\"><b>${escapeHtml(ev.title)}</b> ${ev.start?'('+ev.start+(ev.end?'-'+ev.end:'') +')':''}</div>`;
          row.addEventListener('click',()=>openEditEvent(ev.id));
          list.appendChild(row);
        });
      });
      gridEl.appendChild(list);
    }

    // ---- Event UI ----
    function rebuildEventsList() {
      eventsListEl.innerHTML = '';
      const filtered = applySearch(state.events);
      filtered.sort((a,b)=> new Date(a.date) - new Date(b.date));
      filtered.forEach(ev => {
        const li = document.createElement('li'); li.className='ev-item';
        li.innerHTML = `<div class=\"ev-left\"><div class=\"ev-color\" style=\"background:${ev.color}\"></div></div><div class=\"ev-main\"><div class=\"ev-title\">${escapeHtml(ev.title)}</div><div class=\"ev-meta\">${new Date(ev.date).toLocaleDateString()} ${ev.start?ev.start:''}</div></div>`;
        li.addEventListener('click',()=>openEditEvent(ev.id));
        eventsListEl.appendChild(li);
      });
    }

    function applySearch(list) {
      const q = (searchInput.value || '').trim().toLowerCase();
      if (!q) return list.slice();
      return list.filter(ev => (ev.title||'').toLowerCase().includes(q) || (ev.notes||'').toLowerCase().includes(q));
    }

    // ---- Modal functions ----
    function openNewEvent(date) {
      state.editingEventId = null;
      form.reset();
      modalEl.setAttribute('aria-hidden','false');
      modalEl.style.display = 'block';
      modalEl.querySelector('[name="date"]').value = toInputDate(date);
      modalEl.querySelector('[name="title"]').focus();
      modalEl.querySelector('[data-action="delete"]').style.display = 'none';
      modalEl.querySelector('[data-role="modalTitle"]').textContent = 'New event';
    }

    function openEditEvent(id) {
      const ev = state.events.find(x=>x.id===id);
      if (!ev) return;
      state.editingEventId = id;
      modalEl.setAttribute('aria-hidden','false');
      modalEl.style.display = 'block';
      modalEl.querySelector('[data-role="modalTitle"]').textContent = 'Edit event';
      modalEl.querySelector('[name="title"]').value = ev.title;
      modalEl.querySelector('[name="date"]').value = toInputDate(new Date(ev.date));
      modalEl.querySelector('[name="start"]').value = ev.start||'';
      modalEl.querySelector('[name="end"]').value = ev.end||'';
      modalEl.querySelector('[name="recurring"]').value = ev.recurring || 'none';
      modalEl.querySelector('[name="color"]').value = ev.color || '#2b8cff';
      modalEl.querySelector('[name="notes"]').value = ev.notes || '';
      modalEl.querySelector('[data-action="delete"]').style.display = 'inline-block';
    }

    function closeModal() {
      modalEl.setAttribute('aria-hidden','true');
      modalEl.style.display = 'none';
      state.editingEventId = null;
    }

    // ---- Utils ----
    function toInputDate(d){
      const dt = new Date(d);
      const yyyy = dt.getFullYear();
      const mm = String(dt.getMonth()+1).padStart(2,'0');
      const dd = String(dt.getDate()).padStart(2,'0');
      return `${yyyy}-${mm}-${dd}`;
    }

    function escapeHtml(s=''){
      return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }

    // ---- Form submit handlers ----
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      const obj = {
        title: fd.get('title'),
        date: fd.get('date'),
        start: fd.get('start') || null,
        end: fd.get('end') || null,
        recurring: fd.get('recurring') || 'none',
        color: fd.get('color') || '#2b8cff',
        notes: fd.get('notes') || ''
      };
      if (state.editingEventId) {
        // update
        const idx = state.events.findIndex(x=>x.id===state.editingEventId);
        if (idx>-1) state.events[idx] = {...state.events[idx], ...obj};
      } else {
        state.events.push({...obj, id: uid()});
      }
      saveEvents();
      closeModal();
      refresh();
    });

    modalEl.querySelector('[data-action="cancel"]').addEventListener('click',()=>closeModal());
    modalEl.querySelector('[data-action="delete"]').addEventListener('click',()=>{
      if (!state.editingEventId) return;
      state.events = state.events.filter(x=>x.id!==state.editingEventId);
      saveEvents();
      closeModal();
      refresh();
    });

    // ---- Actions & Controls ----
    root.addEventListener('click', (e) => {
      const a = e.target.closest('[data-action]');
      if (!a) return;
      const act = a.dataset.action;
      if (act === 'prev') { if (state.view==='month') state.date.setMonth(state.date.getMonth()-1); else state.date.setDate(state.date.getDate()-7); }
      else if (act === 'next') { if (state.view==='month') state.date.setMonth(state.date.getMonth()+1); else state.date.setDate(state.date.getDate()+7); }
      else if (act === 'today') { state.date = new Date(); }
      else if (act === 'newEvent') { openNewEvent(state.date); }
      refresh();
    });

    viewSelect.addEventListener('change', (e)=>{ state.view = e.target.value; refresh(); });

    searchInput.addEventListener('input', () => { rebuildEventsList(); renderGrid(); });

    // keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { state.date.setDate(state.date.getDate()-1); refresh(); }
      if (e.key === 'ArrowRight') { state.date.setDate(state.date.getDate()+1); refresh(); }
      if (e.key === 't') { state.date = new Date(); refresh(); }
      if (e.key === 'n') { openNewEvent(state.date); }
    });

    // ---- Search Helpers ----
    function refresh(){ renderTitle(); renderGrid(); rebuildEventsList(); }

    // initial load
    loadEvents();
    renderTitle();
    renderGrid();
    rebuildEventsList();

    // expose some API
    return {
      getState: () => state,
      addEvent: (ev) => { state.events.push({...ev, id: uid()}); saveEvents(); refresh(); },
      updateEvent: (id, patch) => { const i = state.events.findIndex(e=>e.id===id); if (i>-1) { state.events[i] = {...state.events[i], ...patch}; saveEvents(); refresh(); } },
      deleteEvent: (id) => { state.events = state.events.filter(e=>e.id!==id); saveEvents(); refresh(); }
    };
  }
};

export default Calendar;
