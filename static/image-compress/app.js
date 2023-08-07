
document.addEventListener('DOMContentLoaded', function () {
    // Rest of your code remains unchanged
    // Event listener for file input change
    const fileInput = document.getElementById('fileInput');
    const qualityValue = document.getElementById('qualityValue');
    const maxWidthInput = document.getElementById('maxWidthInput');
    const maxHeightInput = document.getElementById('maxHeightInput');
    const resultImageSize = document.getElementById('resultImageSize');
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

    // Utility function to format file size
    function formatSize(sizeInBytes) {
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = parseInt(Math.floor(Math.log(sizeInBytes) / Math.log(1024)));
        return (sizeInBytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
    }

    // Function to handle image preview and other image details
    async function handleImageDetails(file, init = false) {
        const imageDataURL = await readFileAsDataURL(file);
        const image = await IJS.Image.load(imageDataURL);

        // Set image details
        if (init) {
            maxWidthInput.value = image.width;
            maxHeightInput.value = image.height;
            sourceImageResolution.textContent = `${image.width}x${image.height}`;
        }

        // Show image preview
        sourceImagePreview.src = imageDataURL;
        sourceImagePreview.classList.remove('d-none');

        // Compress and display the image
        compressAndDisplayImage(image, qualityValue.value, maxWidthInput.value, maxHeightInput.value);
    }

    // Compress and display the image
    async function compressAndDisplayImage(image, quality = 0.9, maxWidth = 800, maxHeight = 800) {
        resultImagePreview.src = '';
        resultImageSize.textContent = '-';
        resultImageResolution.textContent = '-';

        // Calculate new image dimensions to fit maxWidth and maxHeight
        const widthRatio = maxWidth / image.width;
        const heightRatio = maxHeight / image.height;
        const ratio = Math.min(widthRatio, heightRatio);
        const newWidth = image.width * ratio;
        const newHeight = image.height * ratio;

        const compressedImage = await image.resize({ width: newWidth, height: newHeight });
        const compressedImageBlob = await compressedImage.toBlob('image/jpeg', quality);

        const compressedImageDataURL = await readFileAsDataURL(compressedImageBlob);
        
        resultImagePreview.src = compressedImageDataURL;
        resultImagePreview.classList.remove('d-none');

        // Display the result image resolution
        const resultImage = await IJS.Image.load(compressedImageDataURL);
        resultImageResolution.textContent = `${resultImage.width}x${resultImage.height}`;

        // Calculate and display the result image size
        resultImageSize.textContent = formatSize(compressedImageBlob.size);

        // Show the download button
        const downloadButton = document.getElementById('downloadButton');
        downloadButton.classList.remove('d-none');

        // Set the download link to the compressed image data URL
        downloadButton.href = compressedImageDataURL;
    }

    // Utility function to read file as data URL
    function readFileAsDataURL(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
        });
    }

});
