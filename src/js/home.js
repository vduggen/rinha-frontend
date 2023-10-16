function openUpload() {
  document.getElementById("rf-upload").click();
}

function changeTab(contentFile) {
  document.getElementById("home").style.display = "none";
  document.getElementById("json-tree").style.display = "flex";
  createStructure(document.getElementById("json-tree"));
}

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("rf-upload").addEventListener("change", async (e) => {
        const fileReader = new FileReader();
        fileReader.onload = function () {
          changeTab(fileReader.result);
          renderTreeView(JSON.parse(fileReader.result));
        };
        document.querySelector(".rf-main #json-tree .rf-title").innerText =
          e.target.files[0].name;
        fileReader.readAsText(e.target.files[0]);
      });
})
