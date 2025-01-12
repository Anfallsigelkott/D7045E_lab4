
let webGL;
let camera;
let shaderPgm;
let canvas;

let graphicsNodes = [];
let graphicsObjects = [];
const objAmount = 20;
const objMinSize = 0.5;
const objMaxSize = 1.5;

let worldNode;
let player;
let otherStar;
let playerNode;
let cubeNode;
let iceCreamConeNode;
let iceCreamRotationNode;
let iceCreamStar;

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

let coneLateralPosition = 0.0;
let coneLateralSpeed = 0.01;
let starScale = 1.0;
let starScaleSpeed = 0.01;

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

    webGL.clearColor(0.2, 0.2, 0.2, 1.0);
    webGL.viewport(0, 0, canvas.width, canvas.height);
    webGL.enable(webGL.DEPTH_TEST);

    const vertexShader = new Shader(document.getElementById("vertex_shader").text, webGL.VERTEX_SHADER, webGL);
    const fragmentShader = new Shader(document.getElementById("fragment_shader").text, webGL.FRAGMENT_SHADER, webGL);
    shaderPgm = new ShaderProgram(vertexShader, fragmentShader, webGL);
    shaderPgm.activate();

    let eye = [0, 3, 5];
    let reference = [0, 0, 0];
    camera = new Camera(eye, reference, 0.7853981634, (canvas.width/canvas.height), 1, 100, shaderPgm, webGL);
    
    let blueMono = new MonochromeMaterial(webGL, shaderPgm, [0, 0.3, 1, 1.0]);
    let greenMono = new MonochromeMaterial(webGL, shaderPgm, [0.28, 0.74, 0.15, 1.0]);

    let playerCube = new Cuboid(webGL, 0.2, 0.2, 0.2, shaderPgm);
    let playerCone = new Cone(webGL, 1, 0.5, false, shaderPgm);
    let playerTorus = new Torus(webGL, 0.5/3, 0.5, shaderPgm);
    let playerCylinder = new Cylinder(webGL, 0.5, 0.7, shaderPgm);
    let playerSphere = new Sphere(webGL, 0.5, shaderPgm);
    let playerStar = new Star(webGL, 1, 0.5, 0.5, 5);
    let playerMatrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; // Identity matrix
    //mat4.translate(playerMatrix, playerMatrix, [0, 0, -1]);
    player = new GraphicsNode(playerCone, blueMono, mat4.create(), webGL, shaderPgm);

    worldNode = new SceneGraphNode(mat4.create());
    playerNode = new SceneGraphNode(playerMatrix);
    
    let min = -1.5;
    let max = 1.5;
    let maxdepth = 5;  
    let mindepth = 2;

    let x = Math.floor(Math.random()*(max-min)+min);
    let y = Math.ceil(Math.random()*(max-min)+min);
    let z = Math.floor(Math.random()*(maxdepth-mindepth)+mindepth);
    let matrix = mat4.create();
    mat4.translate(matrix, playerMatrix, [1, 0, 0]);
    otherStar = new GraphicsNode(playerCube, greenMono, mat4.create(), webGL, shaderPgm);
    otherStar.scaleXYZ([1, 1, 5]);
    player.scaleXYZ([5, 1, 1]);
    
    cubeNode = new SceneGraphNode(matrix);
    
    graphicsNodes.push(worldNode);
    
    cubeNode.setParent(playerNode);
    playerNode.setParent(worldNode);
    player.setParent(playerNode);
    otherStar.setParent(cubeNode);

    playerNode.updatexyz([0, 0, -1]);
    camera.setParent(worldNode);
    //playerConnNode.setParent(playerGraphNode);
    //starGraphNode.setParent(playerGraphNode);
    
    let lightMatrix = mat4.create(); // Identity matrix + height
    mat4.translate(lightMatrix, playerMatrix, [-2, 6, 4]);
    let lightnode = new LightNode(webGL, shaderPgm, lightMatrix);
    lightnode.applyLight();
    lightnode.setParent(worldNode);

    frameTime = performance.now();
    settingTheScene();
    requestAnimationFrame(animate);
    //draw();
}

