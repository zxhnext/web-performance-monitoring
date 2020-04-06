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
    },

    /**
     * 生成随机数
     */
    randomString(len) {
    　　len = len || 10
    　　const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789'
    　　const maxPos = $chars.length
    　　let pwd = ''
    　　for (let i = 0; i < len; i++) {
    　　　　pwd = pwd + $chars.charAt(Math.floor(Math.random() * maxPos))
    　　}
    　　return pwd + new Date().getTime()
    },

    /**
     * 获得markpage
     */
    markUser() {
        let psMarkUser = sessionStorage.getItem('ps_markUser')||''
        if(!psMarkUser) {
            psMarkUser = this.randomString()
            sessionStorage.setItem('ps_markUser', psMarkUser)
        }
        return psMarkUser
    },

    /**
     * 获得Uv
     */
    markUv() {
        const date = new Date()
        let psMarkUv = localStorage.getItem('ps_markUv') || ''
        const dataTime = localStorage.getItem('ps_markUvTime') || ''
        const today = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} 23:59:59`
        if( (!psMarkUv && !dataTime) || (date.getTime() > dataTime*1) ) {
            psMarkUv = this.randomString()
            localStorage.setItem('ps_markUv', psMarkUv)
            localStorage.setItem('ps_markUvTime', new Date(today).getTime())
        }
        return psMarkUv
    }
}