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

/* ================= COURT LAUNCHER ================= */

let selectedCase = null;

function openCourtLauncher(){

    hideAllScreens();
    document.getElementById("courtLauncher").classList.remove("hidden");
}

function showCaseSelector(){

    hideAllScreens();
    document.getElementById("caseSelector").classList.remove("hidden");

    const list = document.getElementById("caseList");
    list.innerHTML = "";

    cases.forEach(c => {

        const div = document.createElement("div");
        div.className = "case-item";

        div.innerHTML = `
            <b>${c.id}</b><br>
            ${c.title}
        `;

        div.onclick = () => selectCase(c.id);

        list.appendChild(div);
    });
}

function selectCase(id){

    selectedCase = cases.find(c => c.id === id);

    document.getElementById("selectedCaseInfo").innerHTML = `
        <b>${selectedCase.title}</b><br>
        Defendant: ${selectedCase.defendant}<br>
        Status: Ready
    `;

    hideAllScreens();
    document.getElementById("courtReady").classList.remove("hidden");
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

    alert("Court Session Started");

    hideAllScreens();
    document.getElementById("courtroom").classList.remove("hidden");
}

function backToLauncher(){
    openCourtLauncher();
}

function closeLauncher(){
    hideAllScreens();
    document.getElementById("dashboard").classList.remove("hidden");
}

/* hide all screens helper */
function hideAllScreens(){

    document.querySelectorAll(".screen").forEach(s => {
        s.classList.add("hidden");
    });
}

/* connect button from dashboard */
function setupCourtButton(){

    const btn = document.querySelector('[onclick="openWindow(\'courtroomWindow\')"]');

    if(btn){
        btn.onclick = openCourtLauncher;
    }
}

setupCourtButton();
