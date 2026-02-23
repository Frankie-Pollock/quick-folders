function normaliseAddressLine(line) {
  // Trim, collapse internal spaces, normalize commas & spaces
  let cleaned = line
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", "); // tidy comma spacing

  if (!cleaned) return null;

  // Split by commas and keep only first two parts
  const parts = cleaned.split(",");
  const kept = parts.slice(0, 2).map(p => p.trim()).filter(Boolean);

  if (kept.length === 0) return null;

  // Join with a single comma + space, then uppercase
  const folderName = kept.join(", ").toUpperCase();

  // Remove trailing periods/spaces (optional tidy)
  return folderName.replace(/[.\s]+$/g, "");
}

function generateZip() {
  const input = document.getElementById("addresses").value;
  const zipNameInput = document.getElementById("zipName").value.trim();
  const zipFileName = zipNameInput ? ensureZipExtension(zipNameInput) : "address-folders.zip";

  if (!input.trim()) {
    alert("Please enter at least one address.");
    return;
  }

  const lines = input.split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const zip = new JSZip();
  let createdCount = 0;

  lines.forEach((addr, idx) => {
    const folderName = normaliseAddressLine(addr);

    if (!folderName) return;

    // Ensure unique folder names within the zip if duplicates occur
    let finalName = folderName;
    let suffix = 2;
    while (zip.folder(finalName) === null && zip.files[finalName + "/"]) {
      finalName = `${folderName} (${suffix++})`;
    }

    zip.folder(finalName);
    createdCount++;
  });

  if (createdCount === 0) {
    alert("No valid addresses found after processing.");
    return;
  }

  zip.generateAsync({ type: "blob" })
    .then(content => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = zipFileName;
      link.click();
      URL.revokeObjectURL(link.href);
    })
    .catch(err => {
      console.error(err);
      alert("There was an error creating the ZIP.");
    });
}

function ensureZipExtension(name) {
  return name.toLowerCase().endsWith(".zip") ? name : `${name}.zip`;
}
