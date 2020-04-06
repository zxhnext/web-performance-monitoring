import Monitor from '../utils/monitor.js'
import {
    ErrorCategoryEnum,
    ErrorLevelEnum
} from '../utils/config.js'
/**
 * 捕获JS错误
 * onerror用来捕捉预料之外的错误，而try-catch用来在可预见情况下监控特定的错误，两者组合使用更加高效
 * 无论是异步还是非异步错误，onerror都能捕获到运行时错误
 * 当遇到 < img src = "./404.png" > 报404错误异常的时候， 它捕获不到
 * window.onerror只有在函数返回true的时候， 异常才不会向上抛出， 否则即使知道异常的发生控制台还是会显示错误
 * try不能检测到语法错误, 词法解析就挂了，语法解析错误是捕获不了的, onerror也不行
 * try-catch 处理异常的能力有限，只能捕获捉到运行时非异步错误，对于语法错误和异步错误就显得无能为力，捕捉不到。
 */
class JSError {

    constructor(params, newCaptureClick) {
        this.params = params
        this.newCaptureClick = newCaptureClick
    }

    /**
     * window.onerror能捕捉到语法错误，但是语法出错的代码块不能跟window.onerror在同一个块（语法都没过，更别提window.onerror会被执行了）
     * 只要把window.onerror这个代码块分离出去，并且比其他脚本先执行（ 注意这个前提！） 即可捕捉到语法错误。
     * 可以捕捉语法错误，也可以捕捉运行时错误；
     * 可以拿到出错的信息，堆栈，出错的文件、行号、列号；
     * 只要在当前页面执行的js脚本出错都会捕捉到，例如：浏览器插件的javascript、或者flash抛出的异常等。
     * 跨域的资源需要特殊头部支持。
     * 如果想通过onerror函数收集不同域的js错误， 我们需要做两件事：
     * 1. 服务端相关的js文件上加上Access-Control-Allow-Origin: * 的response header
     * 2. 客户端引用相关的js文件时加上crossorigin属性<script src="..." crossorigin="anonymous"></script>
     * 
     * 采用异步的方式
     * window.onunload会进行ajax的堵塞上报
     * 由于客户端强制关闭webview导致这次堵塞上报有Network Error
     * 猜测这里window.onerror的执行流在关闭前是必然执行的
     * 而离开页面之后的上报对于业务来说是可丢失的
     * 所以把这里的执行流放到异步事件去执行
     * 脚本的异常数降低了10倍
     */
    handleError() {
        let data = {}
        window.onerror = (msg, url, line, col, error) => {
            try {
                // 没有URL不上报！上报也不知道错误
                if (msg != "Script error." && !url) {
                    return true
                }
                let key = msg.match(/(\w+)/g) || []
                data.level = ErrorLevelEnum.WARN
                data.category = ErrorCategoryEnum.JS_ERROR
                data.name = key.length > 0 && key[0]
                data.type = key.length > 1 && key[1]
                data.msg = msg || null
                data.url = url || null
                data.line = line || null
                // 不一定所有浏览器都支持col参数
                // 不过 [IE]下 window.event 对象提供了 errorLine 和 errorCharacter，以此来对应相应的行列号信息
                data.col = col || (window.event && window.event.errorCharacter) || null

                if (!!error && !!error.stack) {
                    // 如果浏览器有堆栈信息，直接使用
                    data.stack = error.stack.toString()

                } else if (!!arguments.callee) {
                    // 尝试通过callee拿堆栈信息
                    var ext = []
                    // arguments.callee指向arguments对象的拥有函数引用, caller指向调用它的函数
                    var fn = arguments.callee.caller
                    var floor = 3 // 这里只拿三层堆栈信息
                    while (fn && (--floor > 0)) {
                        ext.push(fn.toString())
                        //如果有环
                        if (fn === fn.caller) {
                            break
                        }
                        fn = fn.caller
                    }
                    ext = ext.join(',')
                    data.stack = ext
                }
                new Monitor(this.params, this.newCaptureClick).recordError(data)
            } catch (err) {
                console.log('js错误异常：', err)
            }
            return true
        }
    }
}
export default JSError