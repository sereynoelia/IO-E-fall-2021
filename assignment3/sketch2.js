var speechRec; // speech recognition object (will prompt for mic access)
let song, song2, song3;
let playing = false;
let voice;
let img;
let word;
let font;
let count = 0;
let color = "white";

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

    song = createAudio('assets/pop.mp3');
    song2 = createAudio('assets/jazz.mp3');
    song3 = createAudio('assets/rock.mp3');
    font = loadFont('assets/Revla.otf');
    textFont(font);
    textSize(80);
}

function gotSpeech() {
    console.log(speechRec.resultString);
    console.log("----------------------------")
}

function draw() {
    background(color);

    fill("#DCDCDC");
    rect(innerWidth / 2, 0, innerWidth, innerHeight);

    fill("black");
    text("Queue:", 50, 80);
    text(speechRec.resultString, 100 + count, innerHeight / 2);

    count += 2;

    if (speechRec.resultString == "pop" && count > 650 || speechRec.resultString == "Pop" && count > 650) {
        fill("black");
        rect(innerWidth / 2, 0, innerWidth, innerHeight);
        color = "#FF69B4";
        song.loop();
    }
    if (speechRec.resultString == "jazz" && count > 650 || speechRec.resultString == "Jazz" && count > 650) {
        fill("black");
        rect(innerWidth / 2, 0, innerWidth, innerHeight);
        color = "#6A5ACD";
        song2.loop();
    }
    if (speechRec.resultString == "rock" && count > 650 || speechRec.resultString == "Rock" && count > 650) {
        fill("black");
        rect(innerWidth / 2, 0, innerWidth, innerHeight);
        color = "#A52A2A";
        song3.loop();
    }
    if (speechRec.resultString == "stop") {
        song.stop();
        song2.stop();
        song3.stop();
    }
}

function mousePressed() {
    count = 0;
    song.stop();
    song2.stop();
    song3.stop();
}
