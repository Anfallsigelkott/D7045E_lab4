
let webGL;
let camera;
let shaderPgm;
let canvas;

let graphicsNodes = [];
let graphicsObjects = [];
const objAmount = 20;
const objMinSize = 0.5;
const objMaxSize = 1.5;

let player;
let otherStar;

const cameraAngularVelocityStep = 0.001;
const cameraTranslationalVelocityStep = 0.001;
const angularDrag = 0.01;
const translationalDrag = 0.01;
let frameTime;
let cameraVelocityLeftRight = 0.0;
let cameraVelocityUpDown = 0.0;
let cameraVelocityForwardBackward = 0.0;
let cameraAngleLeftRight = 0.0;
let cameraAngleUpDown = 0.0;
let cameraSpeed = 0.0;

function init(){
    try {
        canvas = document.getElementById("webglcanvas");
        webGL = canvas.getContext("webgl2");
              // (Note: this page would work with "webgl2", with no further modification.)
        if ( ! webGL ) {
            throw "Browser does not support WebGL";
        }
    }
    catch (e) {
        document.getElementById("canvas-holder").innerHTML =
            "<p>Sorry, could not get a WebGL graphics context.</p>";
        return;
    }

    webGL.clearColor(0.7, 0.7, 0.7, 1.0);
    webGL.viewport(0, 0, canvas.width, canvas.height);
    webGL.enable(webGL.DEPTH_TEST);

    const vertexShader = new Shader(document.getElementById("vertex_shader").text, webGL.VERTEX_SHADER, webGL);
    const fragmentShader = new Shader(document.getElementById("fragment_shader").text, webGL.FRAGMENT_SHADER, webGL);
    shaderPgm = new ShaderProgram(vertexShader, fragmentShader, webGL);
    shaderPgm.activate();

    let eye = [0, 0, 5];
    let reference = [0, 0, 0];
    camera = new Camera(eye, reference, 1.7853981634, (canvas.width/canvas.height), 1, 100, shaderPgm, webGL);
    
    let blueMono = new MonochromeMaterial(webGL, shaderPgm, [0, 0.3, 1, 1.0]);
    let greenMono = new MonochromeMaterial(webGL, shaderPgm, [0.28, 0.74, 0.15, 1.0]);

    let playerCube = new Cuboid(webGL, 0.4, 0.2, 0.6, shaderPgm);
    let playerCone = new Cone(webGL, 1, 0.5, shaderPgm);
    let playerTorus = new Torus(webGL, 0.5/3, 0.5, shaderPgm);
    let playerCylinder = new Cylinder(webGL, 0.5, 0.7, shaderPgm);
    let playerSphere = new Sphere(webGL, 0.5, shaderPgm);
    let playerStar = new Star(webGL, 1, 0.5, 0.5, 15);
    let playerMatrix = [1,0,0,0, 0,1,0,0, 0,0,1,-1, 0,0,0,1]; // Identity matrix
    player = new GraphicsNode(playerStar, blueMono, playerMatrix, webGL, shaderPgm);

    
    let min = -1.5;
    let max = 1.5;
    let maxdepth = 5;  
    let mindepth = 2;

    let x = Math.floor(Math.random()*(max-min)+min);
    let y = Math.ceil(Math.random()*(max-min)+min);
    let z = Math.floor(Math.random()*(maxdepth-mindepth)+mindepth);
    let matrix = mat4.create();
    mat4.translate(matrix, matrix, [x, y, z]);
    otherStar = new GraphicsNode(playerStar, greenMono, matrix, webGL, shaderPgm);
    let playerGraphNode = new SceneGraphNode(player);
    let starGraphNode = new SceneGraphNode(otherStar);
    graphicsNodes.push(playerGraphNode, starGraphNode);
    starGraphNode.setParent(playerGraphNode);

    for (let i = 0 ; i < objAmount ; i++){
        let x = Math.floor(Math.random()*(max-min)+min);
        let y = Math.ceil(Math.random()*(max-min)+min);
        let z = Math.floor(Math.random()*(maxdepth-mindepth)+mindepth);
        let matrix = mat4.create();
        mat4.translate(matrix, matrix, [x, y, z]);
        //console.log(matrix);
        //let matrix = [0, 0, 0, x,   0, 0, 0, y,  0, 0, 0, z,  0, 0, -1, 4];
        //let newObject = new GraphicsNode(playerCube, greenMono, matrix, webGL);
        //graphicsObjects.push(newObject);
    }

    frameTime = performance.now();

    requestAnimationFrame(animate);
    //draw();
}

