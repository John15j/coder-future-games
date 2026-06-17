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

    const badge = document.getElementById("courtStatusBadge");
    const panel = document.getElementById("courtDisplayPanel");
    const pulse = document.getElementById("pulseCircle");

    if(!badge) return;

    badge.textContent = s.label;
    badge.className = "status-badge " + s.css;

    panel.className = "court-display";
    pulse.className = "pulse-circle";

    if(statusKey === "ACTIVE"){
        pulse.classList.add("pulse-active");
    } else if(statusKey === "RECESSED"){
        panel.classList.add("status-recessed");
        pulse.classList.add("pulse-recessed");
    } else if(statusKey === "ADJOURNED"){
        panel.classList.add("status-adjourned");
        pulse.classList.add("pulse-adjourned");
    } else if(statusKey === "CLOSED"){
        panel.classList.add("status-closed");
        pulse.classList.add("pulse-closed");
    }

    document.querySelectorAll(".status-pill").forEach(p => {
        p.classList.remove("selected");
    });

    const pillMap = {
        ACTIVE: ".active-pill",
        RECESSED: ".recess-pill",
        ADJOURNED: ".adjourned-pill",
        CLOSED: ".closed-pill"
    };

    const selectedPill = document.querySelector(pillMap[statusKey]);
    if(selectedPill) selectedPill.classList.add("selected");

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
        confirm("Are you sure you want to end court? This will open the session summary.");

    if(!confirmEnd) return;

    setCourtStatus("ADJOURNED");

    setTimeout(() => {
        showCourtCompletion();
    }, 1000);
}

function showCourtCompletion(){

    document.getElementById("courtroomPage")
        .classList.add("hidden");

    document.getElementById("courtCompletion")
        .classList.remove("hidden");

    const c = selectedCase;

    document.getElementById("compCaseId").textContent =
        c ? c.id : temporaryCaseId || "—";

    document.getElementById("compVerdict").textContent =
        c ? (c.verdict || "No Verdict") : "No Verdict";

    document.getElementById("compDefendant").textContent =
        c ? (c.defendant || "—") : "—";

    document.getElementById("compUsername").textContent =
        c ? (c.username || "—") : "—";

    document.getElementById("compJailTime").textContent =
        c ? (c.jailTime || "None") : "None";

    document.getElementById("compFine").textContent =
        c ? (c.fineAmount || "None") : "None";

    document.getElementById("compNotes").textContent =
        c ? (c.judgeNotes || "No notes recorded.") : "No notes recorded.";

    const chargeText = charges.length > 0
        ? charges.map(ch => "• " + ch.text + (ch.classification ? " (" + ch.classification + ")" : "")).join("\n")
        : (c ? c.charges : "No charges recorded.");

    document.getElementById("compCharges").textContent = chargeText;

    const orderText = orders.length > 0
        ? orders.map(o => "• " + o.text).join("\n")
        : "No court orders issued.";

    document.getElementById("compOrders").textContent = orderText;

    const logEl = document.getElementById("compLog");
    logEl.innerHTML = "";

    const logItems = document.querySelectorAll("#courtLog .feed-item");

    if(logItems.length === 0){
        logEl.innerHTML = "<div class='empty-state'>No log entries.</div>";
    } else {
        logItems.forEach(item => {
            const div = document.createElement("div");
            div.className = "comp-log-entry";
            div.textContent = item.textContent;
            logEl.appendChild(div);
        });
    }

    const verdictEl = document.getElementById("compVerdict");
    if(c && c.verdict === "GUILTY"){
        verdictEl.style.color = "#fca5a5";
    } else if(c && c.verdict === "NOT GUILTY"){
        verdictEl.style.color = "#86efac";
    }
}

