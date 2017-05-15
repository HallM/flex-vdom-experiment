
const h = require('./vdomnode').h;

module.exports = function(previous, data) {
  let ul = h(previous, 'ul', { className: data.ulclass });

  data.list.forEach((value, index) => {
    const li = h(previous && previous.children[index], 'li', {}, value);
    ul = ul.addChild(li);
  });

  return ul;
};
