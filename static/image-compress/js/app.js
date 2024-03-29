document.addEventListener('DOMContentLoaded', function () {
    Cocoen.create(document.querySelector('.cocoen'), {
        color: '#0355c0'
    });

    const fileInput = document.getElementById('fileInput');
    const qualityValue = document.getElementById('qualityValue');
    const maxWidthInput = document.getElementById('maxWidthInput');
    const maxHeightInput = document.getElementById('maxHeightInput');
    const downloadButton = document.getElementById('downloadButton');
    const sourceImageSize = document.getElementById('sourceImageSize');
    const resultImageSize = document.getElementById('resultImageSize');
    const sourceImagePreview = document.getElementById('sourceImagePreview');
    const resultImagePreview = document.getElementById('resultImagePreview');
    const sourceImageResolution = document.getElementById('sourceImageResolution');
    const resultImageResolution = document.getElementById('resultImageResolution');

    clearAllInputs();

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];

        // Check if a file is selected
        if (!file) {
            alert('Please select an image file.');
            clearAllInputs();
            return;
        }

        handleImageDetails(file, true).then({});

        // Show source image size
        sourceImageSize.textContent = formatSize(file.size);
    });

    // Event listeners for maxWidth and maxHeight inputs change
    [qualityValue, maxWidthInput, maxHeightInput].forEach((input) => {
        input.addEventListener('change', function () {
            const file = fileInput.files[0];
            if (file) {
                handleImageDetails(file).then({});
            }
        });
    });

    // Function to handle image preview and other image details
    async function handleImageDetails(file, init = false) {
        const imageDataURL = await readFileAsDataURL(file);
        const sourceImageType = file.type;
        let qualityNumber

        if (!isNaN(qualityValue.value)) {
            qualityNumber = parseFloat(qualityValue.value);
        } else {
            qualityNumber = 0.92;
        }

        // Set image details
        if (init) {
            const srcImage = await getImageDimension(imageDataURL);

            maxWidthInput.value = srcImage.width;
            maxHeightInput.value = srcImage.height;
            sourceImageResolution.textContent = `${srcImage.width}x${srcImage.height}`;
        }

        sourceImagePreview.onload = () => {
            // Compress and display the image
            compressAndDisplayImage(imageDataURL, sourceImagePreview.width, sourceImagePreview.height, sourceImageType, qualityNumber, maxWidthInput.value, maxHeightInput.value);
        }

        sourceImagePreview.src = imageDataURL;
        sourceImagePreview.classList.remove('d-none');
    }

    // Compress and display the image
    async function compressAndDisplayImage(imageDataURL, width, height, mimetype, quality = 0.9, maxWidth = 800, maxHeight = 800) {
        resultImagePreview.src = '';
        resultImageSize.textContent = '-';
        resultImageResolution.textContent = '-';

        const imageBlob = await fetch(imageDataURL).then(response => response.blob());

        // Calculate new image dimensions to fit maxWidth and maxHeight
        const widthRatio = maxWidth / width;
        const heightRatio = maxHeight / height;
        const ratio = Math.min(widthRatio, heightRatio);
        const newWidth = width * ratio;
        const newHeight = height * ratio;

        const compressedImage = await compressImage(imageBlob, {
            quality: quality, mimeType: mimetype, maxWidth: newWidth, maxHeight: newHeight
        });
        const resultImageDataURL = await readFileAsDataURL(compressedImage);

        const rImage = await getImageDimension(resultImageDataURL);
        resultImageResolution.textContent = `${rImage.width}x${rImage.height}`;

        resultImagePreview.src = resultImageDataURL;
        resultImagePreview.classList.remove('d-none');

        // Calculate and display the result image size
        resultImageSize.textContent = formatSize(compressedImage.size);

        // Show the download button
        downloadButton.classList.remove('d-none');

        // Set the download link to the compressed image data URL
        downloadButton.href = resultImageDataURL;
    }

    // Utility function to compress image
    function compressImage(blob, options) {
        return new Promise((resolve, reject) => {
            new Compressor(blob, {
                ...options, success(result) {
                    resolve(result);
                }, error(err) {
                    reject(err);
                }
            });
        });
    }

    function getImageDimension(url) {
        return new Promise((resolve, reject) => {
            let img = new Image();

            img.onload = function () {
                resolve({height: img.height, width: img.width});
            }

            img.onerror = function () {
                reject(new Error('Failed to load image'));
            }

            img.src = url;
        });
    }

    function clearAllInputs() {
        fileInput.value = '';
        maxWidthInput.value = '';
        maxHeightInput.value = '';
    }
});
