const CSV_PATH = 'seats.csv';

const searchInput = document.getElementById('searchInput');
const resultsEl = document.getElementById('results');
const statusEl = document.getElementById('status');

const tablemateInput = document.getElementById('tablemateInput');
const tablemateResultsEl = document.getElementById('tablemateResults');
const tablemateStatusEl = document.getElementById('tablemateStatus');

const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

let guests = [];

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

  return lines.slice(1).filter(line => line.trim() !== '').map(line => {
    const cells = line.split(',').map(c => c.trim());
    const row = {};
    headers.forEach((header, i) => {
      row[header] = cells[i] ?? '';
    });
    return row;
  });
}

function render(list) {
  resultsEl.innerHTML = '';

  if (list.length === 0) {
    statusEl.textContent = searchInput.value.trim()
      ? '查無此賓客，請確認姓名拼寫或詢問接待人員。'
      : '';
    return;
  }

  statusEl.textContent = '';
  list.forEach(guest => {
    const item = document.createElement('div');
    item.className = 'result-item';
    item.innerHTML = `
      <span class="result-name">${guest.name}</span>
      <span class="result-seat">${guest.table}</span>
    `;
    resultsEl.appendChild(item);
  });
}

function renderTablemates(matches) {
  tablemateResultsEl.innerHTML = '';

  if (matches.length === 0) {
    tablemateStatusEl.textContent = tablemateInput.value.trim()
      ? '查無此賓客，請確認姓名拼寫或詢問接待人員。'
      : '';
    return;
  }

  tablemateStatusEl.textContent = '';

  matches.forEach(guest => {
    const tablemates = guests
      .filter(g => g.table === guest.table)
      .sort((a, b) => a.name.localeCompare(b.name));

    const group = document.createElement('div');
    group.className = 'table-group';
    group.innerHTML = `<p class="table-group-title">您與其他同桌貴賓：</p>`;

    tablemates.forEach(mate => {
      const item = document.createElement('div');
      const isSelf = mate === guest;
      item.className = 'result-item' + (isSelf ? ' self' : '');
      item.innerHTML = `
        <span class="result-name">${mate.name}${isSelf ? '（您）' : ''}</span>
        <span class="result-seat">${mate.seat}${guest.table}</span>
      `;
      group.appendChild(item);
    });

    tablemateResultsEl.appendChild(group);
  });
}

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    render([]);
    return;
  }
  const matches = guests.filter(g => g.name.toLowerCase().includes(query));
  render(matches);
});

tablemateInput.addEventListener('input', () => {
  const query = tablemateInput.value.trim().toLowerCase();
  if (!query) {
    renderTablemates([]);
    return;
  }
  const matches = guests.filter(g => g.name.toLowerCase().includes(query));
  renderTablemates(matches);
});

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

fetch(CSV_PATH)
  .then(res => {
    if (!res.ok) throw new Error('Failed to load seat data');
    return res.text();
  })
  .then(text => {
    guests = parseCSV(text);
  })
  .catch(err => {
    statusEl.textContent = '無法載入座位資料，請稍後再試。';
    tablemateStatusEl.textContent = '無法載入座位資料，請稍後再試。';
    console.error(err);
  });
