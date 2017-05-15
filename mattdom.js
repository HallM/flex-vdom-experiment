
let existing = null;

module.exports = function mattdom(component, data) {
  let thenew = component(existing, data).finalize();
  existing = thenew;
  return thenew;
};
