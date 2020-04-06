import Monitor from '../utils/monitor.js'
import {
    ErrorCategoryEnum,
    ErrorLevelEnum
} from '../utils/config.js'

/**
 * vue错误
 */
class VueError {

    constructor(params) {
        this.params = params
    }

    /**
     * 处理Vue错误提示
     */
    handleError(Vue) {
        if (!Vue) {
            return
        }
        let data = {}
        Vue.config.errorHandler = (error, vm, info) => {
            try {
                let {
                    message, // 异常信息
                    name, // 异常名称
                    script, // 异常脚本url
                    line, // 异常行号
                    column, // 异常列号
                    stack // 异常堆栈信息
                } = error
                data.msg = message
                data.name = name
                data.stack = stack || null
                data.resourceUrl = script || null // 异常脚本url
                data.line = line || null // 异常行号
                data.col = column || null // 异常列号

                let errs = stack.match(/\(.+?\)/)
                if (errs && errs.length) {
                    errs = errs[0]
                    errs = errs.replace(/\w.+[js|html]/g, $1 => { data.resourceUrl = $1; return ''; })
                    errs = errs.split(':')
                    if (errs.length > 1) {
                        data.line = parseInt(errs[1] || null)
                        data.col = parseInt(errs[2] || null)
                    }
                }
                data.vueInfo = info
                if (Object.prototype.toString.call(vm) === '[object Object]') {
                    data.vueComponentName = vm._isVue ? vm.$options.name || vm.$options._componentTag : vm.name
                    data.vuePropsData = vm.$options.propsData
                }
                data.level = ErrorLevelEnum.WARN
                data.category = ErrorCategoryEnum.VUE_ERROR
                new Monitor(this.params).recordError(data)
            } catch (error) {
                console.log('vue错误异常：', error)
            }
        }
    }
}
export default VueError