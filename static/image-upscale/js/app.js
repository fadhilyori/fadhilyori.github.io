// noinspection DuplicatedCode

const htmlElement = document.querySelector("html")
if (htmlElement.getAttribute("data-bs-theme") === 'auto') {
    function updateTheme() {
        document.querySelector("html").setAttribute("data-bs-theme",
            window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme)
    updateTheme()
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("Ready!");
    Cocoen.create(document.querySelector('.cocoen'), {
        color: '#0355c0'
    });

    const fileInput = document.getElementById('fileInput');
    const methodInput = document.getElementById('methodInput');
    const newWidthInput = document.getElementById('newWidthInput');
    const newHeightInput = document.getElementById('newHeightInput');
    const downloadButton = document.getElementById('downloadButton');
    const sourceImageSize = document.getElementById('sourceImageSize');
    const resultImageSize = document.getElementById('resultImageSize');
    const sourceImagePreview = document.getElementById('sourceImagePreview');
    const resultImagePreview = document.getElementById('resultImagePreview');
    const sourceImageResolution = document.getElementById('sourceImageResolution');
    const resultImageResolution = document.getElementById('resultImageResolution');
    const submitButton = document.getElementById('submitBtn');
    const EMPTY_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAWVJREFUeF7t00ERAAAIhECvf2lr7AMTMODtOsrAKJpgriDYExSkIJgBDKeFFAQzgOG0kIJgBjCcFlIQzACG00IKghnAcFpIQTADGE4LKQhmAMNpIQXBDGA4LaQgmAEMp4UUBDOA4bSQgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTgspCGYAw2khBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHBaSEEwAxhOCykIZgDDaSEFwQxgOC2kIJgBDKeFFAQzgOG0kIJgBjCcFlIQzACG00IKghnAcFpIQTADGE4LKQhmAMNpIQXBDGA4LaQgmAEMp4UUBDOA4bSQgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTgspCGYAw2khBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHBaSEEwAxhOCykIZgDDaSEFwQxgOC0EC/KEzwBlGO+pQQAAAABJRU5ErkJggg==';

    let srcImageWidth = 0;
    let srcImageHeight = 0;

    clearAllInputs();

    newWidthInput.addEventListener('change', function (event) {
        if (event.target.value < srcImageWidth) {
            event.target.value = srcImageWidth
        }
        const imgSize = getNewImageSizeBasedOnRatio(srcImageWidth, srcImageHeight, event.target.valueAsNumber, srcImageHeight);
        newHeightInput.value = imgSize.height;
    });

    newHeightInput.addEventListener('change', function (event) {
        if (event.target.value < srcImageHeight) {
            event.target.value = srcImageHeight
        }
        const imgSize = getNewImageSizeBasedOnRatio(srcImageWidth, srcImageHeight, srcImageWidth, event.target.valueAsNumber);
        newWidthInput.value = imgSize.width;
    });

    fileInput.addEventListener('change', function (event) {
        clearAllInputs();
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        readFileAsDataURL(file).then(imageDataUrl => {
            getImageDetail(imageDataUrl).then(result => {
                srcImageWidth = result.width;
                srcImageHeight = result.height;
                newWidthInput.value = result.width;
                newHeightInput.value = result.height;
                sourceImageResolution.textContent = `${result.width}x${result.height}`;
            });

            sourceImagePreview.src = imageDataUrl;
        }).catch(reason => console.log(reason));

        sourceImageSize.textContent = formatSize(file.size);
    });

    submitButton.addEventListener('click', function () {
        resultImageSize.textContent = '-';
        resultImageResolution.textContent = '-';
        resultImagePreview.src = EMPTY_IMAGE;

        const file = fileInput.files[0];

        if (!file) {
            clearAllInputs();
            return;
        }

        if (methodInput.value === '') {
            alert('Please select one method to use!');
            return;
        }

        readFileAsDataURL(file).then(imageDataUrl => {
            getImageDetail(imageDataUrl).then(() => {
                runImageJob(file, methodInput.value).then(() => console.log('upscale success.'));
            });
        }).catch(reason => console.log(reason));
    });

    // Compress and display the image
    async function runImageJob(file, method) {
        const imageDataURL = await readFileAsDataURL(file);
        const newWidth = newWidthInput.valueAsNumber;
        const newHeight = newHeightInput.valueAsNumber;

        let imageResultAsDataURL;

        switch (method) {
            case 'nearest_neighbor_interpolation':
                imageResultAsDataURL = await upscaleNearestNeighborInterpolation(imageDataURL, newWidth, newHeight);
                break
            case 'bilinear_interpolation':
                imageResultAsDataURL = await upscaleBilinearInterpolation(imageDataURL, newWidth, newHeight);
                break
            default:
                imageResultAsDataURL = await upscaleNearestNeighborInterpolation(imageDataURL, newWidth, newHeight);
        }

        const imageResultAsBlob = dataURLtoBlob(imageResultAsDataURL);

        const rImage = await getImageDetail(imageResultAsDataURL);
        resultImageResolution.textContent = `${rImage.width}x${rImage.height}`;

        resultImagePreview.src = imageResultAsDataURL;

        // Calculate and display the result image size
        resultImageSize.textContent = formatSize(imageResultAsBlob.size);

        // Show the download button
        downloadButton.classList.remove('d-none');

        // Set the download link to the compressed image data URL
        downloadButton.href = imageResultAsDataURL;
    }

    async function getImageData(imageDataUrl) {
        const inputCanvas = document.createElement("canvas");
        const inputCtx = inputCanvas.getContext("2d");
        let inputImageData;

        await getImageDetail(imageDataUrl).then(imgDetail => {
            inputCanvas.width = imgDetail.width;
            inputCanvas.height = imgDetail.height;

            inputCtx.drawImage(imgDetail.img, 0, 0);

            inputImageData = inputCtx.getImageData(0, 0, imgDetail.width, imgDetail.height);
        })

        return inputImageData;
    }

    async function upscaleNearestNeighborInterpolation(imageDataUrl, width, height) {
        const outputCanvas = document.createElement("canvas");
        const outputCtx = outputCanvas.getContext("2d");
        const outputImageData = outputCtx.createImageData(width, height);
        const inputImageData = await getImageData(imageDataUrl);

        const xRatio = inputImageData.width / width;
        const yRatio = inputImageData.height / height;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const px = Math.floor(x * xRatio);
                const py = Math.floor(y * yRatio);
                const inputIndex = (py * inputImageData.width + px) * 4;
                const outputIndex = (y * width + x) * 4;

                for (let i = 0; i < 4; i++) {
                    outputImageData.data[outputIndex + i] = inputImageData.data[inputIndex + i];
                }
            }
        }

        outputCanvas.width = width;
        outputCanvas.height = height;

        outputCtx.putImageData(outputImageData, 0, 0);

        return outputCanvas.toDataURL();
    }

    async function upscaleBilinearInterpolation(imageDataUrl, width, height) {
        const outputCanvas = document.createElement("canvas");
        const outputCtx = outputCanvas.getContext("2d");
        const outputImageData = outputCtx.createImageData(width, height);
        const inputImageData = await getImageData(imageDataUrl);

        const xRatio = inputImageData.width / width;
        const yRatio = inputImageData.height / height;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const px = x * xRatio;
                const py = y * yRatio;
                const ix = Math.floor(px);
                const iy = Math.floor(py);
                const fx = px - ix;
                const fy = py - iy;

                const topLeftIndex = (iy * inputImageData.width + ix) * 4;
                const topRightIndex = (iy * inputImageData.width + (ix + 1)) * 4;
                const bottomLeftIndex = ((iy + 1) * inputImageData.width + ix) * 4;
                const bottomRightIndex = ((iy + 1) * inputImageData.width + (ix + 1)) * 4;

                for (let i = 0; i < 4; i++) {
                    const topInterpolation = (1 - fx) * inputImageData.data[topLeftIndex + i] + fx * inputImageData.data[topRightIndex + i];
                    const bottomInterpolation = (1 - fx) * inputImageData.data[bottomLeftIndex + i] + fx * inputImageData.data[bottomRightIndex + i];

                    outputImageData.data[(y * width + x) * 4 + i] = (1 - fy) * topInterpolation + fy * bottomInterpolation;
                }
            }
        }

        outputCanvas.width = width;
        outputCanvas.height = height;

        outputCtx.putImageData(outputImageData, 0, 0);

        return outputCanvas.toDataURL();
    }

    function getNewImageSizeBasedOnRatio(srcWidth, srcHeight, targetWidth, targetHeight) {
        const widthRatio = targetWidth / srcWidth;
        const heightRatio = targetHeight / srcHeight;

        // Use the minimum ratio to ensure the image fits within the target dimensions
        const minRatio = Math.max(widthRatio, heightRatio);

        // Calculate the new dimensions while maintaining the aspect ratio
        const newWidth = Math.round(srcWidth * minRatio);
        const newHeight = Math.round(srcHeight * minRatio);

        return { width: newWidth, height: newHeight };
    }

    // Utility function to read file as data URL
    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader);
            reader.readAsDataURL(file);
        });
    }

    // Utility function to format file size
    function formatSize(sizeInBytes) {
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = parseInt(Math.floor(Math.log(sizeInBytes) / Math.log(1024)));
        return (sizeInBytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
    }

    function getImageDetail(url) {
        return new Promise((resolve, reject) => {
            let img = new Image();

            img.onload = function () {
                resolve({ height: img.height, width: img.width, img: img });
            }

            img.onerror = function () {
                reject(new Error('Failed to load image'));
            }

            img.src = url;
        });
    }

    function dataURLtoBlob(dataURL) {
        // Split the data URL to get the content type and base64 data
        const parts = dataURL.split(';');
        const contentType = parts[0].split(':')[1];
        const raw = decodeURIComponent(parts[1]);
        return new Blob([raw], { type: contentType });
    }

    function clearAllInputs() {
        sourceImageSize.textContent = '-';
        sourceImageResolution.textContent = '-';
        resultImageSize.textContent = '-';
        resultImageResolution.textContent = '-';
        newWidthInput.value = '';
        newHeightInput.value = '';

        sourceImagePreview.src = EMPTY_IMAGE;
        resultImagePreview.src = EMPTY_IMAGE;
    }
});
