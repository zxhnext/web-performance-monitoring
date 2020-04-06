
import Monitor from '../utils/monitor.js'
import {
    ErrorCategoryEnum,
    ErrorLevelEnum
} from '../utils/config.js'

/**
 * 捕获未处理的iframes异常
 */
class FramesError {
    constructor(params) {
        this.params = params
    }

    /**
     * 处理错误
     */
    handleError() {
        for(let i = 0; i < window.frames.length; i++) {
            let data = {}
            window.frames[i].onerror = (msg, url, row, col, error) => {
                try {
                    // 没有URL不上报！上报也不知道错误
                    if (msg != "Script error." && !url) {
                        return true
                    }
                    let key = msg.match(/(\w+)/g) || []
                    data.level = ErrorLevelEnum.WARN
                    data.category = ErrorCategoryEnum.IFRAME_ERROR
                    data.name = key.length > 0 && key[0]
                    data.type = key.length > 1 && key[1]
                    data.msg = msg || null
                    data.url = url || null
                    data.line = row || null
                    data.col = col || null
                    if (!!error && !!error.stack) {
                        // 如果浏览器有堆栈信息，直接使用
                        data.stack = error.stack.toString()
                    }
                    new Monitor(this.params).recordError(data)
                } catch (err) {
                    console.log('iframe错误异常：', err)
                }
                return true
            }
        }
    }
}

export default FramesError