function returnToDashboard(){

    document.getElementById("courtCompletion")
        .classList.add("hidden");

    document.getElementById("dashboard")
        .classList.remove("hidden");

    currentStatus = "ACTIVE";
    charges = [];
    orders = [];
    selectedCase = null;
    temporaryCaseId = null;

    document.getElementById("courtLog").innerHTML = "";
    document.getElementById("chargeList").innerHTML = "<div class='empty-state'>No charges added.</div>";
    document.getElementById("orderList").innerHTML = "<div class='empty-state'>No orders issued.</div>";
}

function downloadPDF(){

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const c = selectedCase;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    function addLine(text, size, bold, color){
        doc.setFontSize(size || 12);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        if(color){
            doc.setTextColor(color[0], color[1], color[2]);
        } else {
            doc.setTextColor(0, 0, 0);
        }
        const lines = doc.splitTextToSize(text, pageWidth - 40);
        doc.text(lines, 20, y);
        y += (lines.length * (size || 12) * 0.4) + 4;
        if(y > 270){
            doc.addPage();
            y = 20;
        }
    }

    function addDivider(){
        doc.setDrawColor(200, 200, 200);
        doc.line(20, y, pageWidth - 20, y);
        y += 6;
    }

    function addLabel(text){
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(100, 100, 100);
        doc.text(text.toUpperCase(), 20, y);
        y += 5;
    }

    /* HEADER */
    doc.setFillColor(17, 24, 39);
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("GREENVILLE ROLEPLAY COURT SYSTEM", pageWidth / 2, 18, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text("Official Court Record — Confidential", pageWidth / 2, 28, { align: "center" });

    doc.setFontSize(9);
    doc.text("Generated: " + new Date().toLocaleString(), pageWidth / 2, 36, { align: "center" });

    y = 52;

    /* CASE INFO */
    addLabel("Case Information");
    addDivider();

    addLabel("Case ID");
    addLine(c ? c.id : temporaryCaseId || "—", 13, true);

    addLabel("Case Title");
    addLine(c ? (c.title || "—") : "—", 12);

    addLabel("Defendant");
    addLine(c ? (c.defendant || "—") : "—", 12);

    addLabel("Username");
    addLine(c ? (c.username || "—") : "—", 12);

    y += 4;

    /* VERDICT */
    addLabel("Verdict");
    addDivider();

    const verdict = c ? (c.verdict || "No Verdict") : "No Verdict";
    const verdictColor = verdict === "GUILTY" ? [220, 38, 38] : verdict === "NOT GUILTY" ? [22, 163, 74] : [0,0,0];
    addLine(verdict, 16, true, verdictColor);

    addLabel("Jail Time");
    addLine(c ? (c.jailTime || "None") : "None", 12);

    addLabel("Fine Amount");
    addLine(c ? (c.fineAmount || "None") : "None", 12);

    addLabel("Judge Notes");
    addLine(c ? (c.judgeNotes || "None") : "None", 12);

    y += 4;

    /* CHARGES */
    addLabel("Charges");
    addDivider();

    if(charges.length > 0){
        charges.forEach(ch => {
            addLine("• " + ch.text + (ch.classification ? " — " + ch.classification : ""), 11);
        });
    } else {
        addLine(c ? (c.charges || "No charges recorded.") : "No charges recorded.", 11);
    }

    y += 4;

    /* COURT ORDERS */
    addLabel("Court Orders Issued");
    addDivider();

    if(orders.length > 0){
        orders.forEach(o => {
            addLine("• " + o.text + " (" + o.time + ")", 11);
        });
    } else {
        addLine("No court orders issued.", 11);
    }

    y += 4;

    /* COURT LOG */
    addLabel("Court Session Log");
    addDivider();

    const logItems = document.querySelectorAll("#courtLog .feed-item");

    if(logItems.length > 0){
        logItems.forEach(item => {
            addLine(item.textContent.trim(), 10);
        });
    } else {
        addLine("No log entries.", 10);
    }

    y += 8;

    /* FOOTER */
    addDivider();
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("This document is an official record of the Greenville Roleplay Court System.", pageWidth / 2, y, { align: "center" });
    y += 5;
    doc.text("Presiding Judge: Judge Andrade — Court Operations Center", pageWidth / 2, y, { align: "center" });

    const filename = "GRCS-" + (c ? c.id : "session") + "-report.pdf";
    doc.save(filename);

    addCourtLog("PDF report downloaded");
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
/* CHARGE MANAGER */
/* ================================================= */

let charges = [];
let orders = [];

function addCharge(){

    const input = document.getElementById("chargeInput");
    const value = input.value.trim();

    if(!value) return;

    charges.push({
        text: value,
        status: "pending"
    });

    input.value = "";
    renderCharges();
    addCourtLog("Charge added: " + value);
}

function toggleCharge(index){

    if(charges[index].status === "pending"){
        charges[index].status = "proven";
    } else if(charges[index].status === "proven"){
        charges[index].status = "unproven";
    } else {
        charges[index].status = "pending";
    }

    renderCharges();
    addCourtLog("Charge updated: " + charges[index].text + " — " + charges[index].status.toUpperCase());
}

function removeCharge(index){
    const text = charges[index].text;
    charges.splice(index, 1);
    renderCharges();
    addCourtLog("Charge removed: " + text);
}

function renderCharges(){

    const list = document.getElementById("chargeList");

    if(charges.length === 0){
        list.innerHTML = "<div class='empty-state'>No charges added.</div>";
        return;
    }

    list.innerHTML = "";

    charges.forEach((c, i) => {

        const div = document.createElement("div");
        div.className = "charge-item status-" + c.status;
      div.innerHTML = `
            <span class="charge-text">${c.text}</span>
            ${c.classification ? `<span class="charge-class">${c.classification}</span>` : ""}
            <div class="charge-actions-row">
                <span class="charge-status-badge ${c.status}">${c.status.toUpperCase()}</span>
                <button onclick="toggleCharge(${i})">Toggle</button>
                <button onclick="aiValidateCharge(${i})">🤖 Validate</button>
                <button onclick="removeCharge(${i})">✕</button>
            </div>
            ${c.aiNote ? `<div class="charge-ai-note">${c.aiNote}</div>` : ""}
        `;

        list.appendChild(div);
    });
}

/* ================================================= */
/* COURT ORDER MANAGER */
/* ================================================= */

function addOrder(){

    const input = document.getElementById("orderInput");
    const value = input.value.trim();

    if(!value) return;

    orders.push({
        text: value,
        time: new Date().toLocaleTimeString()
    });

    input.value = "";
    renderOrders();
    addCourtLog("Court order issued: " + value);
}

function removeOrder(index){
    const text = orders[index].text;
    orders.splice(index, 1);
    renderOrders();
    addCourtLog("Court order removed: " + text);
}

function renderOrders(){

    const list = document.getElementById("orderList");

    if(orders.length === 0){
        list.innerHTML = "<div class='empty-state'>No orders issued.</div>";
        return;
    }

    list.innerHTML = "";

    orders.forEach((o, i) => {

        const div = document.createElement("div");
        div.className = "order-item";
        div.innerHTML = `
            <div class="order-text">${o.text}</div>
            <div class="order-meta">
                <span class="log-time">${o.time}</span>
                <button onclick="removeOrder(${i})">✕</button>
            </div>
        `;

        list.appendChild(div);
    });
}

/* ================================================= */
/* AI ASSISTANT POPUP */
/* ================================================= */

let aiMinimized = false;

function openAIWindow(){

    document.getElementById("aiPopup")
        .classList.remove("hidden");

    aiMinimized = false;

    document.getElementById("aiPopupBody")
        .style.display = "flex";
}

function closeAIWindow(){

    document.getElementById("aiPopup")
        .classList.add("hidden");
}

function minimizeAI(){

    aiMinimized = !aiMinimized;

    const body = document.getElementById("aiPopupBody");
    const btn = document.getElementById("minimizeBtn");

    if(aiMinimized){
        body.style.display = "none";
        btn.textContent = "▢";
    } else {
        body.style.display = "flex";
        btn.textContent = "—";
    }
}

/* DRAG */

const popup = document.getElementById("aiPopup");
const header = document.getElementById("aiPopupHeader");

let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

header.addEventListener("mousedown", e => {
    isDragging = true;
    dragOffsetX = e.clientX - popup.offsetLeft;
    dragOffsetY = e.clientY - popup.offsetTop;
});

document.addEventListener("mousemove", e => {
    if(!isDragging) return;
    popup.style.left = (e.clientX - dragOffsetX) + "px";
    popup.style.top  = (e.clientY - dragOffsetY) + "px";
    popup.style.right = "auto";
    popup.style.bottom = "auto";
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

/* CHAT */

let aiChatHistory = [];

async function sendAIMessage(){

    const input = document.getElementById("aiChatInput");
    const message = input.value.trim();

    if(!message) return;

    input.value = "";

    appendAIMessage("You", message, "user");

    aiChatHistory.push({
        role: "user",
        content: message
    });

    appendAIMessage("AI", "Thinking...", "ai thinking");

    const caseContext = selectedCase ? `
Current case context:
- Case Title: ${selectedCase.title}
- Defendant: ${selectedCase.defendant}
- Username: ${selectedCase.username}
- Charges: ${selectedCase.charges}
- Witnesses: ${selectedCase.witnesses}
- Verdict: ${selectedCase.verdict}
    `.trim() : "No case currently loaded.";

    try {

        const response = await fetch("https://muddy-cherry-4b6f.andradejouee23.workers.dev", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
                model: "claude-sonnet-4-6",
                max_tokens: 1000,
                messages: [
                    {
                        role: "system",
                        content: `You are a court AI assistant for the Greenville Roleplay Court System (GRCS), a Roblox roleplay game based in Greenville, Wisconsin.

You assist judges during live court hearings. Follow these rules:
- Use real Wisconsin state law as the basis for all legal guidance and sentencing
- Keep all responses short and simple — 2 to 4 sentences max
- Never explain what you are or mention Roblox
- Address the judge formally as "Your Honor" when appropriate
- When asked for sentencing, base it on Wisconsin statutes but convert jail time to minutes for roleplay (example: 1 year = 60 minutes)
- If no case is loaded just give general Wisconsin court guidance

${caseContext}`
                    },
                    ...aiChatHistory
                ]
            })
        });

        const data = await response.json();

        if(data.error){
            removeThinking();
            appendAIMessage("AI", "API Error: " + JSON.stringify(data.error), "ai error");
            return;
        }

        if(!data.choices || !data.choices[0]){
            removeThinking();
            appendAIMessage("AI", "API Error: " + JSON.stringify(data), "ai error");
            return;
        }

        const reply = data.choices[0].message.content;

        removeThinking();
        appendAIMessage("AI", reply, "ai");

        aiChatHistory.push({
            role: "assistant",
            content: reply
        });

   } catch(err) {

        removeThinking();
        appendAIMessage("AI", "Error: " + err.message, "ai error");
    }
}

function appendAIMessage(sender, text, type){

    const log = document.getElementById("aiChatLog");
    const div = document.createElement("div");
    div.className = "ai-message " + type;

    div.innerHTML = `
        <span class="ai-sender">${sender}</span>
        <span class="ai-text">${text}</span>
    `;

    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
}

function removeThinking(){

    const thinking = document.querySelector(".ai-message.thinking");
    if(thinking) thinking.remove();
}
/* ================================================= */
/* AI CHARGE SUGGESTIONS */
/* ================================================= */

async function aiSuggestCharges(){

    if(!selectedCase && charges.length === 0){
        alert("Please fill in the case details or add some information first.");
        return;
    }

    const btn = document.querySelector(".ai-suggest-btn");

    const caseInfo = selectedCase ? `
Case Title: ${selectedCase.title}
Defendant: ${selectedCase.defendant}
Known info: ${selectedCase.charges}
Witnesses: ${selectedCase.witnesses}
    ` : `Current charges entered: ${charges.map(c => c.text).join(", ")}`;

    addCourtLog("AI charge suggestion requested");

    try {

        const response = await fetch("https://muddy-cherry-4b6f.andradejouee23.workers.dev", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `You are a Wisconsin court charge advisor for the Greenville Roleplay Court System.
Based on the case info, suggest 2-4 appropriate Wisconsin criminal charges.
Respond ONLY with a JSON array like this and nothing else:
[{"charge":"Charge name","classification":"Felony/Misdemeanor/Citation","statute":"Wis. Stat. § XXX"}]`
                    },
                    {
                        role: "user",
                        content: caseInfo
                    }
                ],
                max_tokens: 500
            })
        });

        const data = await response.json();
        const text = data.choices[0].message.content;

        const clean = text.replace(/```json|```/g, "").trim();
        const suggestions = JSON.parse(clean);

        suggestions.forEach(s => {
            charges.push({
                text: s.charge,
                status: "pending",
                classification: s.classification + " — " + s.statute,
                aiNote: null
            });
        });

        renderCharges();
        addCourtLog("AI suggested " + suggestions.length + " charges");

    } catch(err) {
        alert("AI suggestion failed. Try again.");
        addCourtLog("AI charge suggestion failed");
    }
}

