let cases = JSON.parse(localStorage.getItem("erlc_cases")) || [];
alert("new logo and name ");
let selectedCase = null;

let temporaryCaseId = null;
/* ================================================= */
/* ERLC JUDICIAL SYSTEM */
/* PHASE 1 */
/* ================================================= */

/* CLOCK */

function updateClock(){

    const clock =
    document.getElementById("clock");

    if(!clock) return;

    clock.innerText =
    new Date().toLocaleTimeString();
}

setInterval(updateClock,1000);

updateClock();






/* hide all screens helper */
function hideAllScreens(){

    const screens = document.querySelectorAll(".screen");

    screens.forEach(screen => {
        screen.classList.add("hidden");
    });
}

/* ================= COURT LAUNCHER ================= */



function openCourtLauncher(){

    document
    .getElementById("courtLauncher")
    .classList.remove("hidden");
}

function showCaseSelector(){

    document.getElementById("courtLauncher")
        .classList.add("hidden");

    document.getElementById("caseSelector")
        .classList.remove("hidden");

    const list =
    document.getElementById("caseList");

    list.innerHTML = "";

    if(cases.length === 0){

        list.innerHTML = `
            <div class="case-item">
                No cases found.
                Create a case first.
            </div>
        `;

        return;
    }

    cases.forEach(c => {

        const div =
        document.createElement("div");

        div.className = "case-item";

        div.innerHTML = `
            <b>${c.title}</b><br>
            ${c.id}<br>
            Status: ${c.verdict}
        `;

        div.onclick = () => {
            selectCase(c.id);
        };

        list.appendChild(div);
    });
}


function selectCase(id){

    selectedCase =
    cases.find(c => c.id === id);

    if(!selectedCase) return;

    document.getElementById("caseSelector")
        .classList.add("hidden");

    document.getElementById("courtReady")
        .classList.remove("hidden");

    document.getElementById("selectedCaseInfo")
        .innerHTML = `
        <h3>${selectedCase.title}</h3>
        <p>
            Defendant:
            ${selectedCase.defendant}
        </p>

        <p>
            Status:
            Ready For Hearing
        </p>

        <p>
            Case ID:
            ${selectedCase.id}
        </p>
    `;
}

function startEmptyCourt(){

    selectedCase = null;

    const year = new Date().getFullYear();

    temporaryCaseId =
        "GRCS-" +
        year +
        "-" +
        String(cases.length + 1).padStart(3, "0");

    document.getElementById("selectedCaseInfo").innerHTML = `
        <h3>Empty Court Session</h3>
        <p>Case Number: ${temporaryCaseId}</p>
    `;

    hideAllScreens();

    document.getElementById("courtReady")
        .classList.remove("hidden");
}


function backToLauncher(){

    document.getElementById("caseSelector")
        .classList.add("hidden");

    document.getElementById("courtReady")
        .classList.add("hidden");

    document.getElementById("courtLauncher")
        .classList.remove("hidden");
}

function closeLauncher(){

    alert("Close clicked");

    const launcher =
    document.getElementById("courtLauncher");

    const selector =
    document.getElementById("caseSelector");

    const ready =
    document.getElementById("courtReady");

    if(launcher) launcher.classList.add("hidden");
    if(selector) selector.classList.add("hidden");
    if(ready) ready.classList.add("hidden");

    if(selectedCase){

    document.getElementById("courtCaseTitle").value =
        selectedCase.title || "";

    document.getElementById("courtDefendant").value =
        selectedCase.defendant || "";

    document.getElementById("courtUsername").value =
        selectedCase.username || "";

    document.getElementById("courtCharges").value =
        selectedCase.charges || "";

    document.getElementById("courtWitnesses").value =
        selectedCase.witnesses || "";
    }
}


/* connect button from dashboard */
function setupCourtButton(){

    const btn = document.querySelector('[onclick="openWindow(\'courtroomWindow\')"]');

    if(btn){
        btn.onclick = openCourtLauncher;
    }
}

setupCourtButton();

function openNewCase(){

    hideAllScreens();

    const popup = document.getElementById("newCasePopup");

    if(!popup){
        alert("ERROR: newCasePopup not found in HTML");
        return;
    }

    popup.classList.remove("hidden");
}

