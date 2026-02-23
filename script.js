function generateZip() {
    let input = document.getElementById("addresses").value.trim();

    if (!input) {
        alert("Please enter at least one address.");
        return;
    }

    let lines = input.split("\n").map(l => l.trim()).filter(l => l.length > 0);

    let zip = new JSZip();

    lines.forEach(addr => {
        let folderName = addr.toUpperCase();
        zip.folder(folderName);
    });

    zip.generateAsync({ type: "blob" })
        .then(content => {
            let link = document.createElement("a");
            link.href = URL.createObjectURL(content);
            link.download = "address-folders.zip";
            link.click();
        });
}
