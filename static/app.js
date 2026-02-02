const STORAGE_KEY = "golfHandicapData";

const defaultData = {
  golfers: [],
  rounds: [],
  activeGolferId: null
};

function loadData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData;
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function calculateDifferential(score, rating, slope) {
  return Math.round(((score - rating) * 113 / slope) * 10) / 10;
}

function calculateHandicap(diffs) {
  if (diffs.length === 0) return null;

  diffs.sort((a, b) => a - b);
  let used = 1;
  if (diffs.length >= 20) used = 8;
  else if (diffs.length >= 15) used = 6;
  else if (diffs.length >= 10) used = 4;
  else if (diffs.length >= 5) used = 2;

  const avg = diffs.slice(0, used).reduce((a, b) => a + b, 0) / used;
  return Math.round(avg * 0.96 * 10) / 10;
}

function populateGolfers() {
  const data = loadData();
  const select = document.getElementById("golferSelect");
  if (!select) return;

  select.innerHTML = "";
  data.golfers.forEach(g => {
    const o = document.createElement("option");
    o.value = g.id;
    o.textContent = g.name;
    select.appendChild(o);
  });

  select.value = data.activeGolferId;
  select.onchange = () => {
    data.activeGolferId = Number(select.value);
    saveData(data);
    updateHandicap();
  };
}

function addGolfer() {
  const input = document.getElementById("newGolferName");
  if (!input.value) return;

  const data = loadData();
  const golfer = { id: Date.now(), name: input.value };
  data.golfers.push(golfer);
  data.activeGolferId = golfer.id;
  saveData(data);
  location.reload();
}

function addRound() {
  const data = loadData();
  if (!data.activeGolferId) return alert("Select a golfer first");

  const score = Number(document.getElementById("score").value);
  const rating = Number(document.getElementById("rating").value);
  const slope = Number(document.getElementById("slope").value);
  const holes = Number(document.getElementById("holes").value);

  const diff = calculateDifferential(score, rating, slope);

  data.rounds.push({
    id: Date.now(),
    golferId: data.activeGolferId,
    score, rating, slope, holes,
    date: new Date().toISOString().slice(0,10),
    differential: diff
  });

  saveData(data);
  location.reload();
}

function updateHandicap() {
  const data = loadData();
  const diffs = data.rounds
    .filter(r => r.golferId === data.activeGolferId)
    .map(r => r.differential);

  const h = calculateHandicap(diffs);
  document.getElementById("handicapDisplay").textContent =
    h === null ? "Not enough rounds" : h;
}

function loadHistory() {
  const list = document.getElementById("roundList");
  if (!list) return;

  const data = loadData();
  data.rounds.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.date} | Score ${r.score} | Diff ${r.differential}`;
    const del = document.createElement("button");
    del.textContent = "Delete";
    del.onclick = () => {
      data.rounds = data.rounds.filter(x => x.id !== r.id);
      saveData(data);
      location.reload();
    };
    li.appendChild(del);
    list.appendChild(li);
  });
}

populateGolfers();
updateHandicap();
loadHistory();