function closeNewCase(){
    document.getElementById("newCasePopup").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
}
function saveNewCase(){

    const title =
        document.getElementById("caseTitle").value;

    const defendant =
        document.getElementById("defendant").value;

    if(title.trim() === "" || defendant.trim() === ""){
        alert("Please enter a Case Title and Defendant Name.");
        return;
    }

    const newCase = {

        id: "ERLC-" + Date.now(),

        title: title,

        defendant: defendant,

        username:
            document.getElementById("username").value,

        charges:
            document.getElementById("charges").value,

        witnesses:
            document.getElementById("witnesses").value,

        verdict: "Pending",

        logs: [],

        evidence: []
    };

    cases.push(newCase);

    localStorage.setItem(
        "erlc_cases",
        JSON.stringify(cases)
    );

    alert(
        "Case Created Successfully\n\nCase ID: " +
        newCase.id
    );

    closeNewCase();
}
function openAllCases(){

    const popup =
    document.getElementById("allCasesPopup");

    const list =
    document.getElementById("allCasesList");

    const count =
    document.getElementById("caseCount");

    list.innerHTML = "";

    count.innerText =
    "Total Cases: " + cases.length;

    if(cases.length === 0){

        list.innerHTML = `
            <div class="case-item">
                No cases found.
            </div>
        `;

        popup.classList.remove("hidden");
        return;
    }

    cases.forEach(c => {

        const div =
        document.createElement("div");

        div.className = "case-item";

        div.innerHTML = `
            <h3>${c.title}</h3>

            <p><b>Case ID:</b> ${c.id}</p>

            <p><b>Defendant:</b> ${c.defendant}</p>

            <p><b>Status:</b> ${c.verdict}</p>

            <div class="case-actions">
<button onclick="viewCase('${c.id}')">
    Open
</button>

<button onclick="editCase('${c.id}')">
    Edit
</button>

<button onclick="loadCaseToCourt('${c.id}')">
    Start Court
</button>

<button onclick="deleteCase('${c.id}')">
    Delete
</button>
            </div>
        `;

        list.appendChild(div);
    });

    popup.classList.remove("hidden");
}

function closeAllCases(){

    document
    .getElementById("allCasesPopup")
    .classList.add("hidden");
}
function viewCase(id){

    const c =
    cases.find(x => x.id === id);

    if(!c) return;

    alert(
        "Case: " + c.title +
        "\nDefendant: " + c.defendant +
        "\nCharges: " + c.charges
    );
}

function deleteCase(id){

    const confirmDelete =
    confirm("Delete this case?");

    if(!confirmDelete) return;

    cases =
    cases.filter(c => c.id !== id);

    localStorage.setItem(
        "erlc_cases",
        JSON.stringify(cases)
    );

    openAllCases();
}

/* ================================================= */
/* STATUS SYSTEM */
/* ================================================= */

const STATUSES = {
    ACTIVE:    { label: "ACTIVE HEARING",  css: "hearing"  },
    RECESSED:  { label: "COURT RECESSED",  css: "recessed" },
    ADJOURNED: { label: "COURT ADJOURNED", css: "adjourned"},
    CLOSED:    { label: "CASE CLOSED",     css: "closed"   }
};

let currentStatus = "ACTIVE";

function setCourtStatus(statusKey){

    currentStatus = statusKey;

    const s = STATUSES[statusKey];

    const badge =
        document.getElementById("courtStatusBadge");

    if(!badge) return;

    badge.textContent = s.label;

    badge.className = "status-badge " + s.css;

    addCourtLog("Status changed: " + s.label);
}

/* ================================================= */
/* COURT LOG */
/* ================================================= */

function addCourtLog(text){

    const log =
        document.getElementById("courtLog");

    if(!log) return;

    const entry =
        document.createElement("div");

    entry.className = "feed-item";

    entry.innerHTML =
        "<span class='log-time'>" +
        new Date().toLocaleTimeString() +
        "</span> • " + text;

    log.prepend(entry);
}

/* ================================================= */
/* JUDGE CONSOLE BUTTONS */
/* ================================================= */

function callWitness(){
    addCourtLog("Witness called to the stand");
}

function uploadEvidence(){
    addCourtLog("Evidence submitted to the record");
}

function openArguments(){
    addCourtLog("Arguments opened");
}

function aiSummary(){
    addCourtLog("AI Summary requested");
}

function generateTranscript(){
    addCourtLog("Transcript generation requested");
}

function recessCourt(){

    if(currentStatus !== "ACTIVE"){
        alert("Court is not currently in session.");
        return;
    }

    setCourtStatus("RECESSED");
}

