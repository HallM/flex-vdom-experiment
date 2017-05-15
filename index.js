const mattdom = require('./mattdom');
const example = require('./example');

const first = mattdom(example, {
  ulclass: 'class1',
  list: ['item 1', 'item 2']
});

const second = mattdom(example, {
  ulclass: 'class2',
  list: ['item 1', 'item 2']
});

const third = mattdom(example, {
  ulclass: 'class2',
  list: ['item 1', 'item 2']
});

const fourth = mattdom(example, {
  ulclass: 'class2',
  list: ['item 3', 'item 2']
});

console.log('first');
console.log(JSON.stringify(first, null, 2));
console.log('');

console.log('second');
console.log(JSON.stringify(second, null, 2));
console.log('');

console.log('third');
console.log(JSON.stringify(third, null, 2));
console.log('');

console.log('fourth');
console.log(JSON.stringify(fourth, null, 2));
console.log('');
