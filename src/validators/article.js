const {
  Rule,
  LinValidator
} = require('../../core/lin-validator-v2')

const { Category } = require('../models/category')

class ArticleValidator extends LinValidator {
  constructor() {
    super();
    this.title = [new Rule("isLength", "文章标题 title 不能为空", { min: 1 })];
    this.introduction = [new Rule("isLength", "文章简介 introduction 不能为空", { min: 1 })];
    this.nickname = [new Rule("isLength", "文章作者 nickname 不能为空", { min: 1 })];
    this.cover_picture = [new Rule("isLength", "文章封面 cover_picture 不能为空", { min: 1 })];
    this.content = [new Rule("isLength", "文章内容 content 不能为空", { min: 1 })];
  }

  async validateCategoryId(vals) {
    const categoryId = vals.body.category_id;

    const category = await Category.findOne({
      where: {
        id: categoryId
      }
    });

    if (!category) {
      throw new Error('暂无此分类ID')
    }
  }
}

class PositiveIdParamsValidator extends LinValidator {
  constructor() {
    super();
    this.id = [
      new Rule('isInt', '文章ID需要正整数', { min: 1 })
    ]
  }
}

class ArticleSearchValidator extends LinValidator {
  constructor() {
    super();
    this.keyword = [
      new Rule('isLength', '必须传入搜索关键字', { min: 1 })
    ]
  }
}

module.exports = {
  ArticleValidator,
  PositiveIdParamsValidator,
  ArticleSearchValidator
}
