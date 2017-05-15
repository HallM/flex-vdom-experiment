
const h = require('./vdomnode').h;

module.exports = function(previous, data) {
  const ul = h(previous, 'ul', { className: data.ulclass });

  data.list.forEach((value, index) => {
    const li = h(previous && previous.children[index], 'li', {}, value);
    ul.addChild(li.finalize());
  });

  return ul.finalize();

  // return h(previous, 'ul', { className: data.ulclass }, [
  //   h(previous && previous.children[0], 'li', {}, data.list[0]),
  //   h(previous && previous.children[1], 'li', {}, data.list[1])
  // ]);
};
