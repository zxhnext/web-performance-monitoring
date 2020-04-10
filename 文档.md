### 1、异常捕获详情
* 1）js错误信息监控；
* 2）支持vue错误信息监控(需要将vue传入，并设置vueError:true)；
* 3）支持promise中未捕获异常信息的抓取；
* 4）支持console.error错误信息捕获；
* 5）支持资源错误信息捕获；
* 6）支持ajax库（xhr）异常信息捕获；
* 7）支持fetch异常信息捕获；
* 8）支持iframe异常信息捕获；
* 9）支持截屏上报；




### 2、页面性能监控
* 1）上一个页面卸载总耗时 prevPage；
* 2）上一个页面卸载 prevUnload；
* 3）重定向的时间 redirectTime；
* 4）DNS 缓存时间 appcacheTime；
* 5）DNS 查询时间 dnsTime；

* 6）读取页面第一个字节的时间 ttfbTime；
* 7）tcp连接耗时 tcpTime；
* 8）网络总耗时 network；

* 9）前端从发送请求到接收请求的时间 send；
* 10）接收数据用时 receive；
* 11）请求页面总耗时 request；

* 12）解析dom树耗时 analysisTime；
* 13）执行 onload 回调函数的时间 onload；
* 14）前端总时间 frontend；

* 15）白屏时间 blankTime；
* 16）dom准备时间 domReadyTime；
* 17）页面加载完成的时间 loadPage；
* 18）可操作时间 domIteractive；
* 19）FP；
* 20）FCP；
* 21）TTI；
* 22）longtask；
* ...

### 3、设备信息采集
* 1）设备类型；
* 2）操作系统；
* 3）操作系统版本；
* 4）屏幕高、屏幕宽；
* 5）当前使用的语言-国家；
* 6）联网类型；
* 7）横竖屏；
* 8）浏览器信息；
* 9）浏览器指纹；
* 10）userAgent；
* ...

### 4、引入方式
```
1、支持es6方式引入
import monitorJS from 'web-performance-monitoring'

# 2、支持commonjs方式引入
# const monitorJS = require('web-performance-monitoring')

# 3、支持AMD方式引入
# define(['../node_modules/web-performance-monitoring/dist/monitorjs.min.js'],(monitorJS)=>{})

4、支持<script>标签引入方式
<script src="../node_modules/web-performance-monitoring/dist/monitorjs.min.js"></script>
```

### 5、异常监控Usage
```
1）异常监控初始化代码：
monitorJS.init({
    url: '', // 上报错误地址
    consoleError: true, // 配置是否需要记录console.error错误信息
    vueError: true, // 是否上报Vue错误
    vue: Vue, // 如需监控vue错误信息，则需要传入vue
    extendsInfo: { // 自定义扩展信息，一般用于数据持久化区分
        a: '', // 自定义信息a（名称可自定义）可参考测试栗子 module
        b: '', // 自定义信息b（名称可自定义）
        getDynamic: () => {  // 获取动态传参
            
        }
    }
})

2）参数说明：
{
    url: 错误上报地址
    jsError: 配置是否需要监控js错误（默认true）
    frameError: 配置是否需要监控iframe错误（默认true）
    promiseError: 配置是否需要监控promise错误（默认true）
    resourceError: 配置是否需要监控资源错误（默认true）
    ajaxError: 配置是否需要监控ajax错误（默认true）
    consoleError: 配置是否需要监控console.error错误（默认false）
    vueError: 配置是否需要记录vue错误信息（默认false）
    vue: 如需监控vue错误信息，则需要传入vue
    capture: {
        captureClick: true, // 是否录屏，只录制点击区域
        captureMode: 2, // 截屏模式 1-最小区域 2 - 整屏，
        captureReportNum: 10 // 截屏上报个数(最多10个)
    }
    extendsInfo: { // 自定义扩展信息，一般用于数据持久化区分
        a: '', // 自定义信息a（名称可自定义）可参考测试栗子 module
        b: '', // 自定义信息b（名称可自定义）
        getDynamic: () => {  // 获取动态传参
            
        }
    }
}

3）响应（持久化数据）说明：
{
    category: '', // 错误类型(枚举)：js_error 、resource_error、vue_error、promise_error、ajax_error、console_info、console_warn、console_error、unknow_error
    logType: 'Info', // 日志类型(枚举) Error、Warning、Info
    logInfo: ', // 记录的信息
    deviceInfo: '', // 设备信息(JSON字符串)
    ...extendsInfo // 自定义扩展信息，一般用于数据持久化区分【如：1、项目区分(Project)；2、错误大类区分（前端错误、后端错误 等等）】
}
```

### 7、上报页面性能Usage
```
1）页面性能信息采集代码：
monitorJS.monitorPerformance({
    isPage: true,
    isResource: true,
    pageId: ,
    url: ''
})
2）参数说明：
{
    isPage: 是否上报页面性能数据
    isResource: 是否上报页面资源数据
    pageId: 页面唯一标示
    url: 信息采集上报地址
}

3）响应（持久化数据）说明：
{
    time: 1565161213722, // 上报时间
    deviceInfo: '', // 设备信息
    markUser: '',  // 用户标示
    markUv: '',  // uv采集
    pageId: '', // 页面唯一标示
    performance: {
        prevPage: '', // 上一个页面卸载总耗时
        prevUnload: '', // 上一个页面卸载
        redirectTime: '', // 重定向的时间
        appcacheTime: '', // DNS 缓存时间
        dnsTime: '', // DNS 查询时间
        ttfbTime: '', // 读取页面第一个字节的时间
        tcpTime: '', // tcp连接耗时
        network: '', // 网络总耗时
        send: '', // 前端从发送请求到接收请求的时间
        receive: '', // 接收数据用时
        request: '', // 请求页面总耗时
        analysisTime: '', // 解析dom树耗时
        onload: '', // 执行 onload 回调函数的时间
        frontend: '', // 前端总时间
        blankTime: '', // 白屏时间
        domReadyTime: '', // dom准备时间
        loadPage: '', // 页面加载完成的时间
        domIteractive: '', // 可操作时间
        first-paint: '', // FP
        first-contentful-paint: '', // FCP
        tti: '', // tti
    },
    resourceList: [
        {
            dnsTime: '', // dns查询耗时
            initiatorType: 'img', // 发起资源类型
            name: '', // 请求资源路径
            nextHopProtocol: '', // http协议版本
            redirectTime: 0, // 重定向时间
            reqTime: '', // 请求时间
            tcpTime: '', // tcp链接耗时
        }
    ],
}
```

### 8、获取函数运行时长
```
let time = monitorJS.measure(fn)
console.log('time', time)

function fn() {
    for(let i=0; i<100000; i++) {}
}
```

### 9、mark打点
```
<title>前端性能监控测试</title>
<style>
    body {
        background: gray;
    }
</style>
<link href="https://cdn.bootcss.com/animate.css/3.7.0/animate.min.css" rel="stylesheet">
<script>
    performance.mark("css done")
</script>
<body>
    <div id="app"></div>
    <script>
        performance.mark("text done")
    </script>
</body>
```

### 10、使用时机
1） 普通项目，页面初始化时候，就可以完成初始化监控工具（最好在业务代码的前面，避免监控有漏）;   
2） vue项目，需要在new Vue之前初始化监控工具，避免监控有漏;