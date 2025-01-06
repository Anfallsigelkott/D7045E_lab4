class Cylinder extends Mesh {
    constructor(webGL, radius, height, shaderPgm) {
        let noTop = false;
        let noBottom = false;
        radius = radius || 0.5;
        height = height || 2*radius;
        let slices = 32;
        var vertexCount = 2*(slices+1);
        if (!noTop)
           vertexCount += slices + 2;
        if (!noBottom)
           vertexCount += slices + 2;
        var triangleCount = 2*slices;
        if (!noTop)
           triangleCount += slices;
        if (!noBottom)
           triangleCount += slices; 
        var vertices = new Float32Array(vertexCount*3);
        var normals = new Float32Array(vertexCount*3);
        var indices = new Uint16Array(triangleCount*3);
        var du = 2*Math.PI / slices;
        var kv = 0;
        var k = 0;
        var i,u;
        for (i = 0; i <= slices; i++) {
           u = i*du;
           var c = Math.cos(u);
           var s = Math.sin(u);
           vertices[kv] = c*radius;
           normals[kv++] = c;
           vertices[kv] = s*radius;
           normals[kv++] = s;
           vertices[kv] = -height/2;
           normals[kv++] = 0;
           vertices[kv] = c*radius;
           normals[kv++] = c;
           vertices[kv] = s*radius;
           normals[kv++] = s;
           vertices[kv] = height/2;
           normals[kv++] = 0;
        }
        for (i = 0; i < slices; i++) {
               indices[k++] = 2*i;
               indices[k++] = 2*i+3;
               indices[k++] = 2*i+1;
               indices[k++] = 2*i;
               indices[k++] = 2*i+2;
               indices[k++] = 2*i+3;
        }
        var startIndex = kv/3;
        if (!noBottom) {
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
        var startIndex = kv/3;
        if (!noTop) {
           vertices[kv] = 0;
           normals[kv++] = 0;
           vertices[kv] = 0;
           normals[kv++] = 0;
           vertices[kv] = height/2;
           normals[kv++] = 1;
           for (i = 0; i <= slices; i++) {
              u = i*du;
              var c = Math.cos(u);
              var s = Math.sin(u);
              vertices[kv] = c*radius;
              normals[kv++] = 0;
              vertices[kv] = s*radius;
              normals[kv++] = 0;
              vertices[kv] = height/2;
              normals[kv++] = 1;
           }
           for (i = 0; i < slices; i++) {
              indices[k++] = startIndex;
              indices[k++] = startIndex + i + 1;
              indices[k++] = startIndex + i + 2;
           }
        }

        super(webGL, vertices, indices, normals, shaderPgm);
    }
}