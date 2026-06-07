let cases = JSON.parse(localStorage.getItem("cases")) || [];
let activeCase = null;

/* WINDOW */
function openWindow(id){
    document.getElementById(id).style.display = "block";
}

function closeWindow(id){
    document.getElementById(id).style.display = "none";
}

/* CLOCK */
setInterval(()=>{
    document.getElementById("clock").innerText =
    new Date().toLocaleTimeString();
},1000);

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
