### 1、页面性能监控
支持监控FP、FCP、TTI、long task、DNS查询时间、TCP连接耗时、接收数据用时、dom树耗时、白屏时间、页面加载完成时间等各项页面性能数据

### 2、异常捕获
支持捕获js、vue、promise、ajax、fetch、iframse等错误,并截屏上报

### 3、使用方式
```
# vue项目建议在new Vue()前引入，普通项目建议在业务代码前引入
```
```javascript
// 1. import 引入方式
import monitorJS from 'web-performance-monitoring'
// 2. 普通页面引入方式
<script src="../node_modules/web-performance-monitoring/dist/monitorjs.min.js"></script>

// 1. 页面性能监控
monitorJS.monitorPerformance({
    isPage: true, // 是否监控页面性能
    isResource: true, // 是否监控页面引入资源
    pageId: , // 页面标识
    url: '' // 上报接口
})

// 2. 异常错误捕获
monitorJS.init({
    url: '', // 错误上报地址
    jsError: true, // 配置是否需要监控js错误（默认true）
    frameError: true, // 配置是否需要监控iframe错误（默认true）
    promiseError: true, // 配置是否需要监控promise错误（默认true）
    resourceError: true, // 配置是否需要监控资源错误（默认true）
    ajaxError: true, // 配置是否需要监控ajax错误（默认true）
    consoleError: true, // 配置是否需要监控console.error错误（默认false）
    vueError: false, // 配置是否需要记录vue错误信息（默认false）
    vue: Vue, // 如需监控vue错误信息，则需要传入vue
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
})

// 3. 函数运行时常
let time = monitorJS.measure(fn)
console.log('time', time)

function fn() {
    for(let i=0; i<100000; i++) {}
}
```

```html
<!-- 4. mark打点 -->
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

### 4、页面性能上报数据详情
```javascript
// 页面性能数据
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

// error数据，具体参考打印上报信息
```

### 5、参考文章
[前端性能监控揭秘](https://juejin.im/post/5e9299956fb9a03c977543b7)