function settingTheScene() {
    let floorTile = new Cuboid(webGL, 0.1, 1, 1, shaderPgm);
    let parentNode = new SceneGraphNode(); // Node to attach objects to
    parentNode.setParent(worldNode);
    graphicsNodes.push(graphicsObjects);
    let defaultMatrix = mat4.create();

    let whiteMono = new MonochromeMaterial(webGL, shaderPgm, [1.0, 1.0, 1.0, 1.0]);
    let grayMono = new MonochromeMaterial(webGL, shaderPgm, [0.0, 0.0, 0.0, 1.0]);
    let wallMonoButBetter = new MonochromeMaterial(webGL, shaderPgm, [0.3, 0.7, 0.3, 1.0]);
    let purple = new MonochromeMaterial(webGL, shaderPgm, [138/255, 43/255, 226/255, 1.0]);
    let forestGreen = new MonochromeMaterial(webGL, shaderPgm, [34/255, 139/255, 34/255, 1.0]);
    let navyBlue = new MonochromeMaterial(webGL, shaderPgm, [0.0, 0.0, 128/255, 1.0]);
    let yellow = new MonochromeMaterial(webGL, shaderPgm, [1.0, 1.0, 0.0, 1.0]);
    let red = new MonochromeMaterial(webGL, shaderPgm, [220/255, 20/255, 60/255, 1.0]);
    let iceCreamConeColour = new MonochromeMaterial(webGL, shaderPgm, [208/255, 190/255, 157/255, 1.0]);
    let iceCreamColour1 = new MonochromeMaterial(webGL, shaderPgm, [229/255, 214/255, 150/255, 1.0]);
    let iceCreamColour2 = new MonochromeMaterial(webGL, shaderPgm, [246/255, 135/255, 197/255, 1.0]);
    let iceCreamColour3 = new MonochromeMaterial(webGL, shaderPgm, [221/255, 221/255, 221/255, 1.0]);

    let torusMesh = new Torus(webGL, 0.25, 0.5, shaderPgm);
    let torus = new GraphicsNode(torusMesh, yellow, mat4.create(), webGL, shaderPgm);
    torus.setParent(parentNode);
    torus.updatexyz([3, 0.2, 3]);
    torus.rotateXYZ([Math.PI/2, 0.0, 0.0]);
    graphicsObjects.push(torus);

    let cubeMesh = new Cuboid(webGL, 0.5, 0.5, 0.5, shaderPgm);
    let cube = new GraphicsNode(cubeMesh, red, mat4.create(), webGL, shaderPgm);
    cube.setParent(parentNode);
    cube.updatexyz([3, 0.5, 0]);
    graphicsObjects.push(cube);

    let coneMesh = new Cone(webGL, 0.6, 0.4, false, shaderPgm);
    let cone = new GraphicsNode(coneMesh, navyBlue, mat4.create(), webGL, shaderPgm);
    cone.setParent(parentNode);
    cone.updatexyz([3, 0.5, -3]);
    cone.rotateXYZ([-Math.PI/2, 0.0, 0.0]);
    graphicsObjects.push(cone);

    let sphereMesh = new Sphere(webGL, 0.5, shaderPgm);
    let sphere = new GraphicsNode(sphereMesh, purple, mat4.create(), webGL, shaderPgm);
    sphere.setParent(parentNode);
    sphere.updatexyz([0, 0.5, -3]);
    graphicsObjects.push(sphere);

    let cylinderMesh = new Cylinder(webGL, 0.5, 1, shaderPgm);
    let cylinder = new GraphicsNode(cylinderMesh, forestGreen, mat4.create(), webGL, shaderPgm);
    cylinder.setParent(parentNode);
    cylinder.updatexyz([-3, 0.5, 3]);
    cylinder.rotateXYZ([-Math.PI/2, 0.0, 0.0]);
    graphicsObjects.push(cylinder);

    // --------- Ice cream maker

    let iceCreamConeMesh = new Cone(webGL, 1.2, 0.6, true, shaderPgm);
    let iceCreamCone = new GraphicsNode(iceCreamConeMesh, iceCreamConeColour, mat4.create(), webGL, shaderPgm);
    iceCreamConeNode = new SceneGraphNode(mat4.create());
    iceCreamConeNode.setParent(parentNode);
    iceCreamCone.setParent(iceCreamConeNode);
    iceCreamConeNode.updatexyz([0.0, 1.0, 0.0]);
    iceCreamCone.rotateXYZ([Math.PI/2, 0.0, 0.0]);
    iceCreamRotationNode = new SceneGraphNode(mat4.create());
    iceCreamRotationNode.updatexyz([0.0, 0.72, 0.0]); // This will rotate around the Y axis.
    iceCreamRotationNode.setParent(iceCreamConeNode);
    let iceCreamOrbMesh = new Sphere(webGL, 0.33, shaderPgm);
    let firstOrb = new GraphicsNode(iceCreamOrbMesh, iceCreamColour1, mat4.create(), webGL, shaderPgm);
    let secondOrb = new GraphicsNode(iceCreamOrbMesh, iceCreamColour2, mat4.create(), webGL, shaderPgm);
    let thirdOrb = new GraphicsNode(iceCreamOrbMesh, iceCreamColour3, mat4.create(), webGL, shaderPgm);
    firstOrb.setParent(iceCreamRotationNode);
    firstOrb.updatexyz([-0.2, 0.0, 0.2]);
    secondOrb.setParent(iceCreamRotationNode);
    secondOrb.updatexyz([0.2, 0.0, 0.2]);
    thirdOrb.setParent(iceCreamRotationNode);
    thirdOrb.updatexyz([0.0, 0.0, -0.2]);
    let iceCreamStarMesh = new Star(webGL, 0.5, 0.25, 0.3, 5);
    iceCreamStar = new GraphicsNode(iceCreamStarMesh, red, mat4.create(), webGL, shaderPgm);
    iceCreamStar.setParent(iceCreamRotationNode);
    iceCreamStar.updatexyz([0.0, 0.5, 0.0]);
    graphicsObjects.push(iceCreamCone, firstOrb, secondOrb, thirdOrb, iceCreamStar);


    // --------- Building the stage
    for (let i = 0 ; i < 8 ; i++) {
        let cubeZcoord = -3.5 + 1*i;
        for (let j = 0 ; j < 8 ; j++) {
            let cubeXcoord = -3.5 + 1*j;
            let tileMatrix = mat4.create();
            let materialToUse = grayMono;
            if ( j % 2 == i % 2 ) {
                materialToUse = whiteMono;
            }
            let newObject = new GraphicsNode(floorTile, materialToUse, tileMatrix, webGL, shaderPgm);
            newObject.setParent(parentNode);
            newObject.updatexyz([cubeXcoord, 0, cubeZcoord]);
            graphicsObjects.push(newObject);
            //console.log("generates new object at: ", cubeXcoord, ", 0, ", cubeZcoord);
        }
    }

    let outerWallMesh = new Cuboid(webGL, 1.0, 0.1, 8.0, shaderPgm);
    let innerWallMesh = new Cuboid(webGL, 1.0, 0.1, 1.0, shaderPgm);


    let leftOuterWall = new GraphicsNode(outerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    leftOuterWall.setParent(parentNode);
    leftOuterWall.updatexyz([-4.0, 0.4, 0.0]);
    leftOuterWall.rotateXYZ([0.0, Math.PI/2, 0.0])
    graphicsObjects.push(leftOuterWall);

    let rightOuterWall = new GraphicsNode(outerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    rightOuterWall.setParent(parentNode);
    rightOuterWall.updatexyz([4.0, 0.4, 0.0]);
    rightOuterWall.rotateXYZ([0.0, Math.PI/2, 0.0])
    graphicsObjects.push(rightOuterWall);
    
    let upOuterWall = new GraphicsNode(outerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    upOuterWall.setParent(parentNode);
    upOuterWall.updatexyz([0.0, 0.4, -4.0]);
    graphicsObjects.push(upOuterWall);

    let downOuterWall = new GraphicsNode(outerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    downOuterWall.setParent(parentNode);
    downOuterWall.updatexyz([0.0, 0.4, 4.0]);
    graphicsObjects.push(downOuterWall);

    let inner1 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner1.setParent(parentNode);
    inner1.updatexyz([-1, 0.4, -3.5]);
    inner1.rotateXYZ([0.0, Math.PI/2, 0.0]);
    graphicsObjects.push(inner1);
    let inner2 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner2.setParent(parentNode);
    inner2.updatexyz([-1, 0.4, -2.5]);
    inner2.rotateXYZ([0.0, Math.PI/2, 0.0]);
    graphicsObjects.push(inner2);
    let inner3 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner3.setParent(parentNode);
    inner3.updatexyz([-0.5, 0.4, -2]);
    //inner3.rotateXYZ(0.0, Math.PI/2, 0.0);
    graphicsObjects.push(inner3);
    let inner4 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner4.setParent(parentNode);
    inner4.updatexyz([0.5, 0.4, -2]);
    //inner4.rotateXYZ(0.0, Math.PI/2, 0.0);
    graphicsObjects.push(inner4);
    let inner5 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner5.setParent(parentNode);
    inner5.updatexyz([2, 0.4, -3.5]);
    inner5.rotateXYZ([0.0, Math.PI/2, 0.0]);
    graphicsObjects.push(inner5);
    let inner6 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner6.setParent(parentNode);
    inner6.updatexyz([2, 0.4, -2.5]);
    inner6.rotateXYZ([0.0, Math.PI/2, 0.0]);
    graphicsObjects.push(inner6);
    let inner7 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner7.setParent(parentNode);
    inner7.updatexyz([-2, 0.4, -1.5]);
    graphicsObjects.push(inner7);
    inner7.rotateXYZ([0.0, Math.PI/2, 0.0]);
    let inner8 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner8.setParent(parentNode);
    inner8.updatexyz([-2, 0.4, -0.5]);
    inner8.rotateXYZ([0.0, Math.PI/2, 0.0]);
    graphicsObjects.push(inner8);
    let inner9 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner9.setParent(parentNode);
    inner9.updatexyz([2, 0.4, -0.5]);
    inner9.rotateXYZ([0.0, Math.PI/2, 0.0]);
    graphicsObjects.push(inner9);
    let inner10 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner10.setParent(parentNode);
    inner10.updatexyz([2, 0.4, 0.5]);
    inner10.rotateXYZ([0.0, Math.PI/2, 0.0]);
    graphicsObjects.push(inner10);
    let inner11 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner11.setParent(parentNode);
    inner11.updatexyz([2.5, 0.4, -1]);
    //inner11.rotateXYZ(0.0, Math.PI/2, 0.0);
    graphicsObjects.push(inner11);
    let inner12 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner12.setParent(parentNode);
    inner12.updatexyz([3.5, 0.4, -1]);
    //inner12.rotateXYZ(0.0, Math.PI/2, 0.0);
    graphicsObjects.push(inner12);
    let inner13 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner13.setParent(parentNode);
    inner13.updatexyz([-3.5, 0.4, 1]);
    //inner13.rotateXYZ(0.0, Math.PI/2, 0.0);
    graphicsObjects.push(inner13);
    let inner14 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner14.setParent(parentNode);
    inner14.updatexyz([2.5, 0.4, -1]);
    //inner14.rotateXYZ(0.0, Math.PI/2, 0.0);
    graphicsObjects.push(inner14);
    let inner15 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner15.setParent(parentNode);
    inner15.updatexyz([1.5, 0.4, -1]);
    //inner15.rotateXYZ(0.0, Math.PI/2, 0.0);
    graphicsObjects.push(inner15);
    let inner16 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner16.setParent(parentNode);
    inner16.updatexyz([1.5, 0.4, 2]);
    //inner16.rotateXYZ(0.0, Math.PI/2, 0.0);
    graphicsObjects.push(inner16);
    let inner17 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner17.setParent(parentNode);
    inner17.updatexyz([2.5, 0.4, 2]);
    //inner17.rotateXYZ(0.0, Math.PI/2, 0.0);
    graphicsObjects.push(inner17);
    let inner18 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner18.setParent(parentNode);
    inner18.updatexyz([3.5, 0.4, 2]);
    //inner18.rotateXYZ(0.0, Math.PI/2, 0.0);
    graphicsObjects.push(inner18);
    let inner19 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner19.setParent(parentNode);
    inner19.updatexyz([0.0, 0.4, 1.5]);
    inner19.rotateXYZ([0.0, Math.PI/2, 0.0]);
    graphicsObjects.push(inner19);
    let inner20 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner20.setParent(parentNode);
    inner20.updatexyz([0.0, 0.4, 2.5]);
    inner20.rotateXYZ([0.0, Math.PI/2, 0.0]);
    graphicsObjects.push(inner20);
    let inner21 = new GraphicsNode(innerWallMesh, wallMonoButBetter, mat4.create(), webGL, shaderPgm);
    inner21.setParent(parentNode);
    inner21.updatexyz([0.0, 0.4, 3.5]);
    inner21.rotateXYZ([0.0, Math.PI/2, 0.0]);
    graphicsObjects.push(inner21);
}

function draw() {
    webGL.clear(webGL.COLOR_BUFFER_BIT);
    shaderPgm.activate();
    //camera.update([5, 0, 5], [0, 0, 0]);

    for (let i = 0; i < graphicsObjects.length; i++) {
        graphicsObjects[i].draw();
    }

    playerNode.rotateXYZ([0.01, 0, 0]);
    cubeNode.rotateXYZ([0, 0.01, 0.01]);

    iceCreamRotationNode.rotateXYZ([0, 0.01, 0]);

    iceCreamConeNode.updatexyz([coneLateralSpeed, 0, 0]);
    coneLateralPosition = coneLateralPosition + coneLateralSpeed;
    if (coneLateralPosition >= 1.0) {
        coneLateralSpeed = -0.01;
    }
    if (coneLateralPosition <= -1.0) {
        coneLateralSpeed = 0.01;
    }

    iceCreamStar.scaleXYZ([1+starScaleSpeed, 1+starScaleSpeed, 1+starScaleSpeed]);
    starScale = starScale + starScaleSpeed;
    if (starScale >= 1.5) {
        starScaleSpeed = -0.01;
    }
    if (starScale <= 1.0) {
        starScaleSpeed = 0.01;
    }
    
    let ViewProjectionMatrix = camera.getViewProjectionMatrix();
    // Update all the world matrices
    graphicsNodes[0].updateWorldMatrix();
    // Compute matrices for rendering
    /*graphicsNodes.forEach(function(node){
        mat4.multiply(node.graphicsNode.transform, ViewProjectionMatrix, node.worldMatrix);
    });*/
    //player.draw();
    //otherStar.draw();
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
    playerNode.updatexyz(xyz);
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



