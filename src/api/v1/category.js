const Router = require('koa-router');

const {
  CategoryValidator,
  PositiveIdParamsValidator
} = require('../../validators/category');

const { CategoryController } = require('../../controller/category');
const { Auth } = require('../../../middlewares/auth');

const { Resolve } = require('../../lib/helper');
const res = new Resolve();

const AUTH_ADMIN = 16;

const router = new Router({
  prefix: '/category'
})

/**
 * 创建分类
 */
router.post('/add', new Auth(AUTH_ADMIN).m, async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new CategoryValidator().validate(ctx);

  const [err, data] = await CategoryController.create({
    name: v.get('body.name'),
    status: v.get('body.status'),
    sort_order: v.get('body.sort_order'),
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
 * 删除分类
 */
router.post('/delete', new Auth(AUTH_ADMIN).m, async (ctx) => {

  // 通过验证器校验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);

  // 获取分类ID参数
  const id = v.get('body.id');
  // 删除分类
  const [err, data] = await CategoryController.delete(id);
  if (!err) {
    ctx.response.status = 200;
    ctx.body = res.success('删除分类成功');
  } else {
    ctx.body = res.fail(err);
  }
})


/**
 * 更新分类
 */
router.post('/update', new Auth(AUTH_ADMIN).m, async (ctx) => {

  // 通过验证器校验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);

  // 获取分类ID参数
  const id = v.get('body.id');
  // 更新分类
  const [err, data] = await CategoryController.update(id, v);
  if (!err) {
    ctx.response.status = 200;
    ctx.body = res.success('更新分类成功');
  } else {
    ctx.body = res.fail(err);
  }
})

/**
 * 获取所有的分类
 */
router.post('/all', async (ctx) => {
  const [err, data] = await CategoryController.list(ctx.request.body);
  if (!err) {
    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.json(data);
  } else {
    ctx.body = res.fail(err);
  }
})

/**
 * 获取分类详情
 */
router.post('/detail', async (ctx) => {

  // 通过验证器校验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);

  // 获取参数
  const id = v.get('body.id');
  // 获取分类
  const [err, data] = await CategoryController.detail(id);
  if (!err) {
    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.json(data);
  } else {
    ctx.body = res.fail(err);
  }
})

module.exports = router
