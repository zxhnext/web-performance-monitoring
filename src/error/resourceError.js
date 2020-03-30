import Monitor from "../library/monitor.js"
import {
    ErrorCategoryEnum,
    ErrorLevelEnum
}
from "../library/config.js"
/**
 * 资源加载错误
 */
class ResourceError extends Monitor {

    constructor(params) {
        super(params);
    }

    /**
     * 注册onerror事件
     * 由于网络请求异常不会事件冒泡，因此必须在捕获阶段将其捕捉到才行。
     * 这种方式虽然可以捕捉到网络请求的异常，但是无法判断 HTTP 的状态是 404 还是其他比如 500 等等，所以还需要配合服务端日志才进行排查分析才可以。
     */
    handleError() {
        window.addEventListener('error', (event) => {
            try {
                if (!event) {
                    return;
                }
                this.category = ErrorCategoryEnum.RESOURCE_ERROR;
                let target = event.target || event.srcElement;
                var isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement;
                if (!isElementTarget) {
                    return; // js error不再处理
                }
                this.level = target.tagName.toUpperCase() === 'IMG' ? ErrorLevelEnum.WARN : ErrorLevelEnum.ERROR;
                this.msg = "加载 " + target.tagName + " 资源错误";
                this.url = target.src || target.href;
                this.errorObj = target;
                this.recordError();
            } catch (error) {
                console.log("资源加载收集异常", error);
            }
        }, true);
    }
}
export default ResourceError;

// performance.clearResourceTimings();

// object.onerror
// 如script，image等标签src引用，会返回一个event对象 ,TIPS: object.onerror不会冒泡到window对象，所以window.onerror无法监控资源加载错误

// var img = new Image();
// img.src = 'http://xxx.com/xxx.jpg';
// img.onerror = function(event) {
//     console.log(event);
// }

// 统计每个页面的JS和CSS加载时间
{/* <script>var cssLoadStart = +new Date</script>
<link rel="stylesheet" href="xxx.css" type="text/css" media="all">
<link rel="stylesheet" href="xxx1.css" type="text/css" media="all">
<link rel="stylesheet" href="xxx2.css" type="text/css" media="all">
<sript>
   var cssLoadTime = (+new Date) - cssLoadStart;
   var jsLoadStart = +new Date;
</script>
<script type="text/javascript" src="xx1.js"></script>
<script type="text/javascript" src="xx2.js"></script>
<script type="text/javascript" src="xx3.js"></script>
<script>
   var jsLoadTime = (+new Date) - jsLoadStart;
   var REPORT_URL = 'xxx/cgi?data='
   var img = new Image;
   img.onload = img.onerror = function(){
      img = null;
   };
   img.src = REPORT_URL + cssLoadTime + '-' + jsLoadTime;
</script> */}