
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
//let cameraAngleLeftRight = 0.0;
///let cameraAngleUpDown = 0.0;
//let cameraSpeed = 0.0;

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
    camera = new Camera(eye, reference, 0.7853981634, (canvas.width/canvas.height), 1, 100, shaderPgm, webGL);
    
    let blueMono = new MonochromeMaterial(webGL, shaderPgm, [0, 0.3, 1, 1.0]);
    let greenMono = new MonochromeMaterial(webGL, shaderPgm, [0.28, 0.74, 0.15, 1.0]);

    let playerCube = new Cuboid(webGL, 0.2, 0.2, 0.2, shaderPgm);
    let playerCone = new Cone(webGL, 1, 0.5, shaderPgm);
    let playerTorus = new Torus(webGL, 0.5/3, 0.5, shaderPgm);
    let playerCylinder = new Cylinder(webGL, 0.5, 0.7, shaderPgm);
    let playerSphere = new Sphere(webGL, 0.5, shaderPgm);
    let playerStar = new Star(webGL, 1, 0.5, 0.5, 5);
    let playerMatrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,-1,1]; // Identity matrix
    player = new GraphicsNode(playerCone, blueMono, playerMatrix, webGL, shaderPgm);

    
    let min = -1.5;
    let max = 1.5;
    let maxdepth = 5;  
    let mindepth = 2;

    let x = Math.floor(Math.random()*(max-min)+min);
    let y = Math.ceil(Math.random()*(max-min)+min);
    let z = Math.floor(Math.random()*(maxdepth-mindepth)+mindepth);
    let matrix = mat4.create();
    mat4.translate(matrix, playerMatrix, [1, 0, 0]);
    otherStar = new GraphicsNode(playerCube, greenMono, matrix, webGL, shaderPgm);
    //playerConnNode.setLocalTransform(matrix);
    graphicsNodes.push(player);
    
    otherStar.setParent(player);
    camera.setParent(otherStar);
    //playerConnNode.setParent(playerGraphNode);
    //starGraphNode.setParent(playerGraphNode);
    
    let lightMatrix = mat4.create(); // Identity matrix + height
    mat4.translate(lightMatrix, playerMatrix, [-1, 0, 3]);
    let lightnode = new LightNode(webGL, shaderPgm, lightMatrix);
    lightnode.applyLight();

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

    player.rotateXYZ([0.01, 0, 0]);
    otherStar.rotateXYZ([0, 0.01, 0.01]);
    
    let ViewProjectionMatrix = camera.getViewProjectionMatrix();
    // Update all the world matrices
    graphicsNodes[0].updateWorldMatrix();
    // Compute matrices for rendering
    /*graphicsNodes.forEach(function(node){
        mat4.multiply(node.graphicsNode.transform, ViewProjectionMatrix, node.worldMatrix);
    });*/
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
            cameraVelocityLeftRight = cameraVelocityLeftRight + cameraAngularVelocityStep;
            break;
        case "ArrowRight":
            cameraVelocityLeftRight = cameraVelocityLeftRight - cameraAngularVelocityStep;
            break;
        case "PageUp":
            cameraVelocityForwardBackward = cameraVelocityForwardBackward - cameraTranslationalVelocityStep;
            break;
        case "PageDown":
            cameraVelocityForwardBackward = cameraVelocityForwardBackward + cameraTranslationalVelocityStep;
            break;
        case "End":
            cameraVelocityUpDown = 0;
            cameraVelocityLeftRight = 0;
            cameraVelocityForwardBackward = 0;
            break;

    }
    //console.log(cameraPos);
    player.updatexyz(xyz);
    //console.log(player.transform);
    //console.log(cameraVelocityUpDown, cameraVelocityLeftRight, cameraVelocityForwardBackward);
    draw();
});

function animate() {
    let deltaTime = performance.now() - frameTime;
    frameTime = performance.now();

    let cameraPos = camera.getEyePos();
    let cameraRef = camera.getRef();
    let cameraUp = camera.getUp();

    let cameraAngleLeftRight = cameraVelocityLeftRight * deltaTime;
    let cameraAngleUpDown = cameraVelocityUpDown * deltaTime;
    let cameraSpeed = cameraVelocityForwardBackward * deltaTime;

    // Calculate the forward-backward camera axis
    let n = [0, 0, 0];
    vec3.subtract(n, cameraPos, cameraRef); // n = eye - ref
    vec3.normalize(n, n);

    // Calculate the left-right camera axis
    let u = [0, 0, 0];
    vec3.cross(u, cameraUp, n);
    vec3.normalize(u, u);

    // Move the ref point to the origin so we can rotate it
    let newRef = [0, 0, 0];
    vec3.subtract(newRef, cameraRef, cameraPos);

    // Create a rotation transform around the left-right camera axis
    tiltRotation = mat4.create();
    mat4.rotate(tiltRotation, tiltRotation, cameraAngleUpDown, u);

    // Create a rotation transform around the up-down camera axis
    panRotation = mat4.create();
    mat4.rotate(panRotation, panRotation, cameraAngleLeftRight, cameraUp);

    // Rotate the center point by the rotation matrices
    vec3.transformMat4(newRef, newRef, tiltRotation);
    vec3.transformMat4(newRef, newRef, panRotation);

    // Translate the ref back to the camera
    vec3.add(cameraRef, newRef, cameraPos);

    // If the angle between the line-of-sight and the "up vector" is less
    // than 10 degrees or greater than 170 degrees, then rotate the
    // "up_vector" about the left-right axis.
    // cos(10 degrees) = 0.985; cos(170 degrees) = -0.985
    if (Math.abs(vec3.dot(n, cameraUp))) {
        vec3.transformMat4(cameraUp, cameraUp, tiltRotation);
    }

    // TRANSFORMATION
    // Calculate the forward-backward camera axis
    vec3.subtract(n, cameraPos, cameraRef); // n = eye - ref
    vec3.normalize(n, n);

    // Scale the vector
    vec3.scale(n, n, cameraSpeed);

    vec3.add(cameraRef, cameraRef, n);
    vec3.add(cameraPos, cameraPos, n);

    camera.update(cameraPos, cameraRef, cameraUp);

    let angularDrag = cameraAngularVelocityStep/100;
    let translationalDrag = cameraTranslationalVelocityStep/100;
    if (cameraVelocityLeftRight > 0) {
        cameraVelocityLeftRight = cameraVelocityLeftRight - angularDrag;
    } 
    if (cameraVelocityLeftRight < 0) {
        cameraVelocityLeftRight = cameraVelocityLeftRight + angularDrag;
    } 
    if (cameraVelocityUpDown > 0) {
        cameraVelocityUpDown = cameraVelocityUpDown - angularDrag;
    } 
    if (cameraVelocityUpDown < 0) {
        cameraVelocityUpDown = cameraVelocityUpDown + angularDrag;
    } 
    if (cameraVelocityForwardBackward > 0) {
        cameraVelocityForwardBackward = cameraVelocityForwardBackward - translationalDrag;
    }
    if (cameraVelocityForwardBackward < 0) {
        cameraVelocityForwardBackward = cameraVelocityForwardBackward + translationalDrag;
    }

    draw();
    requestAnimationFrame(animate);
}

window.onload = init;



