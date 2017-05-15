
function VdomNode(type, props, children) {
  this.type = type;
  this.props = props || {};
  this.children = children;
  this.finalized = false;
  this.markedChildrenCount = children.length;
}

function isPropsChanged(oldProps, newProps) {
  if (oldProps === newProps) {
    return false;
  }

  const oldKeys = Object.keys(oldProps);
  const newKeys = Object.keys(newProps);

  if (oldKeys.length !== newKeys.length) {
    return true;
  }

  // if any were not found, because this is the faster way
  return oldKeys.some(key => newKeys.indexOf(key) === -1 || oldProps[key] !== newProps[key]);
}

VdomNode.prototype.setNode = function setNode(type, props, children) {
  if (type !== this.type) {
    return new VdomNode(type, props, children);
  }

  if (isPropsChanged(this.props, props)) {
    return new VdomNode(type, props, children);
  }

  // more ending children? we know 100% for sure, new one
  if (children.length > this.children.length) {
    return new VdomNode(type, props, children);
  }

  // if the new set has any item not in the old, then we need a new one 100% certain
  if (children.some((c, i) => this.children[i] !== c)) {
    return new VdomNode(type, props, children);
  }

  // it is possible that children can be added later, so we just track until something is out of order
  this.markedChildrenCount = children.length;
  return this;
};

VdomNode.prototype.addChild = function addChild(child) {
  // check if the child exists, but not marked yet first
  if (this.children.length > this.markedChildrenCount) {
    if (this.children[this.markedChildrenCount] === child) {
      // then we just keep going, might be ok.
      // any removals are caught by finalize
      this.markedChildrenCount++;
      return this;
    }
  }

  // make sure child is finalized
  const finalizedChild = child.finalize();

  if (this.finalized) {
    return new VdomNode(this.type, this.props, this.children.slice(0, this.markedChildrenCount).concat(finalizedChild));
  }

  this.children.push(finalizedChild);
  this.markedChildrenCount++;
  return this;
};

VdomNode.prototype.finalize = function finalize() {
  if (this.finalized) {
    return this;
  }

  // it is possible that the last child was removed before finalization
  if (this.children.length !== this.markedChildrenCount) {
    return new VdomNode(this.type, this.props, this.children).finalize();
  }

  this.finalized = true;
  return this;
};

function h(oldNode, type, props, children) {
  let c = children || [];
  if (!Array.isArray(c)) {
    c = [c];
  }

  if (!oldNode) {
    return new VdomNode(type, props, c);
  }

  return oldNode.setNode(type, props, c);
}

module.exports = {
  VdomNode,
  h
};
