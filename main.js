
let webGL;
let camera;
let shaderPgm;
let canvas;

let graphicsObjects = [];
const objAmount = 20;
const objMinSize = 0.5;
const objMaxSize = 1.5;

let player;

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
    for (let i = 0 ; i < objAmount ; i++){
        let x = Math.floor(Math.random()*(max-min)+min);
        let y = Math.ceil(Math.random()*(max-min)+min);
        let z = Math.floor(Math.random()*(maxdepth-mindepth)+mindepth);
        let matrix = mat4.create();
        mat4.translate(matrix, matrix, [x, y, z]);
        console.log(matrix);
        //let matrix = [0, 0, 0, x,   0, 0, 0, y,  0, 0, 0, z,  0, 0, -1, 4];
        //let newObject = new GraphicsNode(playerCube, greenMono, matrix, webGL);
        //graphicsObjects.push(newObject);
    }

    draw();
}

function draw() {
    webGL.clear(webGL.COLOR_BUFFER_BIT);
    shaderPgm.activate();
    //camera.update([5, 0, 5], [0, 0, 0]);

    for (let i = 0; i < graphicsObjects.length; i++) {
        graphicsObjects[i].draw();
    }
    
    player.draw();
}

window.addEventListener("keydown", function(event) {
    let xyz = [0,0,0];
    let cameraPos = camera.getEyePos();
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
            console.log("HERE!");
            cameraPos[1] = cameraPos[1] + speed;
            break;
        case "ArrowDown":
            cameraPos[1] = cameraPos[1] - speed;
            break;
        case "ArrowLeft":
            cameraPos[0] = cameraPos[0] - speed;
            break;
        case "ArrowRight":
            cameraPos[0] = cameraPos[0] + speed;
            break;
    }
    console.log(cameraPos);
    player.update(xyz);
    camera.update(cameraPos, [0, 0, 0]);
    //console.log(player.transform);
    draw();
});

window.onload = init;