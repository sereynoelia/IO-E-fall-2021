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
    value2 = 0;

let osc1, osc2, fft;
let num, num2;
let sound;
var y = 540;
var movement;
let droneOn = false;

function setup() {

    createCanvas(1535, 1080);

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
    serial.open("/dev/tty.usbmodem142101");
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

    sound = createAudio('sound/electric.mp3');
    bg = loadImage('images/background.png');
    drone = loadImage('images/drone.png');
    drone2 = loadImage('images/drone2.png');

    movement = 0.01;

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
}


function draw() {

    background(bg);
    console.log(y);

    text(value2, 10, 10);
    textSize(14);

    if (value2 == 1) {
        droneFly();
    } else {
        sound.stop();
    }

    if (droneOn == true) {
        sound.loop();
        drone.resize(80, 50);
        image(drone, 50, y);
        if (y < 540) {
            y = 540;
            movement = 0;
        }
    }
};

function droneFly() {
    drone2.resize(80, 50);
    for (let i = 0; i < 1000; i++) {
        image(drone2, 50, y);
        y = y + movement;
        if (y > 1000) {
            movement = -0.01;
            if (y > 540) {
                droneOn = true;
            }
        }
    }
}
