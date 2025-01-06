class Torus extends Mesh {
    constructor(webGL, innerRadius, outerRadius, shaderPgm) {
        outerRadius = outerRadius || 0.5;
        innerRadius = innerRadius || outerRadius/3;
        let slices = 32;
        let stacks = 16;
        var vertexCount = (slices+1)*(stacks+1);
        var vertices = new Float32Array( 3*vertexCount );
        var normals = new Float32Array( 3* vertexCount );
        var indices = new Uint16Array( 2*slices*stacks*3 );
        var du = 2*Math.PI/slices;
        var dv = 2*Math.PI/stacks;
        var centerRadius = (innerRadius+outerRadius)/2;
        var tubeRadius = outerRadius - centerRadius;
        var i,j,u,v,cx,cy,sin,cos,x,y,z;
        var indexV = 0;
        for (j = 0; j <= stacks; j++) {
           v = -Math.PI + j*dv;
           cos = Math.cos(v);
           sin = Math.sin(v);
           for (i = 0; i <= slices; i++) {
              u = i*du;
              cx = Math.cos(u);
              cy = Math.sin(u);
              x = cx*(centerRadius + tubeRadius*cos);
              y = cy*(centerRadius + tubeRadius*cos);
              z = sin*tubeRadius;
              vertices[indexV] = x;
              normals[indexV++] = cx*cos;
              vertices[indexV] = y;
              normals[indexV++] = cy*cos;
              vertices[indexV] = z;
              normals[indexV++] = sin;
           } 
        }
        var k = 0;
        for (j = 0; j < stacks; j++) {
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

        super(webGL, vertices, indices, normals, shaderPgm);
    }
}