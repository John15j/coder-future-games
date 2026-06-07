let cases = JSON.parse(localStorage.getItem("erlc_cases")) || [];
let activeCase = null;

let timer = null;
let seconds = 0;

/* ================= WINDOW SYSTEM ================= */

function openWindow(id){
    const el = document.getElementById(id);
    if(el) el.style.display = "block";
}

function closeWindow(id){
    const el = document.getElementById(id);
    if(el) el.style.display = "none";
}

/* ================= CLOCK ================= */

function updateClock(){
    const clock = document.getElementById("clock");
    if(!clock) return;

    const now = new Date();
    clock.innerText = now.toLocaleTimeString();
}

setInterval(updateClock, 1000);
updateClock();

/* ================= SAVE SYSTEM ================= */

function saveCases(){
    localStorage.setItem("erlc_cases", JSON.stringify(cases));
    updateDashboard();
}

/* ================= CREATE CASE ================= */

function saveCase(){

    const newCase = {
        id: "ERLC-" + Date.now(),
        title: document.getElementById("caseTitle").value,
        defendant: document.getElementById("defendant").value,
        username: document.getElementById("username").value,
        charges: document.getElementById("charges").value,
        witnesses: document.getElementById("witnesses").value,
        verdict: "",
        logs: [],
        evidence: []
    };

    cases.push(newCase);
    saveCases();

    alert("Case created: " + newCase.id);

    closeWindow("createCaseWindow");
}

/* ================= LOAD CASE ================= */

function loadCase(caseId){

    activeCase = cases.find(c => c.id === caseId);
    if(!activeCase) return;

    document.getElementById("courtCaseInfo").innerHTML = `
        <b>${activeCase.title}</b><br>
        Defendant: ${activeCase.defendant}<br>
        Username: ${activeCase.username}<br>
        Status: ${activeCase.verdict || "Pending"}
    `;

    renderLogs();
    renderEvidence();
}

/* ================= COURT LOG ================= */

function logAction(action){

    if(!activeCase){
        alert("No active case loaded");
        return;
    }

    activeCase.logs.push(
        new Date().toLocaleTimeString() + " - " + action
    );

    saveCases();
    renderLogs();
}

function renderLogs(){

    const log = document.getElementById("courtLog");
    if(!log) return;

    log.innerHTML = "";

    if(!activeCase) return;

    activeCase.logs.forEach(item => {
        const div = document.createElement("div");
        div.innerText = item;
        log.appendChild(div);
    });
}

/* ================= TIMER ================= */

function startTimer(){

    clearInterval(timer);
    seconds = 0;

    timer = setInterval(() => {

        seconds++;

        const h = String(Math.floor(seconds / 3600)).padStart(2,"0");
        const m = String(Math.floor((seconds % 3600)/60)).padStart(2,"0");
        const s = String(seconds % 60).padStart(2,"0");

        const el = document.getElementById("sessionTimer");
        if(el){
            el.innerText = `${h}:${m}:${s}`;
        }

    }, 1000);
}

/* ================= EVIDENCE ================= */

function addEvidence(){

    if(!activeCase){
        alert("No active case");
        return;
    }

    const fileInput = document.getElementById("evidenceUpload");
    const file = fileInput.files[0];

    if(!file){
        alert("No file selected");
        return;
    }

    activeCase.evidence.push(file.name);

    saveCases();
    renderEvidence();

    logAction("Evidence added: " + file.name);
}

function renderEvidence(){

    const box = document.getElementById("evidenceList");
    if(!box) return;

    box.innerHTML = "";

    if(!activeCase) return;

    activeCase.evidence.forEach(e => {
        const div = document.createElement("div");
        div.innerText = e;
        box.appendChild(div);
    });
}

/* ================= VERDICT ================= */

function openVerdictModal(){
    const modal = document.getElementById("verdictModal");
    if(modal) modal.classList.remove("hidden");
}

function closeVerdictModal(){
    const modal = document.getElementById("verdictModal");
    if(modal) modal.classList.add("hidden");
}

function saveVerdict(){

    if(!activeCase) return;

    const v = document.getElementById("verdictSelect").value;
    activeCase.verdict = v;

    saveCases();

    logAction("Verdict: " + v);

    closeVerdictModal();
    updateDashboard();
}

/* ================= AI ================= */

function askAI(){

    if(!activeCase){
        alert("Load a case first");
        return;
    }

    const q = document.getElementById("aiQuestion").value;

    const out = document.getElementById("aiResponse");
    if(!out) return;

    out.innerHTML = `
        <b>AI Response</b><br><br>
        Question: ${q}<br><br>
        Suggestion: Review evidence and witness statements carefully.
    `;

    logAction("AI queried");
}

/* ================= REPORT ================= */

function generateReport(){

    if(!activeCase){
        alert("No active case");
        return;
    }

    const report = `
CASE REPORT
-----------------
ID: ${activeCase.id}
Title: ${activeCase.title}
Defendant: ${activeCase.defendant}
Username: ${activeCase.username}

Charges:
${activeCase.charges}

Witnesses:
${activeCase.witnesses}

Verdict:
${activeCase.verdict || "Pending"}

LOGS:
${activeCase.logs.join("\n")}
    `;

    document.getElementById("reportContent").value = report;
}

/* ================= PDF ================= */

function downloadPDF(){
    alert("PDF export not connected yet");
}

/* ================= DASHBOARD ================= */

function updateDashboard(){

    const active = document.getElementById("activeCases");
    const guilty = document.getElementById("guiltyCases");
    const notGuilty = document.getElementById("notGuiltyCases");

    if(active) active.innerText = cases.length;
    if(guilty) guilty.innerText = cases.filter(c => c.verdict === "Guilty").length;
    if(notGuilty) notGuilty.innerText = cases.filter(c => c.verdict === "Not Guilty").length;
}

/* ================= INIT ================= */

updateDashboard();
