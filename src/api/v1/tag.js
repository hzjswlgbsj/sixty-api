const Router = require('koa-router');

const {
  TagValidator,
  PositiveIdParamsValidator
} = require('../../validators/tag');

const { TagController } = require('../../controller/tag');
const { Auth } = require('../../../middlewares/auth');

const { Resolve } = require('../../lib/helper');
const res = new Resolve();

const AUTH_ADMIN = 16;

const router = new Router({
  prefix: '/tag'
})

/**
 * 创建标签
 */
router.post('/add', new Auth(AUTH_ADMIN).m, async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new TagValidator().validate(ctx);
  const [err, data] = await TagController.create({
    name: v.get('body.name'),
    status: v.get('status'),
    sort_order: v.get('sort_order'),
    parent_id: v.get('body.parent_id'),
  });

  if (!err) {
    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.json(data)
  } else {
    ctx.body = res.fail(err)
  }
})


/**
 * 删除标签
 */
router.post('/delete', new Auth(AUTH_ADMIN).m, async (ctx) => {

  // 通过验证器校验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);

  // 获取标签ID参数
  const id = v.get('body.id');
  // 删除标签
  const [err, data] = await TagController.delete(id);
  if (!err) {
    ctx.response.status = 200;
    ctx.body = res.success('删除标签成功');
  } else {
    ctx.body = res.fail(err);
  }
})


/**
 * 更新标签
 */
router.post('/update', new Auth(AUTH_ADMIN).m, async (ctx) => {

  // 通过验证器校验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);

  // 获取标签ID参数
  const id = v.get('body.id');
  // 更新标签
  const [err, data] = await TagController.update(id, v);
  if (!err) {
    ctx.response.status = 200;
    ctx.body = res.success('更新标签成功');
  } else {
    ctx.body = res.fail(err);
  }
})

/**
 * 获取所有的标签
 */
router.post('/all', async (ctx) => {
  // 没有缓存，则读取数据库
  const [err, data] = await TagController.list(ctx.request.body);
  if (!err) {
    ctx.response.status = 200;
    ctx.body = res.json(data)
  } else {
    ctx.body = res.fail(err)
  }
});

/**
 * 获取标签详情
 */
router.post('/detail', async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);

  // 获取参数
  const id = v.get('body.id');
  // 获取标签
  const [err, data] = await TagController.detail(id);
  if (!err) {
    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.json(data);
  } else {
    ctx.body = res.fail(err);
  }
})

module.exports = router
