/**
 * 
 * @param {url} url  异步加载js
 */
const insertJs = (url = '') => {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = url
        document.querySelector('head').appendChild(script)
        script.onload=function(){
            resolve()
        }
        script.onerror=function(){
            reject('js加载失败')
        }
    })
}

class CaptureClick{
    constructor(params = {}) {
        this.captureClick = params.captureClick || false // 是否录屏，只录制点击区域
        this.captureMode = params.captureMode || 1 // 截屏模式 1-最小区域 2 - 整屏，
        this.captureReportNum = params.captureReportNum || 1 // 截屏上报个数(最多10个)
        this.capturedDoms = []
    }

    initCaptureClick () {
        let _self = this
        if (!_self.captureClick) return
        window.addEventListener('click', e => {
            let pathTemp = Array.from(e.path)
            // html2canvas截取目标只能是document内的dom，所以需要移除window和document
            pathTemp.pop() // 移除window
            pathTemp.pop() // 移除document
            if (_self.capturedDoms.length >= 10) {
                _self.capturedDoms.pop() // 抛出最后一个
            }
            //录屏模式 1- 最小 2- 全屏
            const path = _self.captureMode === 1 ? pathTemp[0] : pathTemp[pathTemp.length - 1]
            _self.capturedDoms.unshift(path) // 插入最前面
        }, true) // 捕获模式
    }

    /**
     * 录屏上报
     */
    reportCaptureImage () {
        if (!this.captureClick) {
            return
        }
        // 上报录屏个数合法性检查
        this.captureReportNum = this.captureReportNum > 10 ? 10 : this.captureReportNum
        this.captureReportNum = this.captureReportNum <= 0 ? 1 : this.captureReportNum
        const tobeReport = this.capturedDoms.slice(0, this.captureReportNum) || []
        // 从cdn上动态插入
        if (window.html2canvas) {
            if (tobeReport.length) {
                this.dom2img(tobeReport)
            }
        } else {
            insertJs("//unpkg.com/html2canvas@1.0.0-alpha.12/dist/html2canvas.min.js").then(() => {
                if (tobeReport.length && window.html2canvas) {
                    this.dom2img(tobeReport)
                }
            }).catch(error => {
                console.log('录屏失败：', error)
            }) 
        }  
    }

    dom2img (doms = []) {
        // 压缩图片地址
        let compressedUrlList = []
        if (window.LZString && LZString.compress) {
            doms.forEach((dom, index) => {
                html2canvas(dom).then(canvas => {
                    let imageUrl = canvas.toDataURL("image/png")
                    compressedUrlList[index] = LZString.compress(imageUrl) 
                    console.log('截屏压缩图片文件地址：', compressedUrlList[index])
                })
            })
        } else {
            insertJs('//unpkg.com/lz-string@1.4.4/libs/lz-string.js').then(() => {
                doms.forEach((dom, index) => {
                    html2canvas(dom).then(canvas => {
                        let imageUrl = canvas.toDataURL("image/png")
                        compressedUrlList[index] = LZString.compress(imageUrl) 
                        console.log('截屏压缩图片文件地址：', compressedUrlList[index])
                    })
                })
            }).catch(error => {
                console.log('压缩图片失败：', error)
            })
        }
    }
}

export default CaptureClick