let MP3ChunksPlayer = function() {

  EventTarget.call(this);

  let _self = this;
  let _activeBuffer;
  let _totalChunksLoaded = 0;
  let _context;
  let _audioBuffer;
  let _audioSource;
  let _analyser;
  let _request = new XMLHttpRequest();

  let _files = [
    'xa',
    'xb',
    'xc',
    'xd',
    'xe',
    'xf',
    'xg',
    'xh',
    'xi',
    'xj',
    'xk',
    'xl',
    'xm',
    'xn',
    'xo',
    'xp',
    'xq',
    'xr',
    'xs',
    'xt',
    'xu',
    'xv',
    'xw',
    'xx',
    'xy'];

  let _appendBuffer = function(buffer1, buffer2) {
    let tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    let buff1 = new Uint8Array(buffer1);
    let buff2 = new Uint8Array(buffer2);
    tmp.set(buff1, 0);
    tmp.set(buff2, buffer1.byteLength);
    return tmp.buffer;
  };

  let _initializeWebAudio = function() {
    _context = new AudioContext();
    _analyser = _context.createAnalyser();
    _analyser.fftSize = 2048;
  };

  let _play = function() {
    let scheduledTime = 0.015;

    try {
      _audioSource.stop(scheduledTime);
    } catch (e) {}

    _audioSource = _context.createBufferSource();
    _audioSource.buffer = _audioBuffer;
    _audioSource.connect(_analyser);
    _audioSource.connect(_context.destination);
    let currentTime = _context.currentTime + 0.010 || 0;
    _audioSource.start(scheduledTime - 0.005, currentTime, _audioBuffer.duration - currentTime);
    _audioSource.playbackRate.value = 1;
    console.log("AudioBuffer is replaced!");
  };

  let _onChunkLoaded = function() {
    console.log("Chunk loaded!");
    if (_totalChunksLoaded === 0) {
      _initializeWebAudio();
      _activeBuffer = _request.response;
    } else {
      console.log("Chunk is appended!");
      _activeBuffer = _appendBuffer(_activeBuffer, _request.response);
    }

    _context.decodeAudioData(_activeBuffer, function(buf) {
      console.log("AudioData decoded!");
      _audioBuffer = buf;
      _play();
    });

    _totalChunksLoaded++;
    if (_totalChunksLoaded < _files.length) {
      setTimeout(function() {
        _loadChunk(_totalChunksLoaded);
      }, 3000);
    }
  };

  let _loadChunk = function(index) {
    console.log("Loading chunk ", _files[index], " !");
    //_self.trigger('message', ['Loading chunk', _files[index], '...']);
    _request.open('GET', 'chunks/' + _files[index], true);
    _request.send();
  };

  this.init = function() {
    console.log("MP3ChunksPlayer initialized!");

    _request.responseType = 'arraybuffer';
    _request.addEventListener('load', _onChunkLoaded, false);

    _loadChunk(_totalChunksLoaded);

    return this;
  };
};
