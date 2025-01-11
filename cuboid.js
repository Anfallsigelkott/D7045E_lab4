class Cuboid extends Mesh {
    constructor(webGL, height, depth, width, shaderPgm){
        let x = width/2;
        let y = height/2;
        let z = depth/2;
        // Units divided by two as calculations care more about distance from centroid rather than the entire lengths
        /*let normals = [];

        const vertices = [
            [-x, y, z],
            [x, y, z],
            [x, y, -z],
            [-x, y, -z],
            [-x, -y, z],
            [x, -y, z],
            [x, -y, -z],
            [-x, -y, -z]
        ]; // First 4 vecs: lower layer CCW, last 4 vecs, upper layer CCW, both starting in "close left"

        let indices = [0, 1, 2, 0, 2, 3, 0, 1, 5, 0, 5, 4, 0, 4, 3, 4, 3, 7, 3, 7, 2, 7, 2, 6, 2, 6, 5, 2, 5, 1, 5, 4, 6, 4, 6, 7];*/

        // Each set of three elements constitute a triangle, two triangles (six elements) make a face
        // Starting from bottom face, then clockwise starting from the "closest" face, and lastly the top face
        // Each element represents the index of a vertex in vertices
        let normals = [];
        let vertices = [];
        let indices = [];

        function face(xyz, nrm) {
            var start = vertices.length/3;
            var i;
            for (i = 0; i < 12; i++) {
               vertices.push(xyz[i]);
            }
            for (i = 0; i < 4; i++) {
               normals.push(nrm[0],nrm[1],nrm[2]);
            }
            indices.push(start,start+1,start+2,start,start+2,start+3);
         }
         face( [-x,-y,z, x,-y,z, x,y,z, -x,y,z], [0,0,1] );
         face( [-x,-y,-z, -x,y,-z, x,y,-z, x,-y,-z], [0,0,-1] );
         face( [-x,y,-z, -x,y,z, x,y,z, x,y,-z], [0,1,0] );
         face( [-x,-y,-z, x,-y,-z, x,-y,z, -x,-y,z], [0,-1,0] );
         face( [x,-y,-z, x,y,-z, x,y,z, x,-y,z], [1,0,0] );
         face( [-x,-y,-z, -x,-y,z, -x,y,z, -x,y,-z], [-1,0,0] );








        /*
        var s =  1/2;
        var coords = [];
        var normals = [];
        var texCoords = [];
        var indices = [];
        function face(xyz, nrm) {
        var start = coords.length/3;
        var i;
        for (i = 0; i < 12; i++) {
            coords.push(xyz[i]);
        }
        for (i = 0; i < 4; i++) {
            normals.push(nrm[0],nrm[1],nrm[2]);
        }
        texCoords.push(0,0,1,0,1,1,0,1);
        indices.push(start,start+1,start+2,start,start+2,start+3);
        }
        face( [-s,-s,s, s,-s,s, s,s,s, -s,s,s], [0,0,1] );
        face( [-s,-s,-s, -s,s,-s, s,s,-s, s,-s,-s], [0,0,-1] );
        face( [-s,s,-s, -s,s,s, s,s,s, s,s,-s], [0,1,0] );
        face( [-s,-s,-s, s,-s,-s, s,-s,s, -s,-s,s], [0,-1,0] );
        face( [s,-s,-s, s,s,-s, s,s,s, s,-s,s], [1,0,0] );
        face( [-s,-s,-s, -s,-s,s, -s,s,s, -s,s,-s], [-1,0,0] );*/
        //console.log("coords length: ", vertices.flat().length);
        //console.log("Indices length: ", indices.length);
        super(webGL, new Float32Array(vertices.flat()), new Uint16Array(indices), new Float32Array(normals), shaderPgm);
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getCoords(){
        return [this.x, this.y, this.z];
    }
}