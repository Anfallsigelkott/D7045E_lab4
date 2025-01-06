class GraphicsNode{
    constructor(mesh, material, transform, webGL, shaderPgm) {
        this.mesh = mesh;
        this.material = material;
        this.transform = transform;
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

        this.material.applyMat(this.transform);

        webGL.bindBuffer(webGL.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer);

        this.webGL.drawElements(this.webGL.TRIANGLES, indexLen, this.webGL.UNSIGNED_SHORT, 0);
    }

    update(transformVector) {
        mat4.translate(this.transform, this.transform, transformVector);
    }
}