/* ================================================= */
/* AI VALIDATE CHARGE */
/* ================================================= */

async function aiValidateCharge(index){

    const charge = charges[index];

    if(!charge) return;

    addCourtLog("AI validating charge: " + charge.text);

    try {

        const response = await fetch("https://muddy-cherry-4b6f.andradejouee23.workers.dev", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `You are a Wisconsin criminal law expert for the Greenville Roleplay Court System.
Validate the given charge under Wisconsin law.
Respond ONLY with a JSON object like this and nothing else:
{"valid":true,"classification":"Felony/Misdemeanor/Citation","statute":"Wis. Stat. § XXX","note":"One sentence explanation"}`
                    },
                    {
                        role: "user",
                        content: "Validate this charge: " + charge.text
                    }
                ],
                max_tokens: 200
            })
        });

        const data = await response.json();
        const text = data.choices[0].message.content;

        const clean = text.replace(/```json|```/g, "").trim();
        const result = JSON.parse(clean);

        charges[index].classification = result.classification + " — " + result.statute;
        charges[index].aiNote = result.note;

        renderCharges();
        addCourtLog("Charge validated: " + charge.text + " — " + result.classification);

    } catch(err) {
        addCourtLog("AI validation failed for: " + charge.text);
    }
}

/* ================================================= */
/* AI GENERATE COURT ORDER */
/* ================================================= */

