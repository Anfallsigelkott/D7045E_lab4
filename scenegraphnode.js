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
            console.log("gets here (nodeless with parent)");
            child.updateWorldMatrix(worldMatrix);
        });
    }

    // For setting the local transform of objects without a graphicsnode
    setLocalTransform(localTransform){
        this.localTransform = localTransform;
    }
}