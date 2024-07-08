document.addEventListener('DOMContentLoaded', () => {
    const icing = document.querySelector('.icing');
    const numberOfSprinkles = 50;

    // Creating sprinkles dynamically
    for (let i = 0; i < numberOfSprinkles; i++) {
        const sprinkle = document.createElement('div');
        sprinkle.classList.add('sprinkle');
        sprinkle.style.top = `${Math.random() * 100}%`;
        sprinkle.style.left = `${Math.random() * 100}%`;
        sprinkle.style.setProperty('--angle', `${Math.random() * 360}deg`);
        icing.appendChild(sprinkle);
    }

    let audioContext;
    let analyser;
    let microphone;
    let isBlowing = false; // Flag to track if blowing is detected

    // Request access to microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            audioContext = new AudioContext();
            microphone = audioContext.createMediaStreamSource(stream);
            analyser = audioContext.createAnalyser();
            microphone.connect(analyser);
            analyser.fftSize = 2048;
            let bufferLength = analyser.frequencyBinCount;
            let dataArray = new Uint8Array(bufferLength);

            // Function to process microphone input
            function processMicrophoneInput() {
                analyser.getByteFrequencyData(dataArray);

                // Example: Calculate average frequency
                let sum = dataArray.reduce((acc, val) => acc + val, 0);
                let averageFrequency = sum / bufferLength;

                // Example: Adjust sensitivity threshold
                if (averageFrequency > 150) { // Adjusted threshold
                    // Perform actions based on audio input
                    console.log('Sound detected!');
                    // Example: Trigger blowing effect
                    if (!isBlowing) {
                        blowOutCandles();
                        isBlowing = true;
                    }
                } else {
                    isBlowing = false;
                }

                // Repeat the function for real-time processing
                requestAnimationFrame(processMicrophoneInput);
            }

            // Start processing microphone input
            processMicrophoneInput();
        })
        .catch(function(err) {
            // Handle errors, such as permission denied
            console.error('Microphone access denied:', err);
        });

    // Click event for each candle
    document.querySelectorAll('.candle').forEach((candle, index) => {
        candle.addEventListener('click', function() {
            const flame = this.querySelector('.flame');
            const smoke = this.querySelector('.smoke-wrap');

            // Add fade-out animation class to trigger the fade-out animation
            flame.classList.add('fade-out');

            // Start smoke-rise animation at the same time as fade-out
            smoke.style.display = 'block';
            setTimeout(() => {
                flame.style.opacity = '0'; // Adjust opacity directly instead of display
            }, 0); // Start immediately after adding fade-out class
        });
    });

    function blowOutCandles() {
        // Trigger the fade-out animation for all candles
        document.querySelectorAll('.flame').forEach(flame => {
            flame.classList.add('fade-out');
        });

        // Show smoke animation for all candles
        document.querySelectorAll('.smoke-wrap').forEach(smoke => {
            smoke.style.display = 'block';
            setTimeout(() => {
                smoke.style.display = 'none';
            }, 4000); // Adjust timing as per your animation
        });
    }
});
