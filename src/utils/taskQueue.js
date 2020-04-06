import API from '../http/api.js'

/**
 * 消息队列
 */
let TaskQueue = {

    queues: [],  // 待处理消息列表

    /**
     * 添加消息
     * @param {*} reportUrl 上报url
     * @param {*} data 上报数据
     */
    add(reportUrl, data){
        this.queues.push({reportUrl, data})
    },

    /**
     * 统一上报
     */
    fire() {
        if(!this.queues || this.queues.length === 0){
            return
        }
        let item = this.queues[0]
        item.reportUrl && new API(item.reportUrl).report(item.data)
        this.queues.splice(0, 1)
        this.fire() // 递归
    }
};

export default TaskQueue