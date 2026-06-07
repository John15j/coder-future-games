/* ==========================================
   ERLC Judicial Management System
   app.js
========================================== */

/* -----------------------------
   Global Data
----------------------------- */

let cases = JSON.parse(localStorage.getItem("erlc_cases")) || [];

let activeCase = null;

let timerSeconds = 0;
let timerInterval = null;

/* -----------------------------
   Screen Navigation
----------------------------- */

function showScreen(screenId){

    document.querySelectorAll(".screen").forEach(screen=>{
        screen.classList.remove("active");
    });

    const screen = document.getElementById(screenId);

    if(screen){
        screen.classList.add("active");
    }

}

/* -----------------------------
   Case Number Generator
----------------------------- */

function generateCaseNumber(){

    const year = new Date().getFullYear();

    const number = String(cases.length + 1)
        .padStart(4,"0");

    return `ERLC-${year}-${number}`;

}

/* -----------------------------
   Save Cases
----------------------------- */

function saveCases(){

    localStorage.setItem(
        "erlc_cases",
        JSON.stringify(cases)
    );

    updateDashboard();
    loadArchives();

}

/* -----------------------------
   Create Case
----------------------------- */

function saveCase(){

    const caseData = {

        id: generateCaseNumber(),

        title:
            document.getElementById("caseTitle").value,

        type:
            document.getElementById("caseType").value,

        courtroom:
            document.getElementById("courtroomSelect").value,

        judge:
            document.getElementById("judge").value,

        prosecutor:
            document.getElementById("prosecutor").value,

        defense:
            document.getElementById("defense").value,

        defendant:
            document.getElementById("defendant").value,

        charges:
            document.getElementById("charges").value,

        witnesses:
            document.getElementById("witnesses").value,

        notes:
            document.getElementById("courtNotes").value,

        status: "Pending",

        verdict: "",

        report: "",

        logs: [],

        created:
            new Date().toLocaleString()

    };

    cases.push(caseData);

    saveCases();

    alert(
        `Case Saved\n\n${caseData.id}`
    );

}

/* -----------------------------
   Preview Case
----------------------------- */

function previewCase(){

    const title =
        document.getElementById("caseTitle").value;

    const defendant =
        document.getElementById("defendant").value;

    const courtroom =
        document.getElementById("courtroomSelect").value;

    const charges =
        document.getElementById("charges").value;

    const preview =
        document.getElementById("previewContent");

    preview.innerHTML = `
        <h2>${title || "Untitled Case"}</h2>

        <br>

        <strong>Defendant:</strong>
        ${defendant || "N/A"}

        <br><br>

        <strong>Courtroom:</strong>
        ${courtroom}

        <br><br>

        <strong>Charges:</strong>

        <pre>${charges}</pre>
    `;

    showScreen("casePreview");

}

/* -----------------------------
   Start Court Modal
----------------------------- */

function openStartCourtModal(){

    const modal =
        document.getElementById("startCourtModal");

    const list =
        document.getElementById("caseSelectionList");

    list.innerHTML = "";

    if(cases.length === 0){

        list.innerHTML = `
            <p>No cases found.</p>
        `;

    }else{

        cases.forEach(caseItem=>{

            const btn =
                document.createElement("button");

            btn.className = "primary-btn";

            btn.style.margin = "5px";

            btn.innerText =
                `${caseItem.id} - ${caseItem.defendant}`;

            btn.onclick = ()=>{

                loadCaseForCourt(caseItem.id);

                closeStartCourtModal();

            };

            list.appendChild(btn);

        });

    }

    modal.classList.remove("hidden");

}

function closeStartCourtModal(){

    document
        .getElementById("startCourtModal")
        .classList.add("hidden");

}

/* -----------------------------
   Load Case Into Courtroom
----------------------------- */

function loadCaseForCourt(caseId){

    activeCase =
        cases.find(c=>c.id === caseId);

    if(!activeCase) return;

    document.getElementById(
        "courtCaseInfo"
    ).innerHTML = `

        <strong>Case:</strong>
        ${activeCase.id}

        <br><br>

        <strong>Title:</strong>
        ${activeCase.title}

        <br><br>

        <strong>Defendant:</strong>
        ${activeCase.defendant}

        <br><br>

        <strong>Judge:</strong>
        ${activeCase.judge}

        <br><br>

        <strong>Courtroom:</strong>
        ${activeCase.courtroom}

        <br><br>

        <strong>Status:</strong>
        ${activeCase.status}

    `;

    renderCourtLogs();

    showScreen("courtroom");

}

/* -----------------------------
   Start Court Session
----------------------------- */

function startCourtSession(){

    if(cases.length === 0){

        alert(
            "Create and save a case first."
        );

        return;

    }

    activeCase =
        cases[cases.length - 1];

    activeCase.status =
        "In Session";

    saveCases();

    loadCaseForCourt(
        activeCase.id
    );

    startTimer();

    logAction(
        "Court Session Started"
    );

}

/* -----------------------------
   Court Timer
----------------------------- */

function startTimer(){

    clearInterval(timerInterval);

    timerSeconds = 0;

    timerInterval = setInterval(()=>{

        timerSeconds++;

        const hours =
            String(
                Math.floor(timerSeconds/3600)
            ).padStart(2,"0");

        const mins =
            String(
                Math.floor((timerSeconds%3600)/60)
            ).padStart(2,"0");

        const secs =
            String(
                timerSeconds%60
            ).padStart(2,"0");

        document.getElementById(
            "sessionTimer"
        ).innerText =
            `${hours}:${mins}:${secs}`;

    },1000);

}

