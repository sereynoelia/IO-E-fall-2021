//Grab body part x,y locations from Posenet, put into an array, call a function to draw those points, to make trails   


let video;
let pose;
let skeleton;
let angle = 0;
let history = [];
let history2 = [];
let song;
let playing = false;

function setup() {
    frameRate(10);
    createCanvas(innerWidth, innerHeight);
    noStroke();
    video = createCapture(VIDEO);
    video.size(width, height);

    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses)
    //img1 = loadImage('images/hand2.svg');
    img2 = loadImage('images/face.svg');
    video.hide();

    /////////////////////////////////

    rectMode(CENTER);
    angleMode(DEGREES);

    song = createAudio('assets/assets_sounds_confetti.mp3');

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

    background("#98FB98");
    //image(video, 0, 0, innerWidth, innerHeight);
    //TRESHOLD 0 is white - 1 is black
    //filter(THRESHOLD, -1);

    if (pose) {
        noFill();

        let range = innerHeight / 2 + 100;

        if (pose.rightWrist.y < range) {
            background("black");
            playSong();
            console.log(pose.rightWrist.x, range);
        } else {
            song.stop();
        }

        fill("white");
        rect(0, innerHeight / 2 + 100, 4000, innerHeight / 6);

        let d = dist(pose.leftEye.x, pose.leftEye.y, pose.rightEye.x, pose.rightEye.y);

        drawHead(pose.nose.x, pose.nose.y, d);
        drawEar(pose.rightEar.x, pose.rightEar.y);
        drawEar(pose.leftEar.x, pose.leftEar.y);

        let v = createVector(pose.rightWrist.x, pose.rightWrist.y);
        let v2 = createVector(pose.leftWrist.x, pose.leftWrist.y);

        history.push(v);
        let rightHand = history[history.length - 1].copy();
        history.push(rightHand);
        history.shift();

        history2.push(v2);
        let leftHand = history2[history2.length - 1].copy();
        history2.push(leftHand);
        history2.shift();

        for (let i = 0; i < history.length - 1; i++) {
            let r = random(255);
            let g = random(255);
            let b = random(255);
            drawHand(history[i].x, history[i].y, r, g, b);
        }
        for (let i = 0; i < history2.length - 1; i++) {
            let r = random(255);
            let g = random(255);
            let b = random(255);
            drawHand(history2[i].x, history2[i].y, r, g, b);
        }

        /*for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            strokeWeight(2);
            stroke(255);
            fill("#FF8C00");
            ellipse(x, y, 10, 10);

            for (let i = 0; i < skeleton.length; i++) {
                let a = skeleton[i][0];
                let b = skeleton[i][1];
                line(a.position.x, a.position.y, b.position.x, b.position.y);
            }
        }*/
    }

}

function drawHand(x, y, r, g, b) {
    fill(r, g, b);
    ellipse(x, y, 40);
}

function drawHead(x, y, d) {
    fill("#AFEEEE");
    stroke("#48D1CC");
    ellipse(x, y, d * 2);
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = 'black';
}

function drawEar(x, y) {
    fill("#48D1CC");
    stroke("#00CED1");
    ellipse(x, y, 70, 80);
}

function playSong() {
    song.loop();
}
