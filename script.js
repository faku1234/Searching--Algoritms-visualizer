// ===== STATE =====
let array = [];
let isRunning = false;
let speed = 700;
let stepCount = 0;

let comparisons = 0;
let operations = 0;

// ===== ELEMENTS =====
const canvas = document.getElementById("arrayCanvas");
const ctx = canvas.getContext("2d");

const generateBtn = document.getElementById("generateBtn");
const searchBtn = document.getElementById("searchBtn");
const stopBtn = document.getElementById("stopBtn");
const setArrayBtn = document.getElementById("setArrayBtn");

const algoSelect = document.getElementById("algorithm");
const speedInput = document.getElementById("speed");
const sizeInput = document.getElementById("arraySize");
const targetInput = document.getElementById("searchTarget");
const arrayInput = document.getElementById("arrayInput");

const stepList = document.getElementById("stepList");
const statusBar = document.getElementById("status");
const formulaText = document.getElementById("formulaText");
const arrayNote = document.getElementById("arrayNote");

// INFO PANEL
const algoDesc = document.getElementById("algoDesc");
const complexity = document.getElementById("complexity");
const daaTech = document.getElementById("daaTech");

// ===== INIT =====
stopBtn.style.display = "none";

// ===== UTILS =====
function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function updateStats() {
    document.getElementById("comparisons").innerText = comparisons;
    document.getElementById("operations").innerText = operations;
    document.getElementById("arraySizeDisplay").innerText = array.length;
}

function resetSteps() {
    stepList.innerHTML = "";
    stepCount = 0;
    comparisons = 0;
    operations = 0;
    updateStats();
}

function addStep(text) {
    stepCount++;
    operations++;

    document.querySelectorAll(".step-item").forEach(el => {
        el.classList.remove("current");
    });

    const el = document.createElement("div");
    el.className = "step-item current";
    el.innerText = `Step ${stepCount}: ${text}`;

    stepList.appendChild(el);
    stepList.scrollTop = stepList.scrollHeight;

    updateStats();
}

// ===== DRAW =====
function draw(active = -1, found = -1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const n = array.length;
    if (n === 0) return;

    const boxWidth = Math.max(30, canvas.width / n - 10);

    ctx.font = "16px Arial";
    ctx.textAlign = "center";

    array.forEach((val, i) => {
        let x = i * (boxWidth + 10) + 5;
        let y = 200;

        ctx.fillStyle = "#fff";
        ctx.fillText(val, x + boxWidth / 2, y - 10);

        if (i === found) ctx.fillStyle = "#00ff88";
        else if (i === active) ctx.fillStyle = "#ff4d4d";
        else ctx.fillStyle = "#3498db";

        ctx.fillRect(x, y, boxWidth, 50);
    });
}

// ===== FORMULA + INFO =====
const formulaMap = {
    linear: `Linear Search:
For i = 0 to n-1:
    if arr[i] == target:
        return i
return -1`,

    binary: `Binary Search:
low = 0, high = n-1
while low <= high:
    mid = (low + high)/2
    if arr[mid] == target:
        return mid
    else if target < arr[mid]:
        high = mid - 1
    else:
        low = mid + 1`,

    jump: `Jump Search:
step = √n
jump in blocks
then linear search`
};

const algoInfo = {
    linear: {
        desc: "Linear Search checks each element sequentially.",
        complexity: "Time: O(n) | Space: O(1)",
        tech: "Brute Force"
    },
    binary: {
        desc: "Binary Search divides sorted array into halves.",
        complexity: "Time: O(log n) | Space: O(1)",
        tech: "Decrease & Conquer"
    },
    jump: {
        desc: "Jump Search jumps blocks then scans.",
        complexity: "Time: O(√n) | Space: O(1)",
        tech: "Block Search"
    }
};

function updateUI() {
    const algo = algoSelect.value;

    formulaText.textContent = formulaMap[algo];
    algoDesc.innerText = algoInfo[algo].desc;
    complexity.innerText = algoInfo[algo].complexity;
    daaTech.innerText = algoInfo[algo].tech;
}

