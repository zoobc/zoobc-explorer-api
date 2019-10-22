const BaseService = require('./BaseService');
const { PublishedReceipts } = require('../../models');

module.exports = class PublishedReceiptsService extends BaseService {
  constructor() {
    super(PublishedReceipts);
  }

  getLastHeight(callback) {
    PublishedReceipts.findOne()
      .select('BlockHeight')
      .sort('-BlockHeight')
      .exec(callback);
  }

  getFromHeight({ Limit, Height }, callback) {
    PublishedReceipts.find()
      .select('BlockID Height')
      .where('BlockHeight')
      .gte(Height)
      .limit(Limit)
      .sort('BlockHeight')
      .exec(callback);
  }
};
