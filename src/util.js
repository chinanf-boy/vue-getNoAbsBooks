String.prototype.trimStr = function (str) {
    let target = this
    if(target.startsWith('/')){
        target = target.slice(1)
    }
    if(target.endsWith('/')){
        target = target.slice(0,-1)
    }
    return target
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