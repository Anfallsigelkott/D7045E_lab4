class SceneGraphNode {
    constructor(localTransform){
        if (localTransform) {
            this.localTransform = localTransform;
        } else {
            this.localTransform = mat4.create();
        }
        this.worldTransform = mat4.create();
        this.children = [];
    }

    setParent(parent){
        if (this.parent) {
            var index = this.parent.children.indexOf(this);
            if (index >= 0) {
                this.parent.children.splice(index, 1);
            }
        }

        if (parent) {
            parent.children.push(this);
        }
        this.parent = parent;
    }

    updateWorldMatrix(parentWorldMatrix) {

        /*if (parentWorldMatrix) {
            mat4.translate(this.graphicsNode.worldTransform, this.graphicsNode.getLocalTransform(), parentWorldMatrix);
        } else {
            mat4.copy(this.graphicsNode.worldTransform, this.graphicsNode.getLocalTransform());
        }

        let parentVector = [this.graphicsNode.worldTransform[12], this.graphicsNode.worldTransform[13], this.graphicsNode.worldTransform[14]];
        this.children.forEach(function(child) {
            child.updateWorldMatrix(parentVector);
        });*/
        if (parentWorldMatrix) {
            mat4.multiply(this.worldTransform, parentWorldMatrix, this.localTransform);
        } else { 
            mat4.copy(this.worldTransform, this.localTransform);
        }
        let worldMatrix = this.worldTransform;
        
        this.children.forEach(function(child) {
            child.updateWorldMatrix(worldMatrix);
        });
    }

    updatexyz(transformVector) {
        //let transformMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, transformVector[0], transformVector[1], transformVector[2], 1];
        //mat4.multiply(this.localTransform, this.localTransform, transformMatrix);
        mat4.translate(this.localTransform, this.localTransform, transformVector);
    }

    rotateXYZ(rotationVector) {
        let savedPosition = [this.localTransform[12], this.localTransform[13], this.localTransform[14]];
        //mat4.translate(this.localTransform, this.localTransform, [-savedPosition[0], -savedPosition[1], -savedPosition[2]]);

        mat4.rotateX(this.localTransform, this.localTransform, rotationVector[0]);
        mat4.rotateY(this.localTransform, this.localTransform, rotationVector[1]);
        mat4.rotateZ(this.localTransform, this.localTransform, rotationVector[2]);

        //mat4.translate(this.localTransform, this.localTransform, savedPosition);
    }

    // For setting the local transform of objects without a graphicsnode
    setLocalTransform(localTransform){
        this.localTransform = localTransform;
    }
}