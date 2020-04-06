let _ = {};
['Function', 'String', 'Object', 'Number', 'Boolean', 'Arguments'].forEach(name => {
    _['is' + name] = function (obj) {
        return toString.call(obj) === '[object ' + name + ']'
    }
})

export default {
    ..._,

    type(obj) {
        return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '')
    },

    /**
     * 是否为null
     * @param {String} str 
     */
    isNull(str) {
        return str == undefined || str == '' || str == null
    },

    /**
     * 对象是否为空
     * @param {*} obj 
     */
    objectIsNull(obj) {
        return JSON.stringify(obj) === '{}'
    }
}