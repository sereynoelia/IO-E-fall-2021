let video;
let pose;
let skeleton;
let angle = 0;
let history = [];
let history2 = [];
let song;
let playing = false;
let img, img2, img3;

function preload() {
    img = loadImage('assets/angry.png');
    img2 = loadImage('assets/neutral.png');
    img3 = loadImage('assets/sad.png');
}

function setup() {
    frameRate(10);
    createCanvas(innerWidth, innerHeight);
    noStroke();
    video = createCapture(VIDEO);
    video.size(width, height);

    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses)
    video.hide();

    /////////////////////////////////

    rectMode(CENTER);
    angleMode(DEGREES);

    song = createAudio('assets/assets_audio_Basquiat.mp3');

}
////////////////////////////////////////////

function modelLoaded() {
    console.log("modelLoaded function has been called so this work!!!!");
};



function gotPoses(poses) {
    //console.log(poses);
    if (poses.length > 0) {
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }

}

function draw() {

    background("black");
    //image(video, 0, 0, innerWidth, innerHeight);
    //TRESHOLD 0 is white - 1 is black
    //filter(THRESHOLD, -1);

    if (pose) {
        noFill();

        let range = innerHeight / 2 + 100;

        let d = dist(pose.leftEye.x, pose.leftEye.y, pose.rightEye.x, pose.rightEye.y);
        console.log(d);

        drawHead(pose.nose.x, pose.nose.y, d);

        for (let i = 0; i < skeleton.length; i++) {
            let a = skeleton[i][0];
            let b = skeleton[i][1];
            stroke("white");
            line(a.position.x, a.position.y, b.position.x, b.position.y);

            if (d > 200) {
                stroke("red");
                strokeWeight(10);
                drawingContext.shadowColor = 'red';
                image(img, pose.nose.x - 170, pose.nose.y - 170, d + 150, d + 150);
            }
            if (d < 200 && d > 100) {
                stroke("green");
                strokeWeight(10);
                drawingContext.shadowColor = 'green';
                image(img2, pose.nose.x - 100, pose.nose.y - 100, d + 80, d + 80);
            }
            if (d < 100) {
                stroke("blue");
                strokeWeight(10);
                drawingContext.shadowColor = 'blue';
                image(img3, pose.nose.x - 80, pose.nose.y - 80, d + 50, d + 50);
                song.play();
            } else {
                song.stop();
            }
            drawingContext.shadowBlur = 100;
            line(a.position.x, (a.position.y) - 20, b.position.x, (b.position.y) - 20);
        }
    }
}

function drawHead(x, y, d) {
    fill("white");
    ellipse(x, y, d * 2);
    drawingContext.shadowColor = 'black';
}

function playSong() {
    song.loop();
}
