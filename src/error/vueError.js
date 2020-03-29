import Monitor from "../library/monitor.js";
import {
    ErrorCategoryEnum,
    ErrorLevelEnum
} from "../library/config.js";

/**
 * vue错误
 */
class VueError extends Monitor {

    constructor(params) {
        super(params);
    }

    /**
     * 处理Vue错误提示
     */
    handleError(Vue) {
        if (!Vue) {
            return;
        }
        Vue.config.errorHandler = (error, vm, info) => {
            try {
                let key = error.message.match(/(\w+)/g) || []
                let metaData = {
                    message: error.message,
                    name: key.length > 0 && key[0],
                    type: key.length > 1 && key[1],
                    stack: stack || null,
                    script_URI: script || null, // 异常脚本url
                    line_no: line || null, // 异常行号
                    column_no: column || null, // 异常列号
                    info: info,
                };
                if (Object.prototype.toString.call(vm) === '[object Object]') {
                    metaData.componentName = vm._isVue ? vm.$options.name || vm.$options._componentTag : vm.name;
                    metaData.propsData = vm.$options.propsData;
                }
                this.level = ErrorLevelEnum.WARN;
                this.msg = JSON.stringify(metaData);
                this.category = ErrorCategoryEnum.VUE_ERROR;
                this.recordError();
            } catch (error) {
                console.log("vue错误异常", error);
            }
        }
    }
}
export default VueError;