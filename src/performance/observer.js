import API from "../library/api.js";
import pagePerformance from "./performance.js";
import ttiPolyfill from 'tti-polyfill';

let times = {}

// FP FCP
const observer1 = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        times[entry.name] = entry.startTime + entry.duration; // startTime启动时间 duration 执行时间
    }
});

observer1.observe({
    entryTypes: ["paint"]
});

// longtask
// 长任务建议在空闲时执行 requestIdleCallback+webwork
const observer2 = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        times[entry.name] = entry.startTime + entry.duration
    }
});

observer2.observe({
    entryTypes: ["longtask"]
});



export default{
    getTimesAndReport(params) {
        ttiPolyfill.getFirstConsistentlyInteractive().then((tti) => {
            // Use `tti` value in some way.
            //统计的数据
            const perfEntries = performance.getEntriesByType("mark");
            for (const entry of perfEntries) {
                times[entry.name] = entry.startTime + entry.duration
                performance.clearMarks(entry.name)
            }
            Object.assign(times, {pageId: params ? params.pageId : "", tti})
            console.log('observer', times)
            new API(params.url).report(times);
        });
    },
    measure(fn) {
        // const startName = prefixStart(name)
        // const endName = prefixEnd(name)
        // performance.mark(startName)
        const t0 = performance.now();
        // await fn()
        fn()
        const t1 = performance.now();
        // performance.mark(endName)
        // 调用 measure
        // performance.measure(name, startName, endName)
        // const [{
        //     duration
        // }] = performance.getEntriesByName(name)
        // performance.clearMarks(`${MARK_START}${name}`)
        // performance.clearMarks(`${MARK_END}${name}`)
        // performance.clearMeasures(name)
        return t1 - t0;
    }
}