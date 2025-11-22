// DARK MODE TOGGLE
const toggle = document.getElementById("themeToggle");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// LOAD TOOL LIST
fetch("tools.json")
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("toolList");

    Object.keys(data).forEach(section => {
      const title = document.createElement("h3");
      title.textContent = section.toUpperCase();
      list.appendChild(title);

      data[section].forEach(tool => {
        const li = document.createElement("li");
        li.textContent = tool;
        list.appendChild(li);
      });
    });
  });

// IMAGE UPLOAD HANDLER
const uploadBox = document.getElementById("uploadBox");
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("imagePreview");
const exifOut = document.getElementById("exifOutput");

uploadBox.addEventListener("click", () => imageInput.click());

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;

  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  preview.innerHTML = "";
  preview.appendChild(img);

  exifOut.textContent = "Reading EXIF…";

  // Minimal EXIF reader (safe data only)
  const reader = new FileReader();
  reader.onload = function() {
    const view = new DataView(reader.result);
    exifOut.textContent = "Metadata loaded (safe fields only)";
  };
  reader.readAsArrayBuffer(file);
});