function endCourt(){

    const confirmEnd =
        confirm("Are you sure you want to end court? This will close the session.");

    if(!confirmEnd) return;

    setCourtStatus("ADJOURNED");

    setTimeout(() => {

        document.getElementById("courtroomPage")
            .classList.add("hidden");

        document.getElementById("dashboard")
            .classList.remove("hidden");

        currentStatus = "ACTIVE";

    }, 2000);
}
function saveCourtCase(){

    if(!selectedCase){

        const newCase = {
            id: temporaryCaseId,
            title: document.getElementById("courtCaseTitle").value,
            defendant: document.getElementById("courtDefendant").value,
            username: document.getElementById("courtUsername").value,
            charges: document.getElementById("courtCharges").value,
            witnesses: document.getElementById("courtWitnesses").value,
            verdict: "Pending",
            logs: [],
            evidence: []
        };

        cases.push(newCase);
        selectedCase = newCase;

        localStorage.setItem("erlc_cases", JSON.stringify(cases));

        alert("Case Created\n\nCase ID: " + newCase.id);

    } else {

        selectedCase.title =
            document.getElementById("courtCaseTitle").value;

        selectedCase.defendant =
            document.getElementById("courtDefendant").value;

        selectedCase.username =
            document.getElementById("courtUsername").value;

        selectedCase.charges =
            document.getElementById("courtCharges").value;

        selectedCase.witnesses =
            document.getElementById("courtWitnesses").value;

        localStorage.setItem("erlc_cases", JSON.stringify(cases));
    }

    updateViewMode();

    document.getElementById("caseEditMode")
        .classList.add("hidden");

    document.getElementById("caseViewMode")
        .classList.remove("hidden");

    addCourtLog("Case file saved");
}
function viewCase(id){

    const c =
    cases.find(x => x.id === id);

    if(!c) return;

    alert(
        "Case Title: " + c.title +
        "\n\nDefendant: " + c.defendant +
        "\n\nCharges: " + c.charges +
        "\n\nWitnesses: " + c.witnesses +
        "\n\nStatus: " + c.verdict
    );
}

function loadCaseToCourt(id){

    selectedCase =
    cases.find(x => x.id === id);

    if(!selectedCase) return;

    closeAllCases();

    document.getElementById(
        "selectedCaseInfo"
    ).innerHTML = `
        <h3>${selectedCase.title}</h3>

        <p>
            Defendant:
            ${selectedCase.defendant}
        </p>

        <p>
            Ready For Court Session
        </p>
    `;

    document
    .getElementById("courtReady")
    .classList.remove("hidden");
}
function filterCases(){

    const search =
    document.getElementById("caseSearch")
    .value
    .toLowerCase();

    const items =
    document.querySelectorAll(".case-item");

    items.forEach(item => {

        if(
            item.innerText
            .toLowerCase()
            .includes(search)
        ){
            item.style.display = "block";
        }
        else{
            item.style.display = "none";
        }

    });
}
function editCase(id){

    const c =
    cases.find(x => x.id === id);

    if(!c) return;

    const newTitle =
    prompt(
        "Edit Case Title",
        c.title
    );

    if(!newTitle) return;

    c.title = newTitle;

    localStorage.setItem(
        "erlc_cases",
        JSON.stringify(cases)
    );

    openAllCases();
}
/* ================================================= */
/* CASE FILE VIEW / EDIT MODE */
/* ================================================= */

function enterEditMode(){

    document.getElementById("caseViewMode")
        .classList.add("hidden");

    document.getElementById("caseEditMode")
        .classList.remove("hidden");

    addCourtLog("Case file opened for editing");
}

function cancelEdit(){

    document.getElementById("caseEditMode")
        .classList.add("hidden");

    document.getElementById("caseViewMode")
        .classList.remove("hidden");
}

function updateViewMode(){

    document.getElementById("viewCaseTitle").textContent =
        document.getElementById("courtCaseTitle").value || "—";

    document.getElementById("viewDefendant").textContent =
        document.getElementById("courtDefendant").value || "—";

    document.getElementById("viewUsername").textContent =
        document.getElementById("courtUsername").value || "—";

    document.getElementById("viewCharges").textContent =
        document.getElementById("courtCharges").value || "—";

    document.getElementById("viewWitnesses").textContent =
        document.getElementById("courtWitnesses").value || "—";
}

function startCourtSession(){

    currentStatus = "ACTIVE";

    closeLauncher();

    document.getElementById("dashboard")
        .classList.add("hidden");

    document.getElementById("courtroomPage")
        .classList.remove("hidden");

    const caseIdDisplay = document.getElementById("recordCaseId");

    if(selectedCase){

        caseIdDisplay.innerText = selectedCase.id;

        document.getElementById("courtCaseTitle").value =
            selectedCase.title || "";

        document.getElementById("courtDefendant").value =
            selectedCase.defendant || "";

        document.getElementById("courtUsername").value =
            selectedCase.username || "";

        document.getElementById("courtCharges").value =
            selectedCase.charges || "";

        document.getElementById("courtWitnesses").value =
            selectedCase.witnesses || "";

        updateViewMode();

        document.getElementById("caseEditMode")
            .classList.add("hidden");

        document.getElementById("caseViewMode")
            .classList.remove("hidden");

    } else {

        caseIdDisplay.innerText = temporaryCaseId || "NO CASE";

        document.getElementById("caseEditMode")
            .classList.remove("hidden");

        document.getElementById("caseViewMode")
            .classList.add("hidden");
    }
}
/* ================================================= */
/* VERDICT SYSTEM */
/* ================================================= */

