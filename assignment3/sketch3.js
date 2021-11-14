var speechRec; // speech recognition object (will prompt for mic access)
let voice;
let img;
let song, song2;
let font;
let count = 0;
let color = "white";
let osc;
let playing = false;
let serial;
let latestData = "waiting for data"; // you'll use this to write incoming data to the canvas
let splitter;
let value1 = 0,
    value2 = 0,
    value3 = 0;

let osc1, osc2, osc3, fft;


function setup() {
    createCanvas(innerWidth, innerHeight);
    let lang = navigator.language || 'en-US'
    speechRec = new p5.SpeechRec('lang', gotSpeech);
    speechRec.continuous = true;
    speechRec.start();

    voice = new p5.Speech();
    voice.onLoad = voiceReady;

    function voiceReady() {
        console.log(voice.voices);
    }

    ///////////////////////////////////////////////////////////////////
    //Begin serialport library methods, this is using callbacks
    ///////////////////////////////////////////////////////////////////    

    // Instantiate our SerialPort object
    serial = new p5.SerialPort();

    // Get a list the ports available
    // You should have a callback defined to see the results
    serial.list();
    console.log("serial.list()   ", serial.list());

    /////////////////////////////////////////////////////////////////////////////
    // Assuming our Arduino is connected, let's open the connection to it
    // Change this to the name of your arduino's serial port
    serial.open("/dev/tty.usbmodem143201");
    ////////////////////////////////////////////////////////////////////////////
    // Here are the callbacks that you can register

    // When we connect to the underlying server
    serial.on('connected', serverConnected);

    // When we get a list of serial ports that are available
    serial.on('list', gotList);
    // OR
    //serial.onList(gotList);

    // When we some data from the serial port
    serial.on('data', gotData);
    // OR
    //serial.onData(gotData);

    // When or if we get an error
    serial.on('error', gotError);
    // OR
    //serial.onError(gotError);

    // When our serial port is opened and ready for read/write
    serial.on('open', gotOpen);

    font = loadFont('assets/Revla.otf');
    textFont(font);
    textSize(80);

    img = loadImage('assets/knob.png');
    song = createAudio('assets/cold.mp3');
    song2 = createAudio('assets/fire.mp3');
}

// We are connected and ready to go
function serverConnected() {
    console.log("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
    console.log("List of Serial Ports:");
    // theList is an array of their names
    for (var i = 0; i < thelist.length; i++) {
        // Display in the console
        console.log(i + " " + thelist[i]);
    }
}

// Connected to our serial device
function gotOpen() {
    console.log("Serial Port is Open");
}

// Uh oh, here is an error, let's log it
function gotError(theerror) {
    console.log(theerror);
}

// There is data available to work with from the serial port
function gotData() {
    var currentString = serial.readLine(); // read the incoming string
    trim(currentString); // remove any trailing whitespace
    if (!currentString) return; // if the string is empty, do no more
    console.log("currentString  ", currentString); // println the string
    latestData = currentString; // save it for the draw method
    console.log("latestData" + latestData); //check to see if data is coming in
    splitter = split(latestData, ','); // split each number using the comma as a delimiter
    //console.log("splitter[0]" + splitter[0]); 
    value1 = splitter[0]; //put the first sensor's data into a variable
    value2 = splitter[1];
    value3 = splitter[2];
}

function gotSpeech() {
    console.log(speechRec.resultString);
    console.log("----------------------------")
}

function draw() {

    if (value2 < 300) {
        background("blue");
        fill("#00008B");
        text("It's too cold in here!", innerWidth / 3, innerHeight / 2);
        voice.setVoice('Moira');
        voice.speak("It's too cold in here!");
        song.loop();
        song2.stop();
        push();
        for (let i = 0; i < 70; i++) {
            fill("white");
            noStroke();
            translate(i, 0);
            triangle(-20, 0, 0, 300 - (value2), 20, 0);
        }
        pop();
    }
    if (value2 > 300 && value2 < 600) {
        background("purple");
        fill("#4B0082");
        text("It's perfect in here!", innerWidth / 3, innerHeight / 2);
        voice.speak("It's perfect in here!");
        song.stop();
        song2.stop();
    }
    if (value2 > 600) {
        background("red");
        fill("#8B0000");
        text("It's too hot in here!", innerWidth / 3, innerHeight / 2);
        voice.speak("It's too hot in here!");
        song2.loop();
        song.stop();

        push();
        for (let i = 0; i < 70; i++) {
            let r = random(0, 100);
            fill("#FF8C00");
            noStroke();
            translate(i, 0);
            triangle(-50, 900, 0, 1400 - (value2 - r), 90, 900);
            fill("#FFA500");
            noStroke();
            translate(i, 0);
            triangle(-60, 900, -10, 1400 - (value2 - (100 - r)), 80, 900);

        }
        pop();
    }
    drawKnob();

}

function mousePressed() {
    count = 0;
}

function drawKnob() {
    push();
    translate(100, 100);
    rotate(radians(value2) / 2);
    imageMode(CENTER);
    image(img, 0, 0);
    pop();
}
