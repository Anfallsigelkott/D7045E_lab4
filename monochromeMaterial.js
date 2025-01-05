class MonochromeMaterial extends Material {
    constructor(webGL, shaderPgm, colour){
        super(webGL, shaderPgm);
        this.shaderPgm = shaderPgm;
        this.colour = colour;
    }

    applyMat(transformMatrix) {
        let pgm = this.shaderPgm.getProgram();
        let colour_loc = this.webGL.getUniformLocation(pgm, "u_colour");
        this.webGL.uniform4fv(colour_loc, this.colour);

        let trans_loc = this.webGL.getUniformLocation(pgm, "u_transformationMatrix");
        this.webGL.uniformMatrix4fv(trans_loc, false, transformMatrix);
    }
}