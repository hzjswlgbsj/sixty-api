const {
  Rule,
  LinValidator
} = require('../../core/lin-validator-v2')

class TagValidator extends LinValidator {
  constructor() {
    super()
    this.name = [new Rule("isLength", "标签 name 名字不能为空", { min: 1 })]
  }
}

class PositiveIdParamsValidator extends LinValidator {
  constructor() {
    super();
    this.id = [
      new Rule('isInt', '分类ID需要正整数', { min: 1 })
    ]
  }
}

module.exports = {
  TagValidator,
  PositiveIdParamsValidator
}
