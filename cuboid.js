class Cuboid extends Mesh {
    constructor(webGL, height, depth, width, shaderPgm){
        let x = width/2;
        let y = height/2;
        let z = depth/2;
        // Units divided by two as calculations care more about distance from centroid rather than the entire lengths


        const vertices = [
            [-x, y, z, 1],
            [x, y, z, 1],
            [x, y, -z, 1],
            [-x, y, -z, 1],
            [-x, -y, z, 1],
            [x, -y, z, 1],
            [x, -y, -z, 1],
            [-x, -y, -z, 1]
        ]; // First 4 vecs: lower layer CCW, last 4 vecs, upper layer CCW, both starting in "close left"

        let indices = [0, 1, 2, 0, 2, 3, 0, 1, 5, 0, 5, 4, 0, 4, 3, 4, 3, 7, 3, 7, 2, 7, 2, 6, 2, 6, 5, 2, 5, 1, 5, 4, 6, 4, 6, 7];

        // Each set of three elements constitute a triangle, two triangles (six elements) make a face
        // Starting from bottom face, then clockwise starting from the "closest" face, and lastly the top face
        // Each element represents the index of a vertex in vertices
        let normals = [];

        super(webGL, vertices.flat(), indices, normals, shaderPgm);
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getCoords(){
        return [this.x, this.y, this.z];
    }
}