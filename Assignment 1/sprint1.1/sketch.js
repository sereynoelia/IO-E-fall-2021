/* 
This sketch uses a lot of code that was written by Doug Whitton that I'm not entirely sure I understand, 
but that is necessary in connecting the Arduino to a live browser.

I've added some basic graphics and sounds to the code, the potentionmeter and the light sensor are used to change the colour of the background while the button draws an "explosion" of circles.
*/

let osc;
let playing = false;
let serial;
let latestData = "waiting for data"; // you'll use this to write incoming data to the canvas
let splitter;
let value1 = 0,
    value2 = 0,
    value3 = 0;

let osc1, osc2, osc3, fft;

let song, song2;
let num, num2, num3;

function setup() {

    createCanvas(windowWidth, windowHeight);

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
    // OR
    //serial.onOpen(gotOpen);

    // Callback to get the raw data, as it comes in for handling yourself
    //serial.on('rawdata', gotRawData);
    // OR
    //serial.onRawData(gotRawData);

    song = createAudio('assets/assets_sounds_bubbles.mp3');
    song2 = createAudio('assets/assets_sounds_veil.mp3');

}
////////////////////////////////////////////////////////////////////////////
// End serialport callbacks
///////////////////////////////////////////////////////////////////////////

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

// We got raw data from the serial port
function gotRawData(thedata) {
    println("gotRawData" + thedata);
}

// Methods available
// serial.read() returns a single byte of data (first in the buffer)
// serial.readChar() returns a single char 'A', 'a'
// serial.readBytes() returns all of the data available as an array of bytes
// serial.readBytesUntil('\n') returns all of the data available until a '\n' (line break) is encountered
// serial.readString() retunrs all of the data available as a string
// serial.readStringUntil('\n') returns all of the data available as a string until a specific string is encountered
// serial.readLine() calls readStringUntil with "\r\n" typical linebreak carriage return combination
// serial.last() returns the last byte of data from the buffer
// serial.lastChar() returns the last byte of data from the buffer as a char
// serial.clear() clears the underlying serial buffer
// serial.available() returns the number of bytes available in the buffer
// serial.write(somevar) writes out the value of somevar to the serial device


function draw() {
    if (value3 > 1) {
        background(50, 205, value2);
    }
    if (value3 < 1) {
        background(0, 0, 0);
        playVeil();
    }
    //text(latestData, 10, 10);
    textSize(14);
    text("click mouse first to activate sound!", windowWidth / 2 - 75, 10);
    playBubbles();
}

function playBubbles() {
    if (value1 == 1) {
        song.loop();
        drawBoom();
    }
    if (value1 == 0) {
        song.stop();
    }
};

function playVeil() {
    song2.loop();
    fill(255);
    textSize(40);
    textAlign(CENTER);
    text("Hey! Who turned off the lights?", windowWidth / 2, windowHeight / 2);
};

function drawBoom() {
    for (let i = 0; i < 10; i++) {
        num = Math.floor(Math.random() * windowWidth + 50);
        num2 = Math.floor(Math.random() * windowHeight) + 50;
        num3 = Math.floor(Math.random() * 100) + 10;
        fill(100, 100 + num2, 100 + num);
        noStroke();
        circle(num, num2, num3);
    }
};
