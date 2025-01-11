class LightNode extends SceneGraphNode {
    constructor(webGL, shaderPgm, transform){
        super(transform);
        this.webGL = webGL;
        this.program = shaderPgm;
    }

    applyLight(){
        let pgm = this.program.getProgram();

        let lightPos = [this.localTransform[12], this.localTransform[13], this.localTransform[14], 1];
        let ambientColour = [0.3, 0.3, 0.3, 1.0];
        let diffuseColour = [0.8, 0.8, 0.8, 1.0];
        let specularColour = [1.0, 1.0, 1.0];
        let specularExponent = 500.0;

        let ambientColourLoc = this.webGL.getUniformLocation(pgm, "u_ambientColour");
        this.webGL.uniform4fv(ambientColourLoc, ambientColour.flat());

        let diffuseColourLoc = this.webGL.getUniformLocation(pgm, "u_diffuseColour");
        this.webGL.uniform4fv(diffuseColourLoc, diffuseColour.flat());

        let specularColourLoc = this.webGL.getUniformLocation(pgm, "u_specularColour");
        this.webGL.uniform3fv(specularColourLoc, specularColour.flat());

        let specularExponentLoc = this.webGL.getUniformLocation(pgm, "u_specularExponent");
        this.webGL.uniform1f(specularExponentLoc, specularExponent);

        let lightPosLoc = this.webGL.getUniformLocation(pgm, "u_lightPosition");
        this.webGL.uniform4fv(lightPosLoc, lightPos.flat());
    }
}