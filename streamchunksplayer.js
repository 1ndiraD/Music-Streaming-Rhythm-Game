console.log("are yummy");

let StreamingChunksPlayer = function() {

    EventTarget.call(this);

    let _activeBuffer;
    let _totalChunksLoaded;
    let _context;
    let _audioBuffer;
    let _audioSource;
    let _analyser;

    //const url = "https://streams.wtju.net:8443/wtju-opus-256.ogg";
    //const url = "https://streams.wtju.net:8443/wtjx-128.mp3";
    const url = "http://muzaiko.info/public/sondosieroj/programero812.ogg";
    const worker = new Worker("bufferWorker.js");

    this.init = function() {
        worker.postMessage(url);
    };

    let _initializeWebAudio = function() { //used in onChunkLoaded
        _context = new AudioContext();
        _analyser = _context.createAnalyser();
        _analyser.fftSize = 2048;
    };

    worker.onmessage = function(event) {
        //console.log("Message received from worker:");

        _activeBuffer = event.data[0];
        _totalChunksLoaded = event.data[1];

        if (_totalChunksLoaded === 0) {
            _initializeWebAudio();
            console.log("initialized web audio");
        }

        console.log("active:", _activeBuffer)

        _context.decodeAudioData(_activeBuffer, function(buf) {
            _audioBuffer = buf;
            console.log("audio:", _audioBuffer);
            console.log(_audioBuffer.getChannelData(0));
            _play();
        });

        //else {
        /*_audioBuffer = _context.createBuffer(1, _activeBuffer.byteLength / 32, _context.sampleRate);

            console.log("active:", _activeBuffer);
            const data = new Uint8Array(_activeBuffer);
            const l = data.length;
            let out = new Float32Array(l);
            for (let i = 0; i < l; i++) {
                out[i] = (data[i] - 128) / 128.0;
            }
            _audioBuffer.copyToChannel(out, 0, 0);
            console.log(_audioBuffer.copyToChannel(out, 0, 0));
            console.log(_audioBuffer.getChannelData(0));*/

        /*console.log("active:", _activeBuffer)

            _context.decodeAudioData(_activeBuffer, function(buf) {
                _audioBuffer = buf;
                console.log("audio:", _audioBuffer);
                console.log(_audioBuffer.getChannelData(0));
                _play();
            });*/

        //console.log("AudioData decoded!", _audioBuffer)

        //_play();
        //}

    };

    let _play = function() { //used in onChunkLoaded
        let currentTime = _context.currentTime + 0.010 || 0;
        console.log("current time:", currentTime);

        //let time = currentTime;

        let scheduledTime = 0.015;

        try {
            _audioSource.stop(scheduledTime);
        } catch (e) {}

        _audioSource = _context.createBufferSource();
        _audioSource.buffer = _audioBuffer;
        _audioSource.connect(_analyser);
        _audioSource.connect(_context.destination);
        _audioSource.playbackRate.value = 1;

        ///console.log("time:", _audioBuffer.duration, currentTime, _audioBuffer.duration - currentTime ? _audioBuffer.duration : _audioBuffer.duration - currentTime);

        console.log("audiobuffer duration:", _audioBuffer.duration);

        //_audioSource.start(_context.currentTime, 0);

        console.log("time", currentTime);

        console.log("buffer start time", _audioBuffer.duration - currentTime < 0 ? 0 : scheduledTime - 0.005);
        console.log("duration param:", _audioBuffer.duration - currentTime);
        console.log("offset by", _audioBuffer.duration - currentTime < 0 ? 0 : currentTime);
        //_audioSource.start(scheduledTime - 0.005, currentTime, _audioBuffer.duration - currentTime);

        //_audioSource.start(scheduledTime - 0.005, currentTime, _audioBuffer.duration - currentTime < 0 ? _audioBuffer.duration : _audiobuffer.duration - currentTime);

        _audioSource.start(_audioBuffer.duration - currentTime < 0 ? 0 : scheduledTime - 0.005, _audioBuffer.duration - currentTime < 0 ? 0 : currentTime, _audioBuffer.duration - currentTime < 0 ? _audioBuffer.duration : _audioBuffer.duration - currentTime);
        /*_audioSource.start(_audioBuffer.duration - time < 0 ? 0 : scheduledTime - 0.005, _audioBuffer.duration - time < 0 ? 0 : time, _audioBuffer.duration - time < 0 ? _audioBuffer.duration : _audioBuffer.duration - time);*/

        //time = currentTime;

        //console.log("AudioBuffer is replaced!");
    };

    /*let _onChunkLoaded = function(_value) { //used in this.init
        console.log("Chunk loaded!");
//console.log("Chunk loaded!", _totalChunksLoaded, _activeBuffer, _value);
        if (_totalChunksLoaded === 0) {
            _initializeWebAudio();
            _activeBuffer = _value.buffer;
            ///console.log("activebuffer:", _activeBuffer);
        }
        else {
            console.log("Chunk is appended!");
///_activeBuffer = _appendBuffer(_activeBuffer, _value.buffer);

            console.log("Appending buffer!");
///console.log("activebuffer:", _activeBuffer);
        }*/

///console.log(_activeBuffer.byteLength, _context.sampleRate, "length:", _activeBuffer.byteLength / 32);
//console.log(_activeBuffer.byteLength, _context.sampleRate, "length:", _activeBuffer.byteLength / 16);
///_audioBuffer = _context.createBuffer(1, _activeBuffer.byteLength / 32, _context.sampleRate);
//_audioBuffer = _context.createBuffer(2, _activeBuffer.byteLength / 16, _context.sampleRate);

/*console.log("active:", _activeBuffer);
        const data = new Uint8Array(_activeBuffer);
        const l = data.length;
        let out = new Float32Array(l);
        for (let i = 0; i < l; i++) {
            out[i] = (data[i] - 128) / 128.0;
        }
        _audioBuffer.copyToChannel(out, 0, 0);

        console.log("AudioData decoded!", _audioBuffer);
        console.log("channel 1", _audioBuffer.getChannelData(0));

        _play();

//_totalChunksLoaded++;
    };*/
};
