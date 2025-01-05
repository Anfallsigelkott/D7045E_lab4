class Mesh {
    constructor(webGL, vertices, indices, normals, shaderPgm){
        this.vertices = vertices;
        this.indices = indices;
        this.normals = normals;

        let vertexArray = webGL.createVertexArray();
        webGL.bindVertexArray(vertexArray);

        let vertexBuffer = webGL.createBuffer();
        webGL.bindBuffer(webGL.ARRAY_BUFFER, vertexBuffer);
        
        let verticesArray = new Float32Array(this.vertices);
        webGL.bufferData(webGL.ARRAY_BUFFER, verticesArray, webGL.STATIC_DRAW);

        let indexbuffer = webGL.createBuffer();
        webGL.bindBuffer(webGL.ELEMENT_ARRAY_BUFFER, indexbuffer);
        let indicesArray = new Uint16Array(this.indices);
        webGL.bufferData(webGL.ELEMENT_ARRAY_BUFFER, indicesArray, webGL.STATIC_DRAW);

        let pgm = shaderPgm.getProgram();
        let position = webGL.getAttribLocation(pgm, "a_pos");
        webGL.vertexAttribPointer(position, 4, webGL.FLOAT, false, 0, 0);
        webGL.enableVertexAttribArray(position);

        let normalBuffer = webGL.createBuffer();
        webGL.bindBuffer(webGL.ARRAY_BUFFER, normalBuffer);
        let normalArray = new Float32Array(this.normals);
        webGL.bufferData(webGL.ARRAY_BUFFER, normalArray, webGL.STATIC_DRAW);
    }

    getIndices(){
        return this.indices;
    }

    getVertices(){
        return this.vertices;
    }
}