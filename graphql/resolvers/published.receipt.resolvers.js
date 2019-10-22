const { Converter, RedisCache } = require('../../utils');
const pageLimit = require('../../config/config').app.pageLimit;

const cache = {
  publishedReceipts: 'publishedReceipts',
};

function parseOrder(string) {
  if (string[0] === '-') {
    return { [string.slice(1)]: 'desc' };
  }
  return { [string]: 'asc' };
}

module.exports = {
  Query: {
    publishedReceipts: (parent, args, { models }) => {
      const { page, limit, order, BlockHeight } = args;
      const pg = page !== undefined ? parseInt(page) : 1;
      const lm = limit !== undefined ? parseInt(limit) : parseInt(pageLimit);
      const od = order !== undefined ? parseOrder(order) : { BlockHeight: 'asc' };
      const blockHeight = BlockHeight !== undefined ? { BlockHeight } : {};

      return new Promise((resolve, reject) => {
        const cachePublishedReceipts = Converter.formatCache(cache.publishedReceipts, args);
        RedisCache.get(cachePublishedReceipts, (err, resRedis) => {
          if (err) return reject(err);
          if (resRedis) return resolve(resRedis);

          models.PublishedReceipts.countDocuments((err, totalWithoutFilter) => {
            if (err) return reject(err);

            models.PublishedReceipts.where(blockHeight).countDocuments((err, totalWithFilter) => {
              if (err) return reject(err);

              models.PublishedReceipts.find()
                .where(blockHeight)
                .select()
                .limit(lm)
                .skip((pg - 1) * lm)
                .sort(od)
                .lean()
                .exec((err, data) => {
                  if (err) return reject(err);

                  const result = {
                    PublishedReceipts: data,
                    Paginate: {
                      Page: parseInt(pg),
                      Count: data.length,
                      Total: blockHeight ? totalWithFilter : totalWithoutFilter,
                    },
                  };

                  RedisCache.set(cachePublishedReceipts, result, err => {
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