algoSelect.addEventListener("change", updateUI);
updateUI();

// ===== ARRAY SIZE NOTE =====
sizeInput.addEventListener("input", () => {
    const size = parseInt(sizeInput.value);

    if (size > 30) {
        arrayNote.innerText = "❌ Max limit 30";
        arrayNote.style.color = "red";
    } else if (size > 20) {
        arrayNote.innerText = "⚠ High size";
        arrayNote.style.color = "orange";
    } else {
        arrayNote.innerText = "✔ Smooth";
        arrayNote.style.color = "#00ff88";
    }
});

// popup
sizeInput.addEventListener("change", () => {
    if (parseInt(sizeInput.value) > 30) {
        alert("Maximum size is 30");
        sizeInput.value = 30;
    }
});

// ===== ARRAY =====
generateBtn.onclick = () => {
    const size = parseInt(sizeInput.value);
    array = [];

    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100));
    }

    resetSteps();
    draw();
    updateStats();
};

setArrayBtn.onclick = () => {
    let values = arrayInput.value.split(",").map(v => parseInt(v.trim()));

    if (values.some(isNaN)) return alert("Invalid input");

    array = values;
    resetSteps();
    draw();
    updateStats();
};

// ===== SORT =====
async function sortAnimation() {
    addStep("Sorting...");

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (!isRunning) return;

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
            }

            draw(j);
            await sleep(speed / 2);
        }
    }

    addStep("Sorted");
}

// ===== SEARCHES =====
async function linear(target) {
    for (let i = 0; i < array.length; i++) {
        if (!isRunning) return -1;

        comparisons++;
        addStep(`Check index ${i}`);

        draw(i);
        await sleep(speed);

        if (array[i] == target) {
            draw(i, i);
            addStep("Found!");
            return i;
        }
    }
    return -1;
}

async function binary(target) {
    let l = 0, r = array.length - 1;

    while (l <= r) {
        if (!isRunning) return -1;

        let mid = Math.floor((l + r) / 2);
        comparisons++;

        addStep(`Mid = ${mid}`);
        draw(mid);
        await sleep(speed);

        if (array[mid] == target) {
            draw(mid, mid);
            addStep("Found!");
            return mid;
        }

        if (target < array[mid]) r = mid - 1;
        else l = mid + 1;
    }
    return -1;
}

async function jump(target) {
    let step = Math.floor(Math.sqrt(array.length));
    let prev = 0;

    while (array[Math.min(step, array.length) - 1] < target) {
        if (!isRunning) return -1;

        comparisons++;
        addStep(`Jump to ${step}`);
        draw(step);
        await sleep(speed);

        prev = step;
        step += Math.floor(Math.sqrt(array.length));
    }

    for (let i = prev; i < Math.min(step, array.length); i++) {
        if (!isRunning) return -1;

        comparisons++;
        addStep(`Check ${i}`);
        draw(i);
        await sleep(speed);

        if (array[i] == target) {
            draw(i, i);
            addStep("Found!");
            return i;
        }
    }
    return -1;
}

// ===== SEARCH =====
searchBtn.onclick = async () => {
    if (isRunning) return;

    let target = parseInt(targetInput.value);
    if (isNaN(target)) return alert("Enter number");

    resetSteps();
    isRunning = true;

    stopBtn.style.display = "inline-block";
    searchBtn.disabled = true;

    let algo = algoSelect.value;
    let res;

    if (algo !== "linear") await sortAnimation();

    if (algo === "linear") res = await linear(target);
    else if (algo === "binary") res = await binary(target);
    else res = await jump(target);

    if (!isRunning) return;

    isRunning = false;

    stopBtn.style.display = "none";
    searchBtn.disabled = false;

    statusBar.innerText =
        res === -1 ? "❌ Not Found" : "✅ Found at index " + res;
};

// ===== STOP =====
stopBtn.onclick = () => {
    isRunning = false;
    stopBtn.style.display = "none";
    searchBtn.disabled = false;

    statusBar.innerText = `⛔ Stopped at Step ${stepCount}`;
};