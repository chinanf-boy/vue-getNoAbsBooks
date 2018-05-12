String.prototype.trimStr = function (str) {
    return this.replace(new RegExp(`^[${str}]+|[${str}]+$/g`), '');
  };

/**
 * @description  merge full uri
 * @param {string} indexP 
 * @param {string} secondP 
 */
function mergeUri(indexP, secondP) {
    let Merge = '/'
    if (indexP.endsWith(Merge)) {
        return indexP + secondP
    }
    return indexP + Merge + secondP
}

export default mergeUri;