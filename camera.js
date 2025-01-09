class Camera {
    constructor(eyeVec, refVec, FOVRad, aspectRatio, near, far, shaderProgram, webGL) {
        this.webGL = webGL;
        this.shaderProgram = shaderProgram;
        this.FOVRad = FOVRad;
        this.aspectRatio = aspectRatio;
        this.near = near;
        this.far = far;
        this.eyeVec = eyeVec;
        this.refVec = refVec;

        this.upVec = [0.0, 1.0, 0.0];
        this.viewMatrix = mat4.create();
        mat4.lookAt(this.viewMatrix, eyeVec, refVec, this.upVec);

        this.viewMatrixLocation = this.webGL.getUniformLocation(shaderProgram.getProgram(), "u_viewMatrix");
        this.webGL.uniformMatrix4fv(this.viewMatrixLocation, false, this.viewMatrix);

        
        this.projectionMatrix = mat4.create();
        mat4.perspective(this.projectionMatrix, FOVRad, aspectRatio, near, far);

        this.projectionMatrixLocation = this.webGL.getUniformLocation(shaderProgram.getProgram(), "u_projectionMatrix");
        this.webGL.uniformMatrix4fv(this.projectionMatrixLocation, false, this.projectionMatrix);
    }

    update(eyeVec, refVec) {
        this.eyeVec = eyeVec;
        this.refVec = refVec;

        mat4.lookAt(this.viewMatrix, eyeVec, refVec, this.upVec);
        this.viewMatrixLocation = this.webGL.getUniformLocation(this.shaderProgram.getProgram(), "u_viewMatrix");
        this.webGL.uniformMatrix4fv(this.viewMatrixLocation, false, this.viewMatrix);

        mat4.perspective(this.projectionMatrix, this.FOVRad, this.aspectRatio, this.near, this.far);
        this.projectionMatrixLocation = this.webGL.getUniformLocation(this.shaderProgram.getProgram(), "u_projectionMatrix");
        this.webGL.uniformMatrix4fv(this.projectionMatrixLocation, false, this.projectionMatrix);
    }

    getEyePos() {
        return this.eyeVec;
    }

    getRef() {
        return this.refVec;
    }
}