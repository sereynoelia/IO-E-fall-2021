// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

let video;
let poseNet;
//let poses = [];
let pose;
let skeleton;
var speechRec; // speech recognition object (will prompt for mic access)
let voice;
let img;
let font;
let count = 0;
let color = "white";

function setup() {
    createCanvas(innerWidth, innerHeight);
    video = createCapture(VIDEO);
    video.size(width, height);

    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses)
    video.hide();

    let lang = navigator.language || 'en-US'
    speechRec = new p5.SpeechRec('lang', gotSpeech);
    speechRec.continuous = true;
    speechRec.start();

    voice = new p5.Speech();
    voice.onLoad = voiceReady;

    function voiceReady() {
        console.log(voice.voices);
    }

    img = loadImage('assets/asset1.png');
    font = loadFont('assets/Revla.otf');
    textFont(font);
    textSize(80);
}


function modelReady() {
    select('#status').html('Model Loaded');
}

function modelLoaded() {
    console.log("modelLoaded function has been called so this work!!!!");
}

function gotPoses(poses) {
    console.log(poses);
    if (poses.length > 0) {
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }
}

function gotSpeech() {
    console.log(speechRec.resultString);
    console.log("----------------------------")
}

function draw() {
    background(color);
    if (pose) {
        strokeWeight(2);
        let d = dist(pose.leftEye.x, pose.leftEye.y, pose.rightEye.x, pose.rightEye.y);
        let r = random(0, 5);
        let r2 = random(0, 5);

        if (speechRec.resultString == "blue") {
            color = "#6495ED";
            fill(255, 255, 255);
            text("blue?", 100, 100);
            if (count > 100) {
                speechRec.resultString = "clear";
                voice.stop();
            } else {
                sayBlue();
            }
        }
        if (speechRec.resultString == "red") {
            color = "#B22222";
            fill(255, 255, 255);
            text("red?", 100, 100);
            if (count > 200) {
                speechRec.resultString = "clear";
                voice.stop();
            } else {
                sayRed();
            }
        }
        if (speechRec.resultString == "green") {
            color = "#3CB371";
            fill(255, 255, 255);
            text("green?", 100, 100);
            if (count > 300) {
                speechRec.resultString = "clear";
                voice.stop();
            } else {
                sayGreen();
            }
        }
        if (speechRec.resultString == "stop") {
            voice.stop();
        }

        drawBody(pose.nose.x, pose.nose.y, d);
        drawHI(pose.nose.x, pose.nose.y, r, r2);
        count += 0.5;
        //console.log(count);
    }
}

function drawBody(x, y, d) {
    fill("white");
    noStroke();
    image(img, x, y);
    if (speechRec.resultString == "bigger") {
        img.resize(800, 0);
    }
    if (speechRec.resultString == "smaller") {
        img.resize(200, 0);
    }
}

function drawHI(x, y, r, r2) {
    if (speechRec.resultString == "hello") {
        fill("white");
        textSize(80);
        text("Hi!", x + r, y + r2);
    }
}

function sayBlue() {
    voice.setVoice('Kyoko');
    voice.speak("blue?");
}

function sayRed() {
    voice.setVoice('Alice');
    voice.speak("red?");
}

function sayGreen() {
    voice.setVoice('Fiona');
    voice.speak("green?");
}
