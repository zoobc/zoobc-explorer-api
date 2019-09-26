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

  getFromHeight({ Limit, Height }, callback) {
    Blocks.find()
      .select('BlockID Height')
      .where('Height')
      .gte(Height)
      .limit(Limit)
      .sort('Height')
      .exec(callback);
  }

  getAggregateFromHeight({ Limit, Height }, callback) {
    Blocks.aggregate([
      { $match: { Height: { $gte: Height } } },
      { $group: { _id: '$BlockID', Height: { $addToSet: '$Height' } } },
      { $limit: Limit },
      { $sort: { Height: -1 } },
    ]).exec((err, results) => {
      if (err) return callback(err, null);
      if (results && results.length < 1) return callback(null, null);

      const datas = results.map(result => {
        return {
          BlockID: result._id,
          Height: Array.isArray(result.Height) ? result.Height[0] : result.Height,
        };
      });
      return callback(null, datas);
    });
  }
};
