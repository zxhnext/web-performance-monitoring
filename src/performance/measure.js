export default {
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