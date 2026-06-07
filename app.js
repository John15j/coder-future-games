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
    const now = new Date();
    document.getElementById("clock").innerText =
        now.toLocaleTimeString();
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
        evidence: [],
        status: "Pending"
    };

    cases.push(newCase);
    saveCases();

    alert("Case Saved: " + newCase.id);
}

/* ================= LOAD CASE INTO COURT ================= */

function loadCase(caseId){

    activeCase = cases.find(c => c.id === caseId);

    if(!activeCase) return;

    document.getElementById("courtCaseInfo").innerHTML = `
        <b>${activeCase.title}</b><br>
        Defendant: ${activeCase.defendant}<br>
        Username: ${activeCase.username}<br>
        Status: ${activeCase.status}
    `;

    renderLogs();
    renderEvidence();
}

/* ================= COURT LOG ================= */

function logAction(action){

    if(!activeCase) return;

    activeCase.logs.push(
        new Date().toLocaleTimeString() + " - " + action
    );

    saveCases();
    renderLogs();
}

function renderLogs(){

    const log = document.getElementById("courtLog");
    log.innerHTML = "";

    if(!activeCase) return;

    activeCase.logs.forEach(l => {
        const div = document.createElement("div");
        div.className = "log-entry";
        div.innerText = l;
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

        document.getElementById("sessionTimer").innerText =
            `${h}:${m}:${s}`;

    }, 1000);
}

/* ================= EVIDENCE ================= */

function addEvidence(){

    if(!activeCase) return;

    const file = document.getElementById("evidenceUpload").files[0];

    if(!file) return;

    activeCase.evidence.push(file.name);

    saveCases();
    renderEvidence();

    logAction("Evidence Added: " + file.name);
}

function renderEvidence(){

    const box = document.getElementById("evidenceList");
    box.innerHTML = "";

    if(!activeCase) return;

    activeCase.evidence.forEach(e => {
        const div = document.createElement("div");
        div.innerText = e;
        box.appendChild(div);
    });
}

/* ================= VERDICT ================= */

function saveVerdict(){

    if(!activeCase) return;

    const v = document.getElementById("verdictSelect").value;

    activeCase.verdict = v;

    logAction("Verdict: " + v);

    saveCases();

    closeVerdictModal();
    updateDashboard();
}

function openVerdictModal(){
    document.getElementById("verdictModal").classList.remove("hidden");
}

function closeVerdictModal(){
    document.getElementById("verdictModal").classList.add("hidden");
}

/* ================= AI (BASIC MOCK) ================= */

function askAI(){

    if(!activeCase) return;

    const q = document.getElementById("aiQuestion").value;

    document.getElementById("aiResponse").innerHTML = `
        <b>AI Response</b><br><br>
        Question: ${q}<br><br>
        Suggestion: Review evidence and witness statements.
    `;

    logAction("AI Asked");
}

/* ================= REPORT ================= */

function generateReport(){

    if(!activeCase) return;

    const report = `
CASE REPORT

ID: ${activeCase.id}
Title: ${activeCase.title}
Defendant: ${activeCase.defendant}

Charges:
${activeCase.charges}

Witnesses:
${activeCase.witnesses}

Verdict: ${activeCase.verdict}

Logs:
${activeCase.logs.join("\n")}
    `;

    document.getElementById("reportContent").value = report;

}

/* ================= PDF ================= */

function downloadPDF(){
    alert("PDF export coming soon");
}

/* ================= DASHBOARD ================= */

function updateDashboard(){

    document.getElementById("activeCases").innerText =
        cases.length;

    document.getElementById("guiltyCases").innerText =
        cases.filter(c => c.verdict === "Guilty").length;

    document.getElementById("notGuiltyCases").innerText =
        cases.filter(c => c.verdict === "Not Guilty").length;

}

/* ================= INIT ================= */

updateDashboard();
