function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader);
        reader.readAsDataURL(file);
    });
}

function formatSize(sizeInBytes) {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = parseInt(Math.floor(Math.log(sizeInBytes) / Math.log(1024)));
    return (sizeInBytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}
