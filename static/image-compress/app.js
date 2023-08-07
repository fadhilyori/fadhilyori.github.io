document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');
    const qualityValue = document.getElementById('qualityValue');
    const maxWidthInput = document.getElementById('maxWidthInput');
    const maxHeightInput = document.getElementById('maxHeightInput');
    const resultImageSize = document.getElementById('resultImageSize');
    const sourceImagePreview = document.getElementById('sourceImagePreview');
    const resultImagePreview = document.getElementById('resultImagePreview');
    const sourceImageResolution = document.getElementById('sourceImageResolution');
    const resultImageResolution = document.getElementById('resultImageResolution');

    fileInput.value = '';
    maxWidthInput.value = '';
    maxHeightInput.value = '';

    document.getElementById('fileInput').addEventListener('change', function (event) {
        const file = event.target.files[0];

        // Check if a file is selected
        if (!file) {
            alert('Please select an image file.');
            return;
        }

        handleImageDetails(file, true);

        // Show source image size
        const sourceImageSize = document.getElementById('sourceImageSize');
        sourceImageSize.textContent = formatSize(file.size);
    });

    // Event listener for quality value change
    qualityValue.addEventListener("change", function () {
        const file = document.getElementById('fileInput').files[0];
        if (file) {
            handleImageDetails(file);
        }
    });

    // Event listeners for maxWidth and maxHeight inputs change
    [maxWidthInput, maxHeightInput].forEach((input) => {
        input.addEventListener('change', function () {
            const file = document.getElementById('fileInput').files[0];
            if (file) {
                handleImageDetails(file);
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

        // Show image preview
        sourceImagePreview.src = imageDataURL;
        sourceImagePreview.classList.remove('d-none');

        sourceImagePreview.onload = () => {
            // Set image details
            if (init) {
                maxWidthInput.value = sourceImagePreview.width;
                maxHeightInput.value = sourceImagePreview.height;
                sourceImageResolution.textContent = `${sourceImagePreview.width}x${sourceImagePreview.height}`;
            }

            // Compress and display the image
            compressAndDisplayImage(imageDataURL, sourceImagePreview.width, sourceImagePreview.height, sourceImageType, qualityNumber, maxWidthInput.value, maxHeightInput.value);
        }
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

        const compressedImage = await compressImage(imageBlob, { quality: quality, mimeType: mimetype, maxWidth: newWidth, maxHeight: newHeight });
        const resultImageDataURL = await readFileAsDataURL(compressedImage);

        resultImagePreview.src = resultImageDataURL;
        resultImagePreview.classList.remove('d-none');

        // Display the result image resolution
        resultImagePreview.onload = () => {
            resultImageResolution.textContent = `${resultImagePreview.width}x${resultImagePreview.height}`;
        }

        // Calculate and display the result image size
        resultImageSize.textContent = formatSize(compressedImage.size);

        // Show the download button
        const downloadButton = document.getElementById('downloadButton');
        downloadButton.classList.remove('d-none');

        // Set the download link to the compressed image data URL
        downloadButton.href = resultImageDataURL;
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

    // Utility function to compress image
    function compressImage(blob, options) {
        return new Promise((resolve, reject) => {
            new Compressor(blob, {
                ...options,
                success(result) {
                    resolve(result);
                },
                error(err) {
                    reject(err);
                }
            });
        });
    }
});