async function aiGenerateOrder(){

    if(!selectedCase){
        alert("No case loaded. Save the case first.");
        return;
    }

    addCourtLog("AI court order generation requested");

    const chargeList = charges.map(c => c.text).join(", ") || selectedCase.charges;
    const verdict = selectedCase.verdict || "Pending";
    const jailTime = selectedCase.jailTime || "N/A";
    const fine = selectedCase.fineAmount || "N/A";

    try {

        const response = await fetch("https://muddy-cherry-4b6f.andradejouee23.workers.dev", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `You are a Wisconsin court clerk for the Greenville Roleplay Court System.
Generate a formal court order based on the case details.
Keep it under 3 sentences. Be formal and professional.
Start with "BY ORDER OF THE COURT:"`
                    },
                    {
                        role: "user",
                        content: `
Defendant: ${selectedCase.defendant}
Charges: ${chargeList}
Verdict: ${verdict}
Jail Time: ${jailTime}
Fine: ${fine}
                        `
                    }
                ],
                max_tokens: 300
            })
        });

        const data = await response.json();
        const order = data.choices[0].message.content;

        orders.push({
            text: order,
            time: new Date().toLocaleTimeString()
        });

        renderOrders();
        addCourtLog("AI court order generated and issued");

    } catch(err) {
        alert("AI order generation failed. Try again.");
        addCourtLog("AI order generation failed");
    }
}