// Switch tabs (HTML / CSS / JS)
function switchTab(tab) {
  document.querySelectorAll(".code").forEach(t => t.classList.remove("active"));
  document.getElementById(tab).classList.add("active");
}

// LIVE PREVIEW (CodePen style)
function updatePreview() {
  const html = document.getElementById("html").value;
  const css = document.getElementById("css").value;
  const js = document.getElementById("js").value;

  const output = `
  <html>
    <head>
      <style>${css}</style>
    </head>
    <body>
      ${html}
      <script>
        ${js}
      <\/script>
    </body>
  </html>
  `;

  const iframe = document.getElementById("preview");
  iframe.srcdoc = output;
}

// Auto update on typing
document.querySelectorAll(".code").forEach(editor => {
  editor.addEventListener("input", updatePreview);
});

// SAVE PROJECT (localStorage)
function saveProject() {
  const project = {
    html: html.value,
    css: css.value,
    js: js.value,
    time: Date.now()
  };

  let saved = JSON.parse(localStorage.getItem("projects")) || [];
  saved.push(project);

  localStorage.setItem("projects", JSON.stringify(saved));

  alert("Project Saved!");
}

// Load empty preview at start
updatePreview();
