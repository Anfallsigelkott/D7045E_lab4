class Cone extends Mesh{
    constructor(webGL, height, radius, shaderPgm){
        let noBottom = true;
        let slices = 32;
        radius = radius || 0.5;
        height = height || 2*radius;
        slices = slices || 32;
        var fractions = [ 0, 0.5, 0.75, 0.875, 0.9375 ];
        var vertexCount = fractions.length*(slices+1) + slices;
        if (!noBottom)
           vertexCount += slices + 2;
        var triangleCount = (fractions.length-1)*slices*2 + slices;
        if (!noBottom)
           triangleCount += slices;
        var vertices = new Float32Array(vertexCount*3);
        var normals = new Float32Array(vertexCount*3);
        var texCoords = new Float32Array(vertexCount*2);
        var indices = new Uint16Array(triangleCount*3);
        var normallength = Math.sqrt(height*height+radius*radius);
        var n1 = height/normallength;
        var n2 = radius/normallength; 
        var du = 2*Math.PI / slices;
        var kv = 0;
        var k = 0;
        var i,j,u;
        for (j = 0; j < fractions.length; j++) {
           var uoffset = (j % 2 == 0? 0 : 0.5);
           for (i = 0; i <= slices; i++) {
              var h1 = -height/2 + fractions[j]*height;
              u = (i+uoffset)*du;
              var c = Math.cos(u);
              var s = Math.sin(u);
              vertices[kv] = c*radius*(1-fractions[j]);
              normals[kv++] = c*n1;
              vertices[kv] = s*radius*(1-fractions[j]);
              normals[kv++] = s*n1;
              vertices[kv] = h1;
              normals[kv++] = n2;
           }
        }
        var k = 0;
        for (j = 0; j < fractions.length-1; j++) {
           var row1 = j*(slices+1);
           var row2 = (j+1)*(slices+1);
           for (i = 0; i < slices; i++) {
               indices[k++] = row1 + i;
               indices[k++] = row2 + i + 1;
               indices[k++] = row2 + i;
               indices[k++] = row1 + i;
               indices[k++] = row1 + i + 1;
               indices[k++] = row2 + i + 1;
           }
        }
        var start = kv/3 - (slices+1);
        for (i = 0; i < slices; i++) { // slices points at top, with different normals, texcoords
           u = (i+0.5)*du;
           var c = Math.cos(u);
           var s = Math.sin(u);
           vertices[kv] = 0;
           normals[kv++] = c*n1;
           vertices[kv] = 0;
           normals[kv++] = s*n1;
           vertices[kv] = height/2;
           normals[kv++] = n2;
        }
        for (i = 0; i < slices; i++) {
           indices[k++] = start+i;
           indices[k++] = start+i+1;
           indices[k++] = start+(slices+1)+i;
        }
        if (!noBottom) {
           var startIndex = kv/3;
           vertices[kv] = 0;
           normals[kv++] = 0;
           vertices[kv] = 0;
           normals[kv++] = 0;
           vertices[kv] = -height/2;
           normals[kv++] = -1;
           for (i = 0; i <= slices; i++) {
              u = 2*Math.PI - i*du;
              var c = Math.cos(u);
              var s = Math.sin(u);
              vertices[kv] = c*radius;
              normals[kv++] = 0;
              vertices[kv] = s*radius;
              normals[kv++] = 0;
              vertices[kv] = -height/2;
              normals[kv++] = -1;
           }
           for (i = 0; i < slices; i++) {
              indices[k++] = startIndex;
              indices[k++] = startIndex + i + 1;
              indices[k++] = startIndex + i + 2;
           }
        } 
        /*return {
            vertexPositions: vertices,
            vertexNormals: normals,
            vertexTextureCoords: texCoords,
            indices: indices
        };*/
        //console.log("Vertices: ", vertices);
        //console.log("Indices: ", indices);
        super(webGL, vertices, indices, normals, shaderPgm);
    }
}