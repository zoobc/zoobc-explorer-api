const BaseService = require('./BaseService');
const { BlockReceipts } = require('../../models');

module.exports = class BlockReceiptsService extends BaseService {
  constructor() {
    super(BlockReceipts);
  }

  getLastHeight(callback) {
    BlockReceipts.findOne()
      .select('Height')
      .sort('-Height')
      .exec(callback);
  }

  getFromHeight({ Limit, Height }, callback) {
    BlockReceipts.find()
      .select('BlockID Height')
      .where('Height')
      .gte(Height)
      .limit(Limit)
      .sort('Height')
      .exec(callback);
  }
};
