const BaseService = require('./BaseService');
const { Blocks } = require('../../models');

module.exports = class BlocksService extends BaseService {
  constructor() {
    super(Blocks);
  }

  getLastHeight(callback) {
    Blocks.findOne()
      .select('Height')
      .sort('-Height')
      .exec(callback);
  }
};
