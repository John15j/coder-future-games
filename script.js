let editor;
let currentFile = "index.html";

let files = JSON.parse(localStorage.getItem("files")) || {
  "index.html": "<h1>Hello World</h1>",
  "style.css": "body { font-family: Arial; }",
  "script.js": "console.log('hi');"
};

/* MONACO LOADER */
require.config({ paths: { vs: "https://unpkg.com/monaco-editor@0.44.0/min/vs" } });

require(["vs/editor/editor.main"], function () {

  editor = monaco.editor.create(document.getElementById("editor"), {
    value: files[currentFile],
    language: "html",
    theme: "vs-dark"
  });

  renderFiles();
  updatePreview();

  editor.onDidChangeModelContent(() => {
    files[currentFile] = editor.getValue();
    saveLocal();
    updatePreview();
  });
});

/* FILE SYSTEM */
function renderFiles() {
  const div = document.getElementById("files");
  div.innerHTML = "";

  Object.keys(files).forEach(f => {
    let el = document.createElement("div");
    el.innerText = f;
    el.onclick = () => openFile(f);
    div.appendChild(el);
  });
}

function openFile(name) {
  currentFile = name;

  let lang = "html";
  if (name.endsWith(".css")) lang = "css";
  if (name.endsWith(".js")) lang = "javascript";

  monaco.editor.setModelLanguage(editor.getModel(), lang);
  editor.setValue(files[name]);
}

/* NEW FILE */
function newFile() {
  let name = prompt("File name?");
  files[name] = "";
  saveLocal();
  renderFiles();
}

/* SAVE LOCAL */
function saveLocal() {
  localStorage.setItem("files", JSON.stringify(files));
}

/* LIVE PREVIEW */
function updatePreview() {
  const html = files["index.html"] || "";
  const css = files["style.css"] || "";
  const js = files["script.js"] || "";

  document.getElementById("preview").srcdoc = `
  <html>
    <style>${css}</style>
    <body>
      ${html}
      <script>${js}<\/script>
    </body>
  </html>
  `;
}

/* TERMINAL (simple) */
document.getElementById("terminalInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    alert("Command: " + e.target.value);
    e.target.value = "";
  }
});
