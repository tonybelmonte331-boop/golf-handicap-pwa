const STORAGE_KEY = "golfHandicapData";

// Load data from localStorage
function loadData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { golfer: "", rounds: [] };
}

// Save data
function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Handicap calculation (basic USGA style)
function calculateDifferential(score, rating, slope) {
    return ((score - rating) * 113 / slope).toFixed(1);
}

function calculateHandicap(rounds) {
    if (rounds.length < 3) return null;
    const diffs = rounds.map(r => r.diff).sort((a,b) => a-b);
    const count = Math.min(8, Math.floor(diffs.length / 2));
    const avg = diffs.slice(0,count).reduce((a,b)=>a+b,0)/count;
    return avg.toFixed(1);
}

// Update UI
function updateUI() {
    const data = loadData();
    document.getElementById("golferName").value = data.golfer || "";

    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";
    data.rounds.forEach((r, i) => {
        const li = document.createElement("li");
        li.textContent = `${i+1}: ${r.holes} holes, Score: ${r.score}, Diff: ${r.diff}`;
        historyList.appendChild(li);
    });

    const handicap = calculateHandicap(data.rounds);
    document.getElementById("handicap").textContent = handicap || "N/A";
}

// Event listeners
document.getElementById("addRoundBtn").addEventListener("click", () => {
    const golfer = document.getElementById("golferName").value || "Guest";
    const holes = parseInt(document.getElementById("holes").value);
    const score = parseFloat(document.getElementById("score").value);
    const rating = parseFloat(document.getElementById("rating").value);
    const slope = parseFloat(document.getElementById("slope").value);

    if (isNaN(score) || isNaN(rating) || isNaN(slope)) {
        alert("Please enter valid numbers for score, rating, and slope");
        return;
    }

    const diff = calculateDifferential(score, rating, slope);

    const data = loadData();
    data.golfer = golfer;
    data.rounds.push({ holes, score, rating, slope, diff });
    saveData(data);

    updateUI();
});

// Initialize UI
updateUI();
