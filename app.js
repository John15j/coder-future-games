let cases = JSON.parse(localStorage.getItem("erlc_cases")) || [];
alert("v1:54");
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

    alert(
        "Court Session Started\n\n" +
        (selectedCase ?
        selectedCase.title :
        "Empty Court")
    );

    closeLauncher();
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

    cases.forEach(c => {

        const div =
        document.createElement("div");

        div.className = "case-item";

        div.innerHTML = `
            <b>${c.title}</b><br>
            ${c.id}<br>
            Status: ${c.verdict}
            <br><br>

            <button onclick="viewCase('${c.id}')">
                Open
            </button>

            <button onclick="deleteCase('${c.id}')">
                Delete
            </button>
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
