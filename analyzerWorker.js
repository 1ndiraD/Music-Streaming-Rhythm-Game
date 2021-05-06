onmessage = function(_event) {
    let audioBuffer = _event.data;
    //insert analysis here
    let analysis = audioBuffer;
    postMessage(analysis);
}
