String.prototype.trimStr = function(str) {
  let target = this;
  if (target.startsWith(str)) {
    target = target.slice(1);
  }
  if (target.endsWith(str)) {
    target = target.slice(0, -1);
  }
  return target;
};
