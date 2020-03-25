export default {
    ..._,

    type(obj) {
        return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
    },

    /**
     * 是否为null
     * @param {String} str 
     */
    isNull(str) {
        return str == undefined || str == '' || str == null;
    },

    /**
     * 对象是否为空
     * @param {*} obj 
     */
    objectIsNull(obj) {
        return JSON.stringify(obj) === "{}";
    },

    /**
     * 分domReady和onLoad两个方法是因为有可能资源未全部加载完成就关闭了浏览器窗口
     */
    domReady(callback) {
        let Timer = null
        let check = () => {
            if (window.performance.timing.domInteractive) {
                clearTimeout(Timer)
                callback()
            } else {
                Timer = setTimeout(check, 100)
            }
        }
        if (document.readyState === 'interactive') {
            callback()
            return
        }
        document.addEventListener('DOMContentLoaded', () => {
            check()
        })
    },

    onLoad(callback) {
        let Timer = null
        let check = () => {
            if (window.performance.timing.loadEventEnd) {
                clearTimeout(Timer)
                callback()
            } else {
                Timer = setTimeout(check, 100)
            }
        }
        // 资源都加载完成
        if (document.readyState === 'complete') {
            callback()
            return
        }
        window.addEventListener('load', () => {
            check()
        }, false)
    }
}

let _ = {}
    ["Function", "String", "Object", "Number", "Boolean", "Arguments"].forEach(name => {
        _["is" + name] = function (obj) {
            return toString.call(obj) === "[object " + name + "]";
        }
    })