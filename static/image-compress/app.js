// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Event listener for file input change
    const fileInput = document.getElementById('fileInput');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const maxWidthInput = document.getElementById('maxWidthInput');
    const maxHeightInput = document.getElementById('maxHeightInput');


    fileInput.value = '';
    qualitySlider.value = 0.9;
    qualityValue.textContent = '90%';
    maxWidthInput.value = '';
    maxHeightInput.value = '';
    
    document.getElementById('fileInput').addEventListener('change', function (event) {
        const file = event.target.files[0];

        // Check if a file is selected
        if (!file) {
            alert('Please select an image file.');
            return;
        }

        handleImageDetails(file);
    });

    // Event listener for quality slider change
    qualitySlider.addEventListener('change', function () {
        qualityValue.textContent = `${(qualitySlider.value * 100).toFixed(0)}%`;
        const maxWidthInput = document.getElementById('maxWidthInput');
        const maxHeightInput = document.getElementById('maxHeightInput');
        const file = document.getElementById('fileInput').files[0];
        if (file) {
            compressAndDisplayImage(file, qualitySlider.value, maxWidthInput.value, maxHeightInput.value);
        }
    });

    // Event listeners for maxWidth and maxHeight inputs change
    [maxWidthInput, maxHeightInput].forEach((input) => {
        input.addEventListener('change', function () {
            const file = document.getElementById('fileInput').files[0];
            if (file) {
                compressAndDisplayImage(file, qualitySlider.value, maxWidthInput.value, maxHeightInput.value);
            }
        });
    });
});


// Utility function to format file size
function formatSize(sizeInBytes) {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = parseInt(Math.floor(Math.log(sizeInBytes) / Math.log(1024)));
    return (sizeInBytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

// Function to handle image preview and other image details
function handleImageDetails(file) {
    const reader = new FileReader();
    reader.onload = function () {
        const image = new Image();
        image.src = reader.result;

        image.onload = function () {
            const maxWidthInput = document.getElementById('maxWidthInput');
            const maxHeightInput = document.getElementById('maxHeightInput');
            const sourceImageResolution = document.getElementById('sourceImageResolution');
            const sourceImagePreview = document.getElementById('sourceImagePreview');

            // Set image details
            maxWidthInput.value = image.width;
            maxHeightInput.value = image.height;
            sourceImageResolution.textContent = `${image.width}x${image.height}`;

            // Show image preview
            sourceImagePreview.src = reader.result;
            sourceImagePreview.classList.remove('d-none');

            // Compress and display the image
            compressAndDisplayImage(file, qualitySlider.value, maxWidthInput.value, maxHeightInput.value);
        };

        // Show source image size
        const sourceImageSize = document.getElementById('sourceImageSize');
        sourceImageSize.textContent = formatSize(file.size);
    };
    reader.readAsDataURL(file);
}

// Compress and display the image
function compressAndDisplayImage(file, quality = 0.9, maxWidth = 800, maxHeight = 800) {
    const reader = new FileReader();
    reader.onload = function () {
        const image = new Image();
        image.src = reader.result;

        image.onload = function () {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            let newWidth = image.width;
            let newHeight = image.height;

            // Calculate new image dimensions to fit maxWidth and maxHeight
            if (newWidth > maxWidth || newHeight > maxHeight) {
                const widthRatio = maxWidth / newWidth;
                const heightRatio = maxHeight / newHeight;
                const ratio = Math.min(widthRatio, heightRatio);
                newWidth *= ratio;
                newHeight *= ratio;
            }

            canvas.width = newWidth;
            canvas.height = newHeight;

            context.drawImage(image, 0, 0, newWidth, newHeight);

            canvas.toBlob(function (result) {
                const compressedImageURL = URL.createObjectURL(result);
                const resultImagePreview = document.getElementById('resultImagePreview');
                resultImagePreview.src = compressedImageURL;
                resultImagePreview.classList.remove('d-none');

                // Display the result image resolution
                const image2 = new Image();
                const reader2 = new FileReader();
                reader2.onload = function () {
                    image2.src = reader2.result;
                    image2.onload = function () {
                        const resultImageResolution = document.getElementById('resultImageResolution');
                        resultImageResolution.textContent = `${image2.width}x${image2.height}`;
                    };
                };
                reader2.readAsDataURL(result);

                // Calculate and display the result image size
                resultBlobToDataURL(result, function (dataURL) {
                    const resultImageSize = document.getElementById('resultImageSize');
                    resultImageSize.textContent = formatSize(dataURL.length);

                    // Show the download button
                    const downloadButton = document.getElementById('downloadButton');
                    downloadButton.classList.remove('d-none');

                    // Set the download link to the compressed image data URL
                    downloadButton.href = dataURL;
                });
            }, file.type, quality);
        };
    };
    reader.readAsDataURL(file);
}


function resultBlobToDataURL(result, callback) {
    const reader = new FileReader();
    reader.onloadend = function () {
        callback(reader.result);
    };
    reader.readAsDataURL(result);
}
