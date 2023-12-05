document.addEventListener('DOMContentLoaded', function () {
    console.log("Ready!");
    Cocoen.create(document.querySelector('.cocoen'), {
        color: '#0355c0'
    });

    const fileInput = document.getElementById('fileInput');
    const methodInput = document.getElementById('methodInput');
    const scaleFactorInput = document.getElementById('scaleFactorInput');
    const downloadButton = document.getElementById('downloadButton');
    const sourceImageSize = document.getElementById('sourceImageSize');
    const resultImageSize = document.getElementById('resultImageSize');
    const sourceImagePreview = document.getElementById('sourceImagePreview');
    const resultImagePreview = document.getElementById('resultImagePreview');
    const sourceImageResolution = document.getElementById('sourceImageResolution');
    const resultImageResolution = document.getElementById('resultImageResolution');
    const submitButton = document.getElementById('submitBtn');
    const submitButtonText = document.getElementById('submitButtonText');
    const spinner = document.getElementById('spinner');
    const EMPTY_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAWVJREFUeF7t00ERAAAIhECvf2lr7AMTMODtOsrAKJpgriDYExSkIJgBDKeFFAQzgOG0kIJgBjCcFlIQzACG00IKghnAcFpIQTADGE4LKQhmAMNpIQXBDGA4LaQgmAEMp4UUBDOA4bSQgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTgspCGYAw2khBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHBaSEEwAxhOCykIZgDDaSEFwQxgOC2kIJgBDKeFFAQzgOG0kIJgBjCcFlIQzACG00IKghnAcFpIQTADGE4LKQhmAMNpIQXBDGA4LaQgmAEMp4UUBDOA4bSQgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTgspCGYAw2khBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHBaSEEwAxhOCykIZgDDaSEFwQxgOC0EC/KEzwBlGO+pQQAAAABJRU5ErkJggg==';

    let srcImageWidth = 0;
    let srcImageHeight = 0;
    let targetImageSize = {width: 0, height: 0};

    clearAllInputs();

    scaleFactorInput.addEventListener('change', function (event) {
        targetImageSize = getNewImageSizeByFactor(srcImageWidth, srcImageHeight, event.target.valueAsNumber);
        submitButtonText.textContent = `Upscale to ${targetImageSize.width}x${targetImageSize.height}`
    });

    fileInput.addEventListener('change', function (event) {
        showSpinner();
        clearAllInputs();
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        readFileAsDataURL(file).then(imageDataUrl => {
            getImageDetail(imageDataUrl).then(result => {
                srcImageWidth = result.width;
                srcImageHeight = result.height;
                sourceImageResolution.textContent = `${result.width}x${result.height}`;
                targetImageSize = getNewImageSizeByFactor(result.width, result.height, scaleFactorInput.valueAsNumber);
                submitButtonText.textContent = `Upscale to ${targetImageSize.width}x${targetImageSize.height}`;

                hideSpinner();
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

        showSpinner();

        readFileAsDataURL(file).then(imageDataUrl => {
            getImageDetail(imageDataUrl).then(() => {
                runImageJob(file, methodInput.value).then(() => showComplete());
            });
        }).catch(reason => console.log(reason));
    });

    async function runImageJob(file, method) {
        const imageDataURL = await readFileAsDataURL(file);
        const newWidth = targetImageSize.width;
        const newHeight = targetImageSize.height;

        let imageResultAsDataURL;

        switch (method) {
            case 'nearest_neighbor_interpolation':
                imageResultAsDataURL = await upscaleNearestNeighborInterpolation(imageDataURL, newWidth, newHeight);
                break;
            case 'bilinear_interpolation':
                imageResultAsDataURL = await upscaleBilinearInterpolation(imageDataURL, newWidth, newHeight);
                break;
            case 'bicubic_interpolation':
                imageResultAsDataURL = await upscaleBicubicInterpolation(imageDataURL, newWidth, newHeight);
                break;
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

        const ratio = inputImageData.width / width;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const px = Math.floor(x * ratio);
                const py = Math.floor(y * ratio);
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

        const resultImageInDataUrl = outputCanvas.toDataURL();

        outputCanvas.remove();

        return resultImageInDataUrl;
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

        const resultImageInDataUrl = outputCanvas.toDataURL();

        outputCanvas.remove();

        return resultImageInDataUrl;
    }

    async function upscaleBicubicInterpolation(imageDataUrl, width, height) {
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

                let r = 0;
                let g = 0;
                let b = 0;
                let a = 0;

                for (let dy = -1; dy <= 2; dy++) {
                    for (let dx = -1; dx <= 2; dx++) {
                        const t1 = Math.abs(dx - fx);
                        const a1 = inputImageData.data[((iy + dy) * inputImageData.width + (ix + dx)) * 4];
                        const b1 = inputImageData.data[((iy + dy) * inputImageData.width + (ix + dx) + 1) * 4];
                        const c1 = inputImageData.data[((iy + dy) * inputImageData.width + (ix + dx) + 2) * 4];
                        const d1 = inputImageData.data[((iy + dy) * inputImageData.width + (ix + dx) + 3) * 4];

                        const weightX = cubicInterpolation(t1, a1, b1, c1, d1);
                        const weightY = cubicInterpolation(Math.abs(fy - dy), 1, 1, 1, 1);

                        const dataIndex = ((iy + dy) * inputImageData.width + (ix + dx)) * 4;

                        r += inputImageData.data[dataIndex] * weightX * weightY;
                        g += inputImageData.data[dataIndex + 1] * weightX * weightY;
                        b += inputImageData.data[dataIndex + 2] * weightX * weightY;
                        a += inputImageData.data[dataIndex + 3] * weightX * weightY;
                    }
                }

                const outputIndex = (y * width + x) * 4;
                outputImageData.data[outputIndex] = r;
                outputImageData.data[outputIndex + 1] = g;
                outputImageData.data[outputIndex + 2] = b;
                outputImageData.data[outputIndex + 3] = a;
            }
        }

        outputCanvas.width = width;
        outputCanvas.height = height;

        outputCtx.putImageData(outputImageData, 0, 0);

        const resultImageInDataUrl = outputCanvas.toDataURL();

        outputCanvas.remove();

        return resultImageInDataUrl;
    }

    function cubicInterpolation(t, a, b, c, d) {
        const p = (d - c) - (a - b);
        const q = (a - b) - p;
        const r = c - a;

        return p * Math.pow(t, 3) + q * Math.pow(t, 2) + r * t + b;
    }

    function showSpinner() {
        submitButtonText.textContent = 'Upscaling ...';
        spinner.classList.remove("d-none");
    }

    function hideSpinner() {
        spinner.classList.add("d-none");
    }

    function showComplete() {
        hideSpinner();
        submitButtonText.textContent = 'Upscale finished!';
    }

    function getNewImageSizeByFactor(srcWidth, srcHeight, scaleFactor) {
        return {width: Math.floor(srcWidth * scaleFactor), height: Math.floor(srcHeight * scaleFactor)};
    }

    function getImageDetail(url) {
        return new Promise((resolve, reject) => {
            let img = new Image();

            img.onload = function () {
                resolve({height: img.height, width: img.width, img: img});
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
        return new Blob([raw], {type: contentType});
    }

    function clearAllInputs() {
        sourceImageSize.textContent = '-';
        sourceImageResolution.textContent = '-';
        resultImageSize.textContent = '-';
        resultImageResolution.textContent = '-';
        scaleFactorInput.value = 1.0;
        submitButtonText.textContent = "Upscale";

        sourceImagePreview.src = EMPTY_IMAGE;
        resultImagePreview.src = EMPTY_IMAGE;
    }
});
