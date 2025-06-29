    let recognition;
    let transcript = [];
    let startTime;
    let index = 1;

window.onload = function () {
    if(!('webkitSpeechRecognition' in window)) {
        alert("Your browswer does not support Web Speech API. Use Chrome, please!");
    }
    else {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang= 'en-US';
 
        recognition.onstart = () => {
            startTime = Date.now() / 1000;
        };

        recognition. onresult = (event) => {
            const currentTime = (Date.now() / 1000) - startTime;
            for (let i= event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    const text = event.results[i][0].transcript.trim();
                    const endTime = currentTime;
                    const start = endTime - 2;
                    
                    transcript.push( {
                    index: index++,
                    start: toSRTTtime(start),
                    end: toSRTTtime(endTime),
                    text: text
                    } ); 
                }

                    renderTranscript();
                }
            }

        
        };
    }
    
function startRecording() {
    transcript = [];
    index = 1;
    recognition.start();
    
}
function stopRecording() {
    recognition.stop();
}

function renderTranscript() {
    const output = document.getElementById('output'); 
    const srtText = transcript.map(block =>
        `${block.index}\n${block.start} --> ${block.end}\n${block.text}\n`
    ).join('\n');
    output.textContent= srtText;
}

function toSRTTtime(seconds) {
    const date = new Date(0);
    date.setSeconds(seconds);
    const iso = date.toISOString();
    return iso.substr(11, 8) + ',' + iso.substr(20,3);
}

function downloadSRT() {
    const srtText = transcript.map(block =>
    `${block.index}\n${block.start} --> ${block.end}\n${block.text}\n`
    ).join('\n');
    const blob = new Blob([srtText], {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'transcript.srt';
    a.click ();
}