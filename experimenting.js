console.log("candy canes");

const context = require("audio-context");
const Generator = require("audio-generator");
const {Readable, Writable} = require("web-audio-stream/stream");
const arrayBufferToAudioBuffer = require("arraybuffer-to-audiobuffer");

let ctx = context();

fetch("https://streams.wtju.net:8443/wtju-opus-256.ogg").then((response) =>
    {
        const reader = response.body.getReader();
        const stream = new ReadableStream(
            {
                start(controller)
                {
                    let i = 0;
                    function push() //function handles each data chunk
                    {
                        //console.log("gingerbread man");

                        reader.read().then(async ({done, value}) => //done is boolean, value is Uint8Array
                            {
                                let arrayBuffer = value.buffer;
                                console.log(value, arrayBuffer);

                                let audioBuffer = await arrayBufferToAudioBuffer(arrayBuffer);
                                console.log(audioBuffer);

                                /*let writable = Writable(ctx.destination,
                                    {
                                        context: ctx,
                                        channels: 2,
                                        sampleRate: ctx.sampleRate,

                                        mode: Writable.BUFFER_MODE,

                                        autoend: true
                                    });

                                //console.log(writable);

                                let src = Generator(function (time)
                                    {
                                        return Math.sin(Math.PI * 2 * time * 440)
                                    });
                                src.pipe(writable);

                                //console.log(src);

                                if (done) //no more data to read?
                                {
                                    controller.close(); //finished sending data - tell browser
                                    return;
                                }
                                controller.enqueue(value); //get data and send to browser via controller*/
                                if (i < 10)
                                {
                                    console.log("finished iteration", i);
                                    i++;
                                    push();
                                }
                                //push();
                            }).catch((err) => {
                                console.error("Error - Read");
                                console.error(err);
                                });
                    };
                    push();
                }
            });
        return new Response(stream, {header: {"Content-Type": "text/html"}});
    }).catch((err) => {
        console.error("Error - Entirety");
        console.error(err);
        });
