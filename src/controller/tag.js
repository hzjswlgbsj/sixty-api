const { Op } = require('sequelize')
const { Tag } = require('../models/tag')

class TagController {
  // 创建分类
  static async create(params = {}) {
    const {
      name,
      color = '#7B68EE',
    } = params
    // 查询是否存在重复的分类
    const hasTag = await Tag.findOne({
      where: {
        name,
        deleted_at: null
      }
    });

    if (hasTag) {
      throw new global.errs.Existing('该标签已存在');
    }

    const tag = new Tag();
    tag.name = name
    tag.color = color

    try {
      const res = await tag.save();
      return [null, res]
    } catch (err) {
      return [err, null]
    }
  }

  // 删除分类
  static async destroy(id) {
    // 查询分类
    const tag = await Tag.findOne({
      where: {
        id,
        deleted_at: null
      }
    });
    if (!tag) {
      throw new global.errs.NotFound('没有找到相关标签');
    }
    try {
      const res = await tag.destroy()
      return [null, res]

    } catch (err) {
      return [err, null]
    }
  }

  // 获取分类详情
  static async detail(id) {
    try {
      const tag = await Tag.scope('bh').findOne({
        where: {
          id,
          deleted_at: null
        }
      });
      if (!tag) {
        throw new global.errs.NotFound('没有找到相关标签');
      }

      return [null, tag]
    } catch (err) {
      return [err, null]
    }
  }

  // 更新分类
  static async update(id, v) {
    const tag = await Tag.findByPk(id);
    if (!tag) {
      throw new global.errs.NotFound('没有找到相关分类');
    }
    tag.name = v.get('body.name');
    tag.status = v.get('body.status');
    tag.sort_order = v.get('body.sort_order');
    tag.parent_id = v.get('body.parent_id') || 0;

    try {
      const res = await tag.save();
      return [null, res]
    } catch (err) {
      return [err, null]
    }
  }

  // 分类列表
  static async list(query = {}) {
    const { status, name, id, page_size = 10, page = 1 } = query
    let params = {}
    if (status) {
      params.status = status
    }

    if (name) {
      params.name = {
        [Op.like]: `%${name}%`
      };
    }

    if (id) {
      params.id = id
    }

    console.log('params', params)
    try {
      const tag = await Tag.scope('bh').findAndCountAll({
        where: params,
        limit: page_size, //每页10条
        offset: (page - 1) * page_size,
        order: [
          ['created_at', 'DESC']
        ]
      });

      const data = {
        data: tag.rows,
        // 分页
        meta: {
          current_page: parseInt(page),
          per_page: 10,
          count: tag.count,
          total: tag.count,
          total_pages: Math.ceil(tag.count / 10),
        }
      }

      return [null, data]

    } catch (err) {
      console.log('err', err)

      return [err, null]
    }
  }
}

module.exports = {
  TagController
}