/* -----------------------------
   Court Logs
----------------------------- */

function logAction(action){

    if(!activeCase) return;

    const time =
        new Date().toLocaleTimeString();

    activeCase.logs.push(
        `${time} - ${action}`
    );

    saveCases();

    renderCourtLogs();

}

function renderCourtLogs(){

    const log =
        document.getElementById("courtLog");

    log.innerHTML = "";

    if(!activeCase) return;

    activeCase.logs.forEach(entry=>{

        const div =
            document.createElement("div");

        div.className = "log-entry";

        div.innerText = entry;

        log.appendChild(div);

    });

}

/* -----------------------------
   Verdict Modal
----------------------------- */

function openVerdictModal(){

    document
        .getElementById("verdictModal")
        .classList.remove("hidden");

}

function closeVerdictModal(){

    document
        .getElementById("verdictModal")
        .classList.add("hidden");

}

/* -----------------------------
   Generate Report
----------------------------- */

function generateReport(){

    if(!activeCase) return;

    const report = `

STATE OF ERLC
JUDICIAL BRANCH

Official Court Report

Case Number:
${activeCase.id}

Case Title:
${activeCase.title}

Judge:
${activeCase.judge}

Defendant:
${activeCase.defendant}

Charges:
${activeCase.charges}

Witnesses:
${activeCase.witnesses}

Court Notes:
${activeCase.notes}

Court Log:
${activeCase.logs.join("\n")}

Status:
${activeCase.status}

Generated:
${new Date().toLocaleString()}

`;

    activeCase.report = report;

    document.getElementById(
        "reportContent"
    ).value = report;

    saveCases();

    showScreen(
        "reportEditor"
    );

}

/* -----------------------------
   End Court Session
----------------------------- */

function endCourtSession(){

    if(!activeCase) return;

    clearInterval(
        timerInterval
    );

    activeCase.status =
        "Closed";

    saveCases();

    alert(
        "Court Session Closed"
    );

}

/* -----------------------------
   Archives
----------------------------- */

function loadArchives(){

    const archive =
        document.getElementById(
            "archiveList"
        );

    if(!archive) return;

    archive.innerHTML = "";

    cases.forEach(caseItem=>{

        const card =
            document.createElement("div");

        card.className =
            "archive-card";

        card.innerHTML = `

            <h3>${caseItem.id}</h3>

            <p>
            Defendant:
            ${caseItem.defendant}
            </p>

            <p>
            Status:
            ${caseItem.status}
            </p>

            <br>

            <button
            onclick="viewArchive('${caseItem.id}')">
            Open
            </button>

        `;

        archive.appendChild(card);

    });

}

function viewArchive(caseId){

    const found =
        cases.find(c=>c.id===caseId);

    if(!found) return;

    activeCase = found;

    loadCaseForCourt(
        caseId
    );

}

/* -----------------------------
   Dashboard
----------------------------- */

function updateDashboard(){

    document.getElementById(
        "activeCases"
    ).innerText =
        cases.filter(
            c=>c.status==="In Session"
        ).length;

    document.getElementById(
        "openCourtrooms"
    ).innerText = 3;

    document.getElementById(
        "guiltyCases"
    ).innerText =
        cases.filter(
            c=>c.verdict==="Guilty"
        ).length;

    document.getElementById(
        "notGuiltyCases"
    ).innerText =
        cases.filter(
            c=>c.verdict==="Not Guilty"
        ).length;

}

/* -----------------------------
   Startup
----------------------------- */

window.onload = ()=>{

    updateDashboard();

    loadArchives();

};



function saveVerdict(){

    if(!activeCase){
        alert("No active case selected");
        return;
    }

    const verdict =
        document.getElementById("verdictSelect").value;

    activeCase.verdict = verdict;

    logAction("Verdict entered: " + verdict);

    saveCases();

    closeVerdictModal();

    updateDashboard();
}
function addEvidence(){

    if(!activeCase){
        alert("No active case");
        return;
    }

    const fileInput =
        document.getElementById("evidenceUpload");

    const fileName =
        fileInput.files[0]?.name;

    if(!fileName) return;

    if(!activeCase.evidence){
        activeCase.evidence = [];
    }

    activeCase.evidence.push(fileName);

    const list =
        document.getElementById("evidenceList");

    const div =
        document.createElement("div");

    div.innerText = fileName;

    list.appendChild(div);

    logAction("Evidence added: " + fileName);

    saveCases();
}
function askAI(){

    if(!activeCase){
        alert("No active case");
        return;
    }

    const q =
        document.getElementById("aiQuestion").value;

    const response =
        document.getElementById("aiResponse");

    response.innerHTML = `
        <p><b>AI Analysis (Mock)</b></p>
        <p>Question: ${q}</p>
        <p>Status: Reviewing case data...</p>
        <p>Suggestion: Check evidence and witness consistency.</p>
    `;

    logAction("AI Query Used");
}
function openWindow(id){
    document.getElementById(id).style.display = "block";
}

function closeWindow(id){
    document.getElementById(id).style.display = "none";
}
function updateClock(){

    const now = new Date();

    document.getElementById("clock").innerText =
        now.toLocaleTimeString();

}

setInterval(updateClock, 1000);
updateClock();
