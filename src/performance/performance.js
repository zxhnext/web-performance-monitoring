// 页面性能监控

let ttiTime = {} // FP FCP longtask容器

// FP FCP
const observerPaint = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        ttiTime[entry.name] = entry.startTime + entry.duration // startTime启动时间 duration 执行时间
    }
})

observerPaint.observe({
    entryTypes: ['paint']
})

// longtask
// 长任务建议在空闲时执行 requestIdleCallback+webwork
// 耗时较长的任务阻塞主线程(超过50ms)
const observerLongTask = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        ttiTime[entry.name] = entry.startTime + entry.duration
    }
})

observerLongTask.observe({
    entryTypes: ['longtask']
})

/**
 * 获取时间
 */
function getTiming() {
    try {
        if (!window.performance || !window.performance.timing) {
            console.log('你的浏览器不支持 performance 操作')
            return
        }
        const {
            timing
        } = window.performance
        let times = {}
        const loadTime = timing.loadEventEnd - timing.loadEventStart
        if (loadTime < 0) {
            setTimeout(() => {
                getTiming()
            }, 200)
            return
        }
        // 网络建立连接
        // 上一个页面卸载总耗时
        times.prevPage = timing.fetchStart - timing.navigationStart
        // 上一个页面卸载
        times.prevUnload = timing.unloadEventEnd - timing.unloadEventStart
        //【重要】重定向的时间
        times.redirectTime = timing.redirectEnd - timing.redirectStart
        // DNS 缓存时间
        times.appcacheTime = timing.domainLookupStart - timing.fetchStart
        //【重要】DNS 查询时间
        //【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
        times.dnsTime = timing.domainLookupEnd - timing.domainLookupStart
        //【重要】读取页面第一个字节的时间
        //【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
        times.ttfbTime = timing.responseStart - timing.navigationStart
        // tcp连接耗时
        times.tcpTime = timing.connectEnd - timing.connectStart
        // 网络总耗时
        times.network = timing.connectEnd - timing.navigationStart

        // 网络接收数据
        // 前端从发送请求到接收请求的时间
        times.send = timing.responseStart - timing.requestStart
        // 接收数据用时
        //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
        times.receive = timing.responseEnd - timing.responseStart
        // 请求页面总耗时
        times.request = timing.responseEnd - timing.requestStart

        // 前端渲染
        // 解析dom树耗时
        times.analysisTime = timing.domComplete - timing.domInteractive // timing.domLoading
        //【重要】执行 onload 回调函数的时间
        //【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
        times.onload = timing.loadEventEnd - timing.loadEventStart
        // 前端总时间
        times.frontend = timing.loadEventEnd - timing.domLoading

        // 白屏时间
        times.blankTime = timing.domLoading - timing.navigationStart
        // domReadyTime(dom准备时间)
        times.domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart
        //【重要】页面加载完成的时间
        //【原因】这几乎代表了用户等待页面可用的时间
        times.loadPage = timing.loadEventEnd - timing.navigationStart
        // 可操作时间
        times.domIteractive = timing.domInteractive - timing.navigationStart

        const perfEntries = performance.getEntriesByType('mark')
        for (const entry of perfEntries) {
            ttiTime[entry.name] = entry.startTime + entry.duration
            performance.clearMarks(entry.name)
        }

        return Object.assign(times, ttiTime) 

    } catch (e) {
        console.log('获取performance出错:', e)
    }
}

/**
 * 资源加载时间
 */
function getEntries() {
    if (!window.performance || !window.performance.getEntries) {
        console.log('该浏览器不支持performance.getEntries方法')
        return
    }
    let entryTimesList = []
    let entryList = window.performance.getEntries()
    if (!entryList || entryList.length == 0) {
        return entryTimesList
    }
    entryList.forEach(item => {
        let templeObj = {}
        let usefulType = ['script', 'css', 'fetch', 'xmlhttprequest', 'link', 'img'] // 'navigation'
        if (usefulType.indexOf(item.initiatorType) > -1) {
            // 请求资源路径
            templeObj.name = item.name
            // 发起资源类型
            templeObj.initiatorType = item.initiatorType
            // http协议版本
            templeObj.nextHopProtocol = item.nextHopProtocol
            // dns查询耗时
            templeObj.dnsTime = item.domainLookupEnd - item.domainLookupStart
            // tcp链接耗时
            templeObj.tcpTime = item.connectEnd - item.connectStart
            // 请求时间
            templeObj.reqTime = item.responseEnd - item.responseStart
            // 重定向时间
            templeObj.redirectTime = item.redirectEnd - item.redirectStart
            entryTimesList.push(templeObj)
        }
    })
    return entryTimesList
}

function clearPerformance() {
    if (window.performance && window.performance.clearResourceTimings) {
        performance.clearResourceTimings()
    }
}

/**
 * 获取函数运行时常
 */
function measure(fn) {
    // const startName = prefixStart(name)
    // const endName = prefixEnd(name)
    // performance.mark(startName)
    const t0 = performance.now()
    // await fn()
    fn()
    const t1 = performance.now()
    // performance.mark(endName)
    // 调用 measure
    // performance.measure(name, startName, endName)
    // const [{
    //     duration
    // }] = performance.getEntriesByName(name)
    // performance.clearMarks(`${MARK_START}${name}`)
    // performance.clearMarks(`${MARK_END}${name}`)
    // performance.clearMeasures(name)
    return t1 - t0
}

/**
 * 分domReady和onLoad两个方法是因为有可能资源未全部加载完成就关闭了浏览器窗口
 */
function domReady(callback) {
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
}

function onLoad(callback) {
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

/**
 * 资源加载完毕
 */
function resourceOnLoad (cb) {
    // 资源都加载完成
    if (document.readyState === 'complete') {
        cb()
        return
    }
    window.addEventListener('load', () => {
        cb()
    }, false)
}


export {
    getTiming,
    getEntries,
    clearPerformance,
    measure,
    domReady,
    onLoad,
    resourceOnLoad
}

// performance.now()
// const t0 = performance.now()
// for (let i = 0; i < array.length; i++) {
//      some code
// }
// const t1 = performance.now()
// console.log(t1 - t0, 'milliseconds')

// console.time('test')
// console.time('test')
// for (let i = 0; i < array.length; i++) {
//   // some code
// }
// console.timeEnd('test')