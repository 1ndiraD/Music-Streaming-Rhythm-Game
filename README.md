# Music Streaming Rhythm Game

Senior capstone project by Indira Durham

Mentored by Amndeep Singh Mann

Thanks to Nathan Moore and Thodoris Tsiridis

## Installation / Running Instructions

1. Install npx
2. `npm install`
3. `watchify streamchunksplayer.js -p esmify --standalone game -o streamchunksbundle.js -v` - bundles the code and rebundles on any changes
4. `npx serve` - by default available on `localhost:5000`
5. Go to the address (example localhost:5000) and open up the console to see the output. Music should also play after a short pause to build up a buffer. Music sourced from WTJU (UVA community radio).

## Project Status

Wasn't able to finish the full game, but was able to get chunked audio to play from the stream.
Was working on music analysis before senior year ended.
