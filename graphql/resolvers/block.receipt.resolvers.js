const { Converter, RedisCache } = require('../../utils');
const pageLimit = require('../../config/config').app.pageLimit;

const cache = {
  blockReceipts: 'blockReceipts',
};

function parseOrder(string) {
  if (string[0] === '-') {
    return { [string.slice(1)]: 'desc' };
  }
  return { [string]: 'asc' };
}

module.exports = {
  Query: {
    blockReceipts: (parent, args, { models }) => {
      const { page, limit, order, BlockID } = args;
      const pg = page !== undefined ? parseInt(page) : 1;
      const lm = limit !== undefined ? parseInt(limit) : parseInt(pageLimit);
      const od = order !== undefined ? parseOrder(order) : { Height: 'asc' };
      const blockID = BlockID !== undefined ? { BlockID } : {};

      return new Promise((resolve, reject) => {
        const cacheBlockReceipts = Converter.formatCache(cache.blockReceipts, args);
        RedisCache.get(cacheBlockReceipts, (err, resRedis) => {
          if (err) return reject(err);
          if (resRedis) return resolve(resRedis);

          models.BlockReceipts.countDocuments((err, totalWithoutFilter) => {
            if (err) return reject(err);

            models.BlockReceipts.where(blockID).countDocuments((err, totalWithFilter) => {
              if (err) return reject(err);

              models.Blocks.find()
                .where(blockID)
                .select()
                .limit(lm)
                .skip((pg - 1) * lm)
                .sort(od)
                .lean()
                .exec((err, data) => {
                  if (err) return reject(err);

                  const result = {
                    BlockReceipts: data,
                    Paginate: {
                      Page: parseInt(pg),
                      Count: data.length,
                      Total: blockID ? totalWithFilter : totalWithoutFilter,
                    },
                  };

                  RedisCache.set(cacheBlockReceipts, result, err => {
                    if (err) return reject(err);
                    return resolve(result);
                  });
                });
            });
          });
        });
      });
    },
  },
};
