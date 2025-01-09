class SceneGraphNode {
    constructor(graphicsnode){
        this.graphicsNode = graphicsnode;
        this.children = [];
        this.worldMatrix = mat4.create();
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
        if (parentWorldMatrix) {
            mat4.multiply(this.worldMatrix, parentWorldMatrix, this.graphicsNode.transform);
        } else {
            mat4.copy(this.worldMatrix, this.graphicsNode.transform);
        }

        var worldMatrix = this.worldMatrix;
        this.children.forEach(function(child) {
            child.updateWorldMatrix(worldMatrix);
        });
    }

    getGraphicsNode(){
        return this.graphicsNode;
    }
}