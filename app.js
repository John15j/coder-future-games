let cases = JSON.parse(localStorage.getItem("erlc_cases")) || [];
alert("new update");
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



let selectedCase = null;


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

    document.getElementById("selectedCaseInfo").innerHTML = `
        No case selected — Empty Court Session
    `;

    hideAllScreens();
    document.getElementById("courtReady").classList.remove("hidden");
}

function startCourtSession(){

    closeLauncher();

    document.getElementById("dashboard")
        .classList.add("hidden");

    document.getElementById("courtroomPage")
        .classList.remove("hidden");

    if(selectedCase){
document.getElementById("caseInformation").innerHTML = `
    <b>Case ID:</b> ${selectedCase.id}<br><br>

    <b>Title:</b><br>
    ${selectedCase.title}<br><br>

    <b>Defendant:</b><br>
    ${selectedCase.defendant}<br><br>

    <b>Username:</b><br>
    ${selectedCase.username}<br><br>

    <b>Charges:</b><br>
    ${selectedCase.charges}<br><br>

    <b>Witnesses:</b><br>
    ${selectedCase.witnesses}
`;
        document.getElementById(
            "courtroomCaseTitle"
        ).innerText =
        selectedCase.title;

        document.getElementById(
            "caseInformation"
        ).innerHTML = `
            <b>Case ID:</b> ${selectedCase.id}<br>
            <b>Defendant:</b> ${selectedCase.defendant}<br>
            <b>Status:</b> Active Hearing
        `;
    }
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

    document.getElementById(
    "courtCaseTitle"
).value = selectedCase.title || "";

document.getElementById(
    "courtDefendant"
).value = selectedCase.defendant || "";

document.getElementById(
    "courtUsername"
).value = selectedCase.username || "";

document.getElementById(
    "courtCharges"
).value = selectedCase.charges || "";

document.getElementById(
    "courtWitnesses"
).value = selectedCase.witnesses || "";
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

function addCourtLog(text){

    const log =
    document.getElementById("courtLog");

    const entry =
    document.createElement("div");

    entry.className = "feed-item";

    entry.innerHTML =
    new Date().toLocaleTimeString() +
    " • " +
    text;

    log.prepend(entry);
}
function callWitness(){
    addCourtLog("Witness called to stand");
}

function presentEvidence(){
    addCourtLog("Evidence presented");
}

function openArguments(){
    addCourtLog("Arguments opened");
}

function openVerdict(){
    addCourtLog("Verdict review started");
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
function saveCourtCase(){

    if(!selectedCase){

        alert("No active case selected.");
        return;
    }

    selectedCase.title =
        document.getElementById(
            "courtCaseTitle"
        ).value;

    selectedCase.defendant =
        document.getElementById(
            "courtDefendant"
        ).value;

    selectedCase.username =
        document.getElementById(
            "courtUsername"
        ).value;

    selectedCase.charges =
        document.getElementById(
            "courtCharges"
        ).value;

    selectedCase.witnesses =
        document.getElementById(
            "courtWitnesses"
        ).value;

    localStorage.setItem(
        "erlc_cases",
        JSON.stringify(cases)
    );

    addCourtLog(
        "Case information updated."
    );

    alert("Case saved.");
}