function setVerdict(verdict){

    if(!selectedCase){
        alert("No case loaded. Save the case first.");
        return;
    }

    const confirmVerdict = confirm(
        "Set verdict to " + verdict + "?\n\nThis will be saved to the case record."
    );

    if(!confirmVerdict) return;

    selectedCase.verdict = verdict;

    const jailTime =
        document.getElementById("verdictJailTime").value;

    const fineAmount =
        document.getElementById("verdictFine").value;

    const judgeNotes =
        document.getElementById("verdictNotes").value;

    selectedCase.jailTime = jailTime;
    selectedCase.fineAmount = fineAmount;
    selectedCase.judgeNotes = judgeNotes;

    localStorage.setItem("erlc_cases", JSON.stringify(cases));

    addCourtLog("Verdict entered: " + verdict);

    if(jailTime) addCourtLog("Jail Time: " + jailTime);
    if(fineAmount) addCourtLog("Fine: $" + fineAmount);
    if(judgeNotes) addCourtLog("Judge Notes recorded");

    setCourtStatus("CLOSED");

    const display =
        document.getElementById("verdictDisplay");

    display.textContent = verdict;

    display.className =
        verdict === "GUILTY"
        ? "verdict-result guilty-result"
        : "verdict-result not-guilty-result";

    display.classList.remove("hidden");
}

/* ================================================= */
/* AI SENTENCING ASSISTANT */
/* ================================================= */

async function analyzeCase(){

    if(!selectedCase){
        alert("No case loaded. Save the case first.");
        return;
    }

    const output =
        document.getElementById("aiAssistantOutput");

    output.innerHTML =
        "<span style='color:#94a3b8'>Analyzing case...</span>";

    addCourtLog("AI analysis requested");

    const prompt = `
You are a strict Roblox roleplay court judge assistant for the Greenville Roleplay Court System.

Analyze this case and provide a sentencing recommendation.

CASE TITLE: ${selectedCase.title}
DEFENDANT: ${selectedCase.defendant}
USERNAME: ${selectedCase.username}
CHARGES: ${selectedCase.charges}
WITNESSES: ${selectedCase.witnesses}

Respond in this exact format and nothing else:
VERDICT: [GUILTY or NOT GUILTY]
JAIL TIME: [amount in minutes, or NONE]
FINE: [dollar amount, or NONE]
REASONING: [1-2 sentences explaining the recommendation]
    `.trim();

    try {

        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "claude-sonnet-4-6",
                max_tokens: 1000,
                messages: [
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();

        const text = data.content[0].text;

        const lines = {};

        text.split("\n").forEach(line => {
            const parts = line.split(": ");
            if(parts.length >= 2){
                lines[parts[0].trim()] = parts.slice(1).join(": ").trim();
            }
        });

        document.getElementById("aiSuggestedVerdict").textContent =
            lines["VERDICT"] || "—";

        document.getElementById("aiSuggestedJail").textContent =
            lines["JAIL TIME"] || "—";

        document.getElementById("aiSuggestedFine").textContent =
            lines["FINE"] || "—";

        output.innerHTML =
            "<span style='color:#94a3b8;font-size:13px'>" +
            (lines["REASONING"] || "Analysis complete.") +
            "</span>";

        document.getElementById("aiRecommendation")
            .classList.remove("hidden");

        addCourtLog("AI analysis complete");

    } catch(err) {

        output.innerHTML =
            "<span style='color:#f87171'>AI analysis failed. Check connection.</span>";

        addCourtLog("AI analysis failed");
    }
}

function applyRecommendation(){

    const verdict =
        document.getElementById("aiSuggestedVerdict").textContent;

    const jail =
        document.getElementById("aiSuggestedJail").textContent;

    const fine =
        document.getElementById("aiSuggestedFine").textContent;

    if(verdict === "—"){
        alert("Run Analyze Case first.");
        return;
    }

    document.getElementById("verdictJailTime").value =
        jail === "NONE" ? "" : jail;

    document.getElementById("verdictFine").value =
        fine === "NONE" ? "" : fine;

    addCourtLog("AI recommendation applied to verdict fields");
}