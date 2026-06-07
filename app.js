const startCourtBtn =
document.getElementById("startCourtBtn");

const launcher =
document.getElementById("courtLauncher");

const dashboard =
document.querySelector(".dashboard-container");

const closeLauncher =
document.getElementById("closeLauncher");

/* CLOCK */

function updateClock(){

    const clock =
    document.getElementById("clock");

    if(clock){

        clock.innerText =
        new Date().toLocaleTimeString();
    }
}

setInterval(updateClock,1000);
updateClock();

/* START COURT */

startCourtBtn.addEventListener("click",()=>{

    dashboard.style.display="none";

    launcher.classList.add("active");
});

/* BACK */

closeLauncher.addEventListener("click",()=>{

    launcher.classList.remove("active");

    dashboard.style.display="flex";
});
