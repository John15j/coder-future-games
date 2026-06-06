let editor;
let currentFile = "index.html";

// FILE SYSTEM (stored in memory + localStorage)
let files = JSON.parse(localStorage.getItem("files")) || {
  "index.html": "<h1>Hello VS Code Clone</h1>",
  "style.css": "body { font-family: Arial; }",
  "script.js": "console.log('Hello world');"
};

// LOAD MONACO (VS CODE ENGINE)
require.config({
  paths: { vs: "https://unpkg.com/monaco-editor@0.44.0/min/vs" }
});

require(["vs/editor/editor.main"], function () {

  editor = monaco.editor.create(document.getElementById("editor"), {
    value: files[currentFile],
    language: "html",
    theme: "vs-dark",
    automaticLayout: true
  });

  renderFileList();

  // LIVE EDIT
  editor.onDidChangeModelContent(() => {
    files[currentFile] = editor.getValue();
    saveFiles();
    updatePreview();
  });

  updatePreview();
});

// SWITCH FILE
function openFile(name) {
  currentFile = name;

  let lang = "html";
  if (name.endsWith(".css")) lang = "css";
  if (name.endsWith(".js")) lang = "javascript";

  monaco.editor.setModelLanguage(editor.getModel(), lang);
  editor.setValue(files[name]);
}

// FILE LIST UI
function renderFileList() {
  const list = document.getElementById("fileList");
  list.innerHTML = "";

  Object.keys(files).forEach(name => {
    let div = document.createElement("div");
    div.className = "file";
    div.innerText = name;
    div.onclick = () => openFile(name);
    list.appendChild(div);
  });
}

// NEW FILE
function newFile() {
  let name = prompt("File name (example: app.js)");

  if (!name) return;

  files[name] = "";
  saveFiles();
  renderFileList();
}

// SAVE
function saveFiles() {
  localStorage.setItem("files", JSON.stringify(files));
}

// LIVE PREVIEW (CodePen style)
function updatePreview() {
  const html = files["index.html"] || "";
  const css = files["style.css"] || "";
  const js = files["script.js"] || "";

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

  document.getElementById("preview").srcdoc = output;
}
