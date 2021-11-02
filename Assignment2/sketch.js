//Grab body part x,y locations from Posenet, put into an array, call a function to draw those points, to make trails   


let video;
let pose;
let skeleton;
let angle = 0;
let history = [];
let history2 = [];

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

    background(255, 204, 0);
    //image(video, 0, 0, innerWidth, innerHeight);
    //TRESHOLD 0 is white - 1 is black
    //filter(THRESHOLD, -1);

    if (pose) {
        //noStroke();
        noFill();

        let d = dist(pose.leftEye.x, pose.leftEye.y, pose.rightEye.x, pose.rightEye.y);

        drawHead(pose.nose.x, pose.nose.y, d);
        drawEyes(pose.leftEye.x, pose.leftEye.y, d);
        drawEyes(pose.rightEye.x, pose.rightEye.y, d);

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

        console.log(history);

        for (let i = 0; i < history.length - 1; i++) {
            drawHand(history[i].x, history[i].y);
            drawHand2(history2[i].x, history2[i].y);
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

function drawHand(x, y) {
    fill("#9ACD32");
    stroke("#6B8E23");
    ellipse(x, y, 60);
    fill(255, 204, 0);
    ellipse(x, y, 30);
}

function drawHand2(x, y) {
    fill("#CD5C5C");
    stroke("#A52A2A");
    ellipse(x, y, 100);
}

function drawHead(x, y, d) {
    fill("yellow");
    stroke("#FF8C00");
    ellipse(x, y, d * 2);
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = 'black';
}

function drawEyes(x, y, d) {
    fill("black");
    stroke("black");
    ellipse(x - 30, y + 25, d / 4);
}
