const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
// 启动路由
app.use(router.routes()).use(router.allowedMethods())


router.post('/api/home', async ctx => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  ctx.status = 400
  ctx.body = {
    success: 'false',
  };
})

router.get('/api/list', async ctx => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  // ctx.body = {
  //   success: 'true',
  //   data: [
  //     {id: 1},
  //     {id: 2},
  //     {id: 3},
  //   ]
  // };

  ctx.body = {
    success: 'false',
    data: {
      a: 1
    }
  };
})

// 监听端口、启动程序
app.listen(3000, err => {
    if (err) throw err;
    console.log('runing...');
})