const uploadBox = document.getElementById("uploadBox");
const imageInput = document.getElementById("imageInput");

// Click to upload
uploadBox.addEventListener("click", () => imageInput.click());

// Drag events
uploadBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadBox.classList.add("dragover");
});

uploadBox.addEventListener("dragleave", () => {
    uploadBox.classList.remove("dragover");
});

// Drop file
uploadBox.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadBox.classList.remove("dragover");

    if (e.dataTransfer.files.length > 0) {
        imageInput.files = e.dataTransfer.files;
        handleImage(imageInput.files[0]);
    }
});

// Manual upload
imageInput.addEventListener("change", () => {
    if (imageInput.files.length > 0) {
        handleImage(imageInput.files[0]);
    }
});

// MAIN HANDLER
function handleImage(file) {
    document.getElementById("reverseSection").style.display = "block";

    EXIF.getData(file, function() {
        let allExif = EXIF.getAllTags(this);

        // Show all EXIF
        if (Object.keys(allExif).length > 0) {
            document.getElementById("exifData").innerText =
                JSON.stringify(allExif, null, 2);
            document.getElementById("exifSection").style.display = "block";
        }

        let lat = EXIF.getTag(this, "GPSLatitude");
        let lng = EXIF.getTag(this, "GPSLongitude");
        let latRef = EXIF.getTag(this, "GPSLatitudeRef");
        let lngRef = EXIF.getTag(this, "GPSLongitudeRef");

        if (!lat || !lng) return;

        function toDecimal(coord, ref) {
            const d = coord[0].numerator / coord[0].denominator;
            const m = coord[1].numerator / coord[1].denominator;
            const s = coord[2].numerator / coord[2].denominator;
            let dec = d + m / 60 + s / 3600;
            if (ref === "S" || ref === "W") dec *= -1;
            return dec;
        }

        const latDec = toDecimal(lat, latRef);
        const lngDec = toDecimal(lng, lngRef);

        document.getElementById("lat").innerText = latDec;
        document.getElementById("lng").innerText = lngDec;

        document.getElementById("googleLink").href =
            `https://www.google.com/maps?q=${latDec},${lngDec}`;
        document.getElementById("yandexLink").href =
            `https://yandex.com/maps/?ll=${lngDec}%2C${latDec}&z=16`;

        document.getElementById("gpsSection").style.display = "block";
    });
}
