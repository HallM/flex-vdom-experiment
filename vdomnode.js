
let nodeid = 1;

function VdomNode(type, props, children) {
  this.type = type;
  this.props = props || {};
  this.children = children;
  this.finalized = false;
  this.markedChildren = children.slice();

  console.log('newnode', nodeid);
  this.nodeid = nodeid++;
}

function isPropsChanged(oldProps, newProps) {
  if (oldProps === newProps) {
    console.log('same props obj');
    return false;
  }

  const oldKeys = Object.keys(oldProps);
  const newKeys = Object.keys(newProps);

  if (oldKeys.length !== newKeys.length) {
    console.log('keys dont match');
    return true;
  }

  // if any were not found, because this is the faster way
  return oldKeys.some(key => newKeys.indexOf(key) === -1 || oldProps[key] !== newProps[key]);
}

// function isChildrenChanged(oldChildren, newChildren) {
//   if (oldChildren === newChildren) {
//     console.log('children are exact same');
//     return false;
//   }

//   if (oldChildren.length !== newChildren.length) {
//     console.log(newChildren);
//     console.log('children length is differnet', oldChildren.length, newChildren.length);
//     return true;
//   }

//   return oldChildren.some(c => newChildren.indexOf(c) === -1);
// }

VdomNode.prototype.setNode = function setNode(type, props, children) {
  if (type !== this.type) {
    console.log('new because type');
    return new VdomNode(type, props, children);
  }

  if (isPropsChanged(this.props, props)) {
    console.log('new because props');
    return new VdomNode(type, props, children);
  }

  // if (isChildrenChanged(this.children, children)) {
  //   console.log('new because children');
  //   return new VdomNode(type, props, children);
  // }

  // more ending children? we know 100% for sure, new one
  if (children.length > this.children.length) {
    console.log('new because more children');
    return new VdomNode(type, props, children);
  }

  // items in here must be in the same order as children too
  this.markedChildren = [];

  // if the new set has any item not in the old, then we need a new one 100% certain
  const hasNewChild = children.some((c, i) => {
    // while we go through, we act like we *may* re-use, so we mark children
    // it's ok to just mark anyway, this node will get cleaned up anyway if it was a waste
    this.markedChildren.push(c);

    return this.children[i] === c;
  });
  if (hasNewChild) {
    console.log('new because new child');
    return new VdomNode(type, props, children);
  }

  // it is possible that children can be added later, so we don't bother
  console.log('reused', this.nodeid);
  return this;
};

VdomNode.prototype.addChild = function setNode(child) {
  // check if the child exists, but not marked yet first
  if (this.children.length <= this.markedChildren.length)

  if (this.finalized) {
    return new VdomNode(this.type, this.props, this.children.concat(child));
  }

  this.children.push(child);
  return this;
};

VdomNode.prototype.finalize = function finalize() {
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
