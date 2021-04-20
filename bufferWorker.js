onmessage = async function(_event) {
    //console.log("Worker: Message received from main script");
    //console.log("StreamingChunksPlayer initialized!");

    const url = _event.data;
    let _totalChunksLoaded = 0;

    const response = await fetch(url);
    const reader = response.body.getReader();

    while (_totalChunksLoaded < 1001) {
        const {value, done} = await reader.read();

        //console.log("Loading chunk", _totalChunksLoaded, " ...");
        console.log("Loading ...");

        //console.log("Chunk loaded!");
        if (_totalChunksLoaded === 0) {
            _activeBuffer = value.buffer;
            _activeBufferCopy = _activeBuffer;
        }
        else if (value) {
            //console.log("Chunk is appended!");
            //let buff1 = _activeBuffer;
            //let buff2 = value.buffer;

            //console.log("Appending buffer!");
            //_activeBuffer = new Uint8Array(buff1.byteLength + buff2.byteLength);
            //_activeBuffer = _activeBuffer.buffer;


            //console.log(_activeBufferCopy, _activeBufferCopy.byteLength, (value.buffer).byteLength);
            _activeBuffer = new Uint8Array(_activeBufferCopy.byteLength + (value.buffer).byteLength);
            //console.log(_activeBuffer);
            _activeBufferCopy = new Uint8Array(_activeBufferCopy);
            _value = new Uint8Array(value.buffer);
            //console.log(_activeBufferCopy, _value);
            _activeBuffer.set(_activeBufferCopy);
            _activeBuffer.set(_value, _activeBufferCopy.byteLength);
            //console.log(_activeBuffer);
            //_activeBuffer = _activeBuffer.buffer;
            _activeBufferCopy = _activeBuffer.buffer;
        }
        else if (done){
            console.log(done);
            console.log("is done", _totalChunksLoaded);
            postMessage([_activeBufferCopy, _totalChunksLoaded]);
            break;
        }
        else {
            console.log("weird");
        }

        if (_totalChunksLoaded % 100 === 0) {
            //console.log("Worker: Posting message back to main script");
            console.log("Loading chunk", _totalChunksLoaded, " ...");
            //console.log(_activeBufferCopy);
            postMessage([_activeBufferCopy, _totalChunksLoaded]);
            //_activeBuffer = [];
        }

        /*if (done) {
            break;
        }*/

        _totalChunksLoaded++;
    }

    console.log("response fully received");
};
