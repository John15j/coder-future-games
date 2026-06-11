/* ============================= */
/* DATA */
/* ============================= */

let cases = JSON.parse(localStorage.getItem("erlc_cases")) || [];
let selectedCase = null;

/* ============================= */
/* CLOCK */
/* ============================= */

function updateClock(){
    const clock = document.getElementById("clock");
    if(!clock) return;

    clock.innerText = new Date().toLocaleTimeString();
}

setInterval(updateClock,1000);
updateClock();

/* ============================= */
/* SCREEN CONTROL */
/* ============================= */

function hideAll(){
    document.getElementById("courtLauncher")?.classList.add("hidden");
    document.getElementById("caseSelector")?.classList.add("hidden");
    document.getElementById("courtReady")?.classList.add("hidden");
    document.getElementById("newCasePopup")?.classList.add("hidden");
    document.getElementById("allCasesPopup")?.classList.add("hidden");
    document.getElementById("courtroom")?.classList.add("hidden");
}

/* ============================= */
/* COURT LAUNCHER */
/* ============================= */

function openCourtLauncher(){
    hideAll();
    document.getElementById("courtLauncher").classList.remove("hidden");
}

function showCaseSelector(){
    hideAll();
    document.getElementById("caseSelector").classList.remove("hidden");

    const list = document.getElementById("caseList");
    list.innerHTML = "";

    if(cases.length === 0){
        list.innerHTML = "<div>No cases found</div>";
        return;
    }

    cases.forEach(c => {
        const div = document.createElement("div");
        div.innerHTML = `<b>${c.title}</b><br>${c.id}`;
        div.onclick = () => selectCase(c.id);
        list.appendChild(div);
    });
}

/* ============================= */
/* CASE SELECT */
/* ============================= */

function selectCase(id){

    selectedCase = cases.find(c => c.id === id);

    if(!selectedCase) return;

    hideAll();
    document.getElementById("courtReady").classList.remove("hidden");

    document.getElementById("selectedCaseInfo").innerHTML = `
        <b>${selectedCase.title}</b><br>
        Defendant: ${selectedCase.defendant}<br>
        Case ID: ${selectedCase.id}
    `;
}

function startEmptyCourt(){
    selectedCase = null;

    hideAll();
    document.getElementById("courtReady").classList.remove("hidden");

    document.getElementById("selectedCaseInfo").innerHTML =
        "Empty Court Session Ready";
}

/* ============================= */
/* START COURTROOM */
/* ============================= */

function startCourtSession(){

    hideAll();

    document.getElementById("courtroom").classList.remove("hidden");

    const title = document.getElementById("courtroomCaseTitle");

    if(selectedCase){
        title.innerText = selectedCase.title;

        document.getElementById("caseInfo").innerHTML = `
            <b>Case ID:</b> ${selectedCase.id}<br>
            <b>Defendant:</b> ${selectedCase.defendant}<br>
            <b>Status:</b> Active
        `;
    } else {
        title.innerText = "Empty Session";
        document.getElementById("caseInfo").innerHTML = "No case loaded.";
    }

    addLog("Court session started");
}

/* ============================= */
/* NEW CASE */
/* ============================= */

function openNewCase(){
    hideAll();
    document.getElementById("newCasePopup").classList.remove("hidden");
}

function saveCase(){

    const title = document.getElementById("caseTitle").value;
    const defendant = document.getElementById("defendant").value;

    if(!title || !defendant){
        alert("Fill all fields");
        return;
    }

    const newCase = {
        id: "CASE-" + Date.now(),
        title,
        defendant
    };

    cases.push(newCase);

    localStorage.setItem("erlc_cases", JSON.stringify(cases));

    alert("Case saved");

    hideAll();
}

/* ============================= */
/* ALL CASES */
/* ============================= */

function openAllCases(){

    hideAll();

    document.getElementById("allCasesPopup").classList.remove("hidden");

    const list = document.getElementById("allCasesList");
    list.innerHTML = "";

    cases.forEach(c => {

        const div = document.createElement("div");

        div.innerHTML = `
            <b>${c.title}</b><br>
            ${c.id}
        `;

        list.appendChild(div);
    });
}

function closeAll(){
    hideAll();
    document.getElementById("dashboard").classList.remove("hidden");
}

/* ============================= */
/* COURT LOG */
/* ============================= */

function addLog(text){

    const log = document.getElementById("courtLog");

    if(!log) return;

    const div = document.createElement("div");
    div.className = "log";

    div.innerText = `[${new Date().toLocaleTimeString()}] ${text}`;

    log.prepend(div);
}

/* ============================= */
/* JUDGE CONTROLS */
/* ============================= */

function callWitness(){ addLog("Witness called"); }
function presentEvidence(){ addLog("Evidence presented"); }
function openArguments(){ addLog("Arguments opened"); }
function openVerdict(){ addLog("Verdict initiated"); }

/* ============================= */
/* SETTINGS (PLACEHOLDER) */
/* ============================= */

function openSettings(){
    alert("Settings coming soon");
}