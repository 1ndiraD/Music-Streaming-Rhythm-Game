const clubber = require("clubber");
const work = require("webworkify");

console.log("are gummy");

let StreamingChunksPlayer = function() {

    EventTarget.call(this);

    let _context;
    let _audioBuffer;
    let _audioSource;
    let _analyser;
    let analyzed;

    const url = "https://streams.wtju.net:8443/wtju-opus-256.ogg";

    const bufferWorker = work(require("./bufferWorker.js"));
    const analyzerWorker = work(require("./analyzerWorker.js"));

    this.init = function() {
        bufferWorker.postMessage(url);
    };

    let _initializeWebAudio = function() {
        _context = new AudioContext();
        _analyser = _context.createAnalyser();
        _analyser.fftSize = 2048;
    };

    bufferWorker.onmessage = function(event) {
        _activeBuffer = event.data[0];
        _totalChunksLoaded = event.data[1];

        if (_totalChunksLoaded === 100) {
            _initializeWebAudio();
            console.log("initialized web audio");
        }
        else {

            console.log("active:", _activeBuffer)

            _context.decodeAudioData(_activeBuffer, function(buf) {
                _audioBuffer = buf;
                console.log("audio:", _audioBuffer);
                console.log(_audioBuffer.getChannelData(0));

                analyzerWorker.postMessage(_audioBuffer);
                analyzerWorker.onmessage = function(event) {
                    analyzed = event.data;
                    console.log("analysis:", analyzed);
                };

                _play();
            });
        }
    };

    let _play = function() {
        let currentTime = _context.currentTime + 0.010 || 0;
        console.log("current time:", currentTime);

        let scheduledTime = 0.015;

        try {
            _audioSource.stop(scheduledTime);
        } catch (e) {}

        _audioSource = _context.createBufferSource();
        _audioSource.buffer = _audioBuffer;
        _audioSource.connect(_analyser);
        _audioSource.connect(_context.destination);
        _audioSource.playbackRate.value = 1;

        console.log("audiobuffer duration:", _audioBuffer.duration);
        console.log("buffer start time", scheduledTime - 0.005);
        console.log("offset by", currentTime);

        _audioSource.start(scheduledTime - 0.005, currentTime);
    };
};
module.exports = {StreamingChunksPlayer};
