import Monitor from '../utils/monitor.js'
import {
    ErrorCategoryEnum,
    ErrorLevelEnum
} from '../utils/config.js'
/**
 * console.error异常
 */
class ConsoleError {

    constructor(params) {
        this.params = params
    }

    /**
     * 处理console事件
     */
    handleError() {
        this.registerInfo()
        this.registerWarn()
        this.registerError()
    }

    /**
     * 处理信息
     */
    registerInfo() {
        let _self = this
        console.tInfo = function () {
            _self.handleLog(ErrorLevelEnum.INFO, ErrorCategoryEnum.CONSOLE_INFO, arguments);
        }
    }

    /**
     * 处理警告
     */
    registerWarn() {
        let _self = this
        console.tWarn = function () {
            _self.handleLog(ErrorLevelEnum.WARN, ErrorCategoryEnum.CONSOLE_WARN, arguments);
        }
    }

    /**
     * 处理错误
     */
    registerError() {
        let _self = this
        console.tError = function () {
            _self.handleLog(ErrorLevelEnum.ERROR, ErrorCategoryEnum.CONSOLE_ERROR, arguments);
        }
    }

    /**
     * 处理日志
     */
    handleLog(level, category, args) {
        let data = {}
        try {
            data.level = level
            data.category = category
            let params = [...args]
            data.msg = params.join('\r\n') // 换行符分割
            new Monitor(this.params).recordError(data)
        } catch (error) {
            console.log('console统计错误异常：', level, error)
        }
    }

}

/**
 * 初始化console事件
 */
(function () {
    //创建空console对象，避免JS报错  
    if (!window.console) {
        window.console = {};
    }
    let funcs = ['tInfo', 'tWarn', 'tError'];
    funcs.forEach((func, index) => {
        if (!console[func]) {
            console[func] = function () {};
        }
    });
})()

export default ConsoleError;