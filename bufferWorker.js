onmessage = async function(_event) {
    const url = _event.data;
    let _totalChunksLoaded = 0;

    const response = await fetch(url);
    const reader = response.body.getReader();

    while (_totalChunksLoaded < 301) {
        const {value, done} = await reader.read();

        console.log("Loading ...");

        if (_totalChunksLoaded === 0) {
            _activeBuffer = value.buffer;
            _activeBufferCopy = _activeBuffer;
        }
        else if (value) {
            _activeBuffer = new Uint8Array(_activeBufferCopy.byteLength + (value.buffer).byteLength);
            _activeBufferCopy = new Uint8Array(_activeBufferCopy);
            _value = new Uint8Array(value.buffer);

            _activeBuffer.set(_activeBufferCopy);
            _activeBuffer.set(_value, _activeBufferCopy.byteLength);

            _activeBufferCopy = _activeBuffer.buffer;
        }
        else if (done) {
            console.log(done);
            console.log("is done", _totalChunksLoaded);
            postMessage([_activeBufferCopy, _totalChunksLoaded]);
            break;
        }
        else {
            console.log("weird");
        }

        if (_totalChunksLoaded === 100 || (_totalChunksLoaded > 100 && _totalChunksLoaded % 2 === 0)) {
            console.log("Loading chunk", _totalChunksLoaded, "...");
            postMessage([_activeBufferCopy, _totalChunksLoaded]);
        }

        _totalChunksLoaded++;
    }

    console.log("response fully received");
};
