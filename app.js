let cases = JSON.parse(localStorage.getItem("cases")) || [];
let activeCase = null;

/* WINDOW */
function openWindow(id){
    const el = document.getElementById(id);
    if(el){
        el.style.display = "block";
    }
}

function closeWindow(id){
    const el = document.getElementById(id);
    if(el){
        el.style.display = "none";
    }
}
/* CLOCK */
function updateClock(){
    const el = document.getElementById("clock");
    if(!el) return;

    const now = new Date();
    el.innerText = now.toLocaleTimeString();
}

setInterval(updateClock,1000);
updateClock();

/* CASE */
function saveCase(){

    const c = {
        id:Date.now(),
        title:caseTitle.value,
        defendant:defendant.value,
        username:username.value,
        charges:charges.value,
        witnesses:witnesses.value,
        logs:[],
        evidence:[],
        verdict:""
    };

    cases.push(c);
    localStorage.setItem("cases",JSON.stringify(cases));

    alert("Case Saved");
}

/* LOAD */
function loadLatestCase(){
    activeCase = cases[cases.length-1];

    if(!activeCase) return;

    courtCaseInfo.innerHTML =
    activeCase.title + "<br>" + activeCase.defendant;
}

/* LOG */
function logAction(a){
    if(!activeCase) return;

    activeCase.logs.push(a);
    courtLog.innerHTML += "<div>"+a+"</div>";
}

/* EVIDENCE */
function addEvidence(){
    if(!activeCase) return;

    const f = evidenceUpload.files[0];
    if(!f) return;

    activeCase.evidence.push(f.name);
    evidenceList.innerHTML += "<div>"+f.name+"</div>";
}

/* AI */
function askAI(){
    aiResponse.innerText = "AI: Review case evidence.";
}

/* VERDICT */
function saveVerdict(){
    if(activeCase){
        activeCase.verdict = verdictSelect.value;
        alert("Verdict saved");
    }
}

/* REPORT */
function generateReport(){
    reportContent.value =
    JSON.stringify(activeCase,null,2);
}

/* SCREEN SWITCH */
function switchScreen(id){
    dashboard.classList.add("hidden");
    courtroom.classList.add("hidden");
    report.classList.add("hidden");

    document.getElementById(id).classList.remove("hidden");
}
/* ================= DRAGGABLE WINDOWS ================= */

let dragTarget = null;
let offsetX = 0;
let offsetY = 0;

document.addEventListener("mousedown", (e) => {
    const header = e.target.closest(".window-header");
    if(!header) return;

    dragTarget = header.parentElement;

    const rect = dragTarget.getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    dragTarget.style.position = "fixed";
});

document.addEventListener("mousemove", (e) => {
    if(!dragTarget) return;

    dragTarget.style.left = (e.clientX - offsetX) + "px";
    dragTarget.style.top = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", () => {
    dragTarget = null;
});
