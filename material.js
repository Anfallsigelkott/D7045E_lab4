class Material {
    constructor(webGL, shaderPgm){
        this.webGL = webGL;
        this.shaderPgm = shaderPgm;
    }

    applyMat() {
        throw new Error("Implement this method on class extending material!")
    }
}