function draw() {
    webGL.clear(webGL.COLOR_BUFFER_BIT);
    shaderPgm.activate();
    //camera.update([5, 0, 5], [0, 0, 0]);

    for (let i = 0; i < graphicsObjects.length; i++) {
        graphicsObjects[i].draw();
    }
    graphicsNodes[0].updateWorldMatrix();
    player.draw();
    otherStar.draw();
    //console.log(otherStar.transform);
}

window.addEventListener("keydown", function(event) {
    let xyz = [0,0,0];
    const speed = 0.1;
    switch (event.key) {
        case "w":
            xyz[1] = xyz[1] + speed;
            break;
        case "s":
            xyz[1] = xyz[1] - speed;
            break;
        case "a":
            xyz[0] = xyz[0] - speed;
            break;
        case "d":
            xyz[0] = xyz[0] + speed;
            break;
        case "e":
            xyz[2] = xyz[2] + speed;
            break;
        case "c":
            xyz[2] = xyz[2] - speed;
            break;
        case "ArrowUp":
            cameraVelocityUpDown = cameraVelocityUpDown + cameraAngularVelocityStep;
            break;
        case "ArrowDown":
            cameraVelocityUpDown = cameraVelocityUpDown - cameraAngularVelocityStep;
            break;
        case "ArrowLeft":
            cameraVelocityLeftRight = cameraVelocityLeftRight - cameraAngularVelocityStep;
            break;
        case "ArrowRight":
            cameraVelocityLeftRight = cameraVelocityLeftRight + cameraAngularVelocityStep;
            break;
        case "PageUp":
            cameraVelocityForwardBackward = cameraVelocityForwardBackward + cameraTranslationalVelocityStep;
            break;
        case "PageDown":
            cameraVelocityForwardBackward = cameraVelocityForwardBackward - cameraTranslationalVelocityStep;
            break;
        case "End":
            cameraVelocityUpDown = 0;
            cameraVelocityLeftRight = 0;
            cameraVelocityForwardBackward = 0;
            break;

    }
    //console.log(cameraPos);
    player.update(xyz);
    //console.log(player.transform);
    console.log(cameraVelocityUpDown, cameraVelocityLeftRight, cameraVelocityForwardBackward, cameraAngleLeftRight, cameraAngleUpDown);
    draw();
});

function animate() {
    let deltaTime = performance.now() - frameTime;
    frameTime = performance.now();

    let cameraPos = camera.getEyePos();
    let cameraRef = camera.getRef();

    cameraAngleLeftRight = cameraAngleLeftRight + cameraVelocityLeftRight * deltaTime;
    cameraAngleUpDown = cameraAngleUpDown + cameraVelocityUpDown * deltaTime;

    let newEyeX = cameraVelocityForwardBackward * Math.cos(cameraAngleLeftRight) * Math.sin(cameraAngleUpDown);
    let newEyeY = cameraVelocityForwardBackward * Math.sin(cameraAngleLeftRight) * Math.sin(cameraAngleUpDown);
    let newEyeZ = cameraVelocityForwardBackward * Math.cos(cameraAngleUpDown);

    let newRefX = (cameraVelocityForwardBackward+1) * Math.cos(cameraAngleLeftRight) * Math.sin(cameraAngleUpDown);
    let newRefY = (cameraVelocityForwardBackward+1) * Math.sin(cameraAngleLeftRight) * Math.sin(cameraAngleUpDown);
    let newRefZ = (cameraVelocityForwardBackward+1) * Math.cos(cameraAngleUpDown);

    cameraRef[0] = cameraPos[0] + newRefX;
    cameraRef[1] = cameraPos[1] + newRefY;
    cameraRef[2] = cameraPos[2] + newRefZ;

    cameraPos[0] = cameraPos[0] + newEyeX;
    cameraPos[1] = cameraPos[1] + newEyeY;
    cameraPos[2] = cameraPos[2] + newEyeZ;


    camera.update(cameraPos, cameraRef);

    console.log("Eye: ", cameraPos);
    console.log("Ref: ", cameraRef);

    draw();
    requestAnimationFrame(animate);
}

window.onload = init;



