const API_BASE = '';

const els = {
  refreshAll: document.getElementById('refreshAll'),
  allTableBody: document.querySelector('#allTable tbody'),
  oneTableBody: document.querySelector('#oneTable tbody'),
  messages: document.getElementById('messages'),
  // forms
  getForm: document.getElementById('getForm'),
  getName: document.getElementById('getName'),
  createForm: document.getElementById('createForm'),
  createName: document.getElementById('createName'),
  createGrade: document.getElementById('createGrade'),
  updateForm: document.getElementById('updateForm'),
  updateName: document.getElementById('updateName'),
  updateGrade: document.getElementById('updateGrade'),
  deleteForm: document.getElementById('deleteForm'),
  deleteName: document.getElementById('deleteName'),
};

function setMessage(msg, type = '') {
  els.messages.textContent = msg;
  els.messages.className = type;
}

function toRow(name, grade) {
  const tr = document.createElement('tr');
  const tdName = document.createElement('td');
  tdName.textContent = name;
  const tdGrade = document.createElement('td');
  tdGrade.textContent = typeof grade === 'number' ? grade.toFixed(2) : grade;
  tr.appendChild(tdName);
  tr.appendChild(tdGrade);
  return tr;
}

async function apiGetAll() {
  const res = await fetch(`${API_BASE}/grades`);
  if (!res.ok) throw new Error(`GET /grades failed: ${res.status}`);
  return res.json();
}

async function apiGetOne(name) {
  const res = await fetch(`${API_BASE}/grades/${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error(`GET /grades/${name} failed: ${res.status}`);
  return res.json();
}

async function apiCreate(name, grade) {
  const res = await fetch(`${API_BASE}/grades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, grade: Number(grade) }),
  });
  if (!res.ok) throw new Error(`POST /grades failed: ${res.status}`);
  return res.json();
}

async function apiUpdate(name, grade) {
  const res = await fetch(`${API_BASE}/grades/${encodeURIComponent(name)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grade: Number(grade) }),
  });
  if (!res.ok) throw new Error(`PUT /grades/${name} failed: ${res.status}`);
  return res.json();
}

async function apiDelete(name) {
  const res = await fetch(`${API_BASE}/grades/${encodeURIComponent(name)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`DELETE /grades/${name} failed: ${res.status}`);
  return res.json();
}

function renderAllTable(data) {
  els.allTableBody.innerHTML = '';
  Object.entries(data).forEach(([name, grade]) => {
    els.allTableBody.appendChild(toRow(name, grade));
  });
}

function renderOneTable(data) {
  els.oneTableBody.innerHTML = '';
  const entries = Object.entries(data);
  if (entries.length === 0) return;
  const [name, grade] = entries[0];
  els.oneTableBody.appendChild(toRow(name, grade));
}

async function refreshAll() {
  setMessage('Loading all students...');
  try {
    const data = await apiGetAll();
    renderAllTable(data);
    setMessage('Loaded all students.', 'success');
  } catch (err) {
    console.error(err);
    setMessage(`Error loading all students: ${err.message}`, 'error');
  }
}

function disableForm(form, disabled) {
  Array.from(form.elements).forEach(el => { el.disabled = disabled; });
}

els.refreshAll.addEventListener('click', refreshAll);

els.getForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = els.getName.value.trim();
  if (!name) return;
  setMessage(`Getting grade for ${name}...`);
  disableForm(els.getForm, true);
  try {
    const data = await apiGetOne(name);
    renderOneTable(data);
    setMessage(`Loaded grade for ${name}.`, 'success');
  } catch (err) {
    console.error(err);
    els.oneTableBody.innerHTML = '';
    setMessage(`Error fetching ${name}: ${err.message}`, 'error');
  } finally {
    disableForm(els.getForm, false);
  }
});

els.createForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = els.createName.value.trim();
  const grade = els.createGrade.value;
  if (!name) return;
  setMessage(`Creating ${name}...`);
  disableForm(els.createForm, true);
  try {
    const data = await apiCreate(name, grade);
    renderOneTable(data);
    await refreshAll();
    setMessage(`Created ${name}.`, 'success');
    els.createForm.reset();
  } catch (err) {
    console.error(err);
    setMessage(`Error creating ${name}: ${err.message}`, 'error');
  } finally {
    disableForm(els.createForm, false);
  }
});

els.updateForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = els.updateName.value.trim();
  const grade = els.updateGrade.value;
  if (!name) return;
  setMessage(`Updating ${name}...`);
  disableForm(els.updateForm, true);
  try {
    const data = await apiUpdate(name, grade);
    renderOneTable(data);
    await refreshAll();
    setMessage(`Updated ${name}.`, 'success');
    els.updateForm.reset();
  } catch (err) {
    console.error(err);
    setMessage(`Error updating ${name}: ${err.message}`, 'error');
  } finally {
    disableForm(els.updateForm, false);
  }
});

els.deleteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = els.deleteName.value.trim();
  if (!name) return;
  setMessage(`Deleting ${name}...`);
  disableForm(els.deleteForm, true);
  try {
    const data = await apiDelete(name);
    renderOneTable(data);
    await refreshAll();
    setMessage(`Deleted ${name}.`, 'success');
    els.deleteForm.reset();
  } catch (err) {
    console.error(err);
    setMessage(`Error deleting ${name}: ${err.message}`, 'error');
  } finally {
    disableForm(els.deleteForm, false);
  }
});

refreshAll();


