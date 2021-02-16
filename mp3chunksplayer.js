let MP3ChunksPlayer = function() {
    EventTarget.call(this);

    let _self = this;

    let _activeBuffer;
    let _totalChunksLoaded = 0;
    let _context;
    let _audioBuffer;
    let _audioSource;
    let _analyser;
    let _request = fetch("https://streams.wtju.net:8443/wtju-opus-256.ogg");

    let _appendBuffer = function(buffer1 ,buffer2) {
        let tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        let buff1 = new Uint8Array(buffer1);
        let buff2 = new Uint8Array(buffer2);
        tmp.set(buff1, 0);
        tmp.set(buff2, buffer1.byteLength);
        return tmp.buffer;
    };

    let _intitializeWebAudio = function() {
        _context = new AudiContext();
        _analyser = _context.createAnalyser();
        _analyser.fftSize = 2048;
    };

    let _play = function() {
        let scheduledTime = 0.015;

        try {
            _audioSource.stop(shceduledTime);
        }
        catch (e) {}

        _audioSource = _context.createBufferSource();
        _audioSource.buffer = _audioBuffer;
        _audioSource.connect(_analyser);
        _audioSource.connect(_context.destination);
        let currentTime = _context.currentTime + 0.010 || 0;
        _audioSource.start(scheduledTime = 0.005, currentTime, _audioBuffer.duration - currentTime);
        _audioSource.playbackRate.value = 1;
        console.log("AudioBuffer is replaced!");
    };

    let _onChunkLoaded = function() {
        console.log("Chunk loaded!");
        if (_totalChunksLoaded === 0) {
            _initializeWebAudio();
            _activeBuffer = _request.response;
        }
        else {
            console.log("chunk is appended!");
            _activeBuffer = _appendBuffer(_activeBuffer, request.response);
        }

        _context.decodeAudioData(_activeBuffer, function(buf) {
            console.log("AudioData decoded!");
            _audioBuffer = buf;
            _play();
        });

        if (_totalChunksLoaded === 0) {
            _self.trigger("play");
        }

        _totalChunksLoaded++;
        if (_totalChunksLoaded < files.length) {
            setTimeout(function() {
                _loadChunk(_totalChunksLoaded);
            }, 3000);
        }
    };

    let _loadChunk = function(index) {
        console.log("Loading chunk!");
        //fetch?
    };

    this.init = function() {
        console.log("MP3ChunksPlayer initialized!");

        //fetch?

        _loadChunk(_totalChunksLoaded);

        return this;
    };
};
