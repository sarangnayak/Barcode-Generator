document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('barcode-text');
    const formatSelect = document.getElementById('barcode-format');
    const lineColorInput = document.getElementById('line-color');
    const backgroundColorInput = document.getElementById('background-color');
    const widthSlider = document.getElementById('bar-width');
    const heightSlider = document.getElementById('bar-height');
    const displayValueCheckbox = document.getElementById('display-value');
    
    const widthValueSpan = document.getElementById('width-value');
    const heightValueSpan = document.getElementById('height-value');
    
    const barcodeSvg = document.getElementById('barcode-svg');
    const errorMessage = document.getElementById('error-message');
    
    const downloadBtn = document.getElementById('download-btn');
    const copyBtn = document.getElementById('copy-btn');
    const copySuccessMsg = document.querySelector('.copy-success');

    const generateBarcode = () => {
        const text = textInput.value;
        const format = formatSelect.value;
        const lineColor = lineColorInput.value;
        const backgroundColor = backgroundColorInput.value;
        const width = widthSlider.value;
        const height = heightSlider.value;
        const displayValue = displayValueCheckbox.checked;
        
        // Update slider value displays
        widthValueSpan.textContent = width;
        heightValueSpan.textContent = height;

        errorMessage.textContent = ''; // Clear previous errors

        if (!text) {
            barcodeSvg.innerHTML = ''; // Clear barcode if no text
            return;
        }

        try {
            JsBarcode(barcodeSvg, text, {
                format: format,
                lineColor: lineColor,
                background: backgroundColor,
                width: width,
                height: height,
                displayValue: displayValue,
                font: "Poppins",
                textAlign: "center",
                textPosition: "bottom",
                fontSize: 20,
            });
            errorMessage.textContent = '';
        } catch (e) {
            barcodeSvg.innerHTML = ''; // Clear barcode on error
            errorMessage.textContent = 'Invalid data for selected format.';
            console.error(e);
        }
    };
    
    const downloadBarcode = () => {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(barcodeSvg);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const img = new Image();
        const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const pngUrl = canvas.toDataURL('image/png');
            
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = `barcode-${textInput.value || 'generated'}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
        };
        
        img.src = url;
    };

    const copyBarcode = () => {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(barcodeSvg);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });

        navigator.clipboard.write([
            new ClipboardItem({
                'image/svg+xml': svgBlob
            })
        ]).then(() => {
            copySuccessMsg.style.opacity = '1';
            setTimeout(() => {
                copySuccessMsg.style.opacity = '0';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy barcode:', err);
            alert('Failed to copy barcode. Please try downloading instead.');
        });
    };

    // Event Listeners
    [textInput, formatSelect, lineColorInput, backgroundColorInput, displayValueCheckbox].forEach(el => {
        el.addEventListener('change', generateBarcode);
    });
    
    [widthSlider, heightSlider].forEach(el => {
        el.addEventListener('input', generateBarcode);
    });

    downloadBtn.addEventListener('click', downloadBarcode);
    copyBtn.addEventListener('click', copyBarcode);

    // Initial barcode generation on page load
    generateBarcode();
});
