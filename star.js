class Star extends Mesh{
    constructor(webGL, outerdist, innerdist, depth, spikes){
        let vertices = [];
        let indices = [];
        let normals = [];

        vertices.push([0,0,depth/2]);
        vertices.push([0,0,-depth/2]);

        let increments = (2*Math.PI)/(2*spikes);

        for (let i = 0; i < spikes*2 ; i++){
            let dist = innerdist;
            let angle = (Math.PI/2)+increments*i;
            if (i%2 == 0){
                dist = outerdist;
            }
            console.log("X angle: ", angle, " dist: ", dist, " multiplied angle: ", Math.cos(angle));
            let x_comp = dist*Math.cos(angle);
            console.log("Y angle: ", angle, " dist: ", dist, " multiplied angle: ", Math.sin(angle));
            let y_comp = dist*Math.sin(angle);
            vertices.push([x_comp,y_comp,0]);
            console.log("Coords: ", x_comp,y_comp,0);
        }

        function normal(tri1, tri2, tri3){
            let u_vec = [tri2[0]-tri1[0], tri2[1]-tri1[1], tri2[2]-tri1[2]];
            let v_vec = [tri3[0]-tri1[0], tri3[1]-tri1[1], tri3[2]-tri1[2]];
            // the vectoring

            let norm_x = (u_vec[1]*v_vec[2])-(u_vec[2]*v_vec[1]);
            let norm_y = (u_vec[2]*v_vec[0])-(u_vec[0]*v_vec[2]);
            let norm_z = (u_vec[0]*v_vec[1])-(u_vec[1]*v_vec[0]);
            // The great matrix mystery
            let normal = [norm_x, norm_y, norm_z];
            return normal;
        }

        for (let i = 2 ; i < vertices.length ; i++){
            let next = i+1;
            if (next == vertices.length) {
                next=2;
            }
            indices.push(0,i,next);
            normals.push(normal(vertices[0], vertices[i], vertices[next]));
            indices.push(1,i,next);
            normals.push(normal(vertices[1], vertices[i], vertices[next]));
        }
        console.log("Vertex length: ", vertices.flat().length, " Index length: ", indices.length, " Normal length: ", normals.flat().length);
        super(webGL, new Float32Array(vertices.flat()), new Uint16Array(indices), new Float32Array(normals.flat()), shaderPgm);
    }
}