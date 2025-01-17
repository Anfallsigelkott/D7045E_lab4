class GraphicsNode extends SceneGraphNode{
    constructor(mesh, material, transform, webGL, shaderPgm) {
        super(transform);
        this.mesh = mesh;
        this.material = material;
        //this.localTransform = transform;
        //this.worldTransform = mat4.create(); MOVE THESE TO SUPER
        this.webGL = webGL;
        this.program = shaderPgm;
    }

    draw() {
        let indexLen = this.mesh.getIndices().length;

        let buffers = this.mesh.getBuffers();
        let pgm = this.program.getProgram();

        webGL.bindBuffer(webGL.ARRAY_BUFFER, buffers.vertexBuffer);
        let position = webGL.getAttribLocation(pgm, "a_pos");
        webGL.enableVertexAttribArray(position);
        webGL.vertexAttribPointer(position, 3, webGL.FLOAT, false, 0, 0);

        webGL.bindBuffer(webGL.ARRAY_BUFFER, buffers.normalBuffer);
        let normalPos = webGL.getAttribLocation(pgm, "a_normal");
        webGL.enableVertexAttribArray(normalPos);
        webGL.vertexAttribPointer(normalPos, 3, webGL.FLOAT, false, 0, 0);

        if (this.worldTransform == [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]){
            this.material.applyMat(this.localTransform);
        } else {
            this.material.applyMat(this.worldTransform);
        }

        webGL.bindBuffer(webGL.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer);

        this.webGL.drawElements(this.webGL.TRIANGLES, indexLen, this.webGL.UNSIGNED_SHORT, 0);
    }

    scaleXYZ(scaleVector) {
        mat4.scale(this.localTransform, this.localTransform, scaleVector);
    }

    getLocalTransform() {
        return this.localTransform;
    }
    
    getWorldTransform() {
        return this.worldTransform;
    }
}