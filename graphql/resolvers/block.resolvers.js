const { Converter, RedisCache } = require('../../utils');
const pageLimit = require('../../config/config').app.pageLimit;
const cache = {
  blocks: 'blocks',
  block: 'block',
};

function parseOrder(string) {
  if (string[0] === '-') {
    return { [string.slice(1)]: 'desc' };
  }
  return { [string]: 'asc' };
}

module.exports = {
  Query: {
    blocks: (parent, args, { models }) => {
      const { page, limit, order } = args;
      const pg = page !== undefined ? parseInt(page) : 1;
      const lm = limit !== undefined ? parseInt(limit) : parseInt(pageLimit);
      const od = order !== undefined ? parseOrder(order) : { Height: 'asc' };

      return new Promise((resolve, reject) => {
        const cacheBlocks = Converter.formatCache(cache.blocks, args);
        RedisCache.get(cacheBlocks, (err, resRedis) => {
          if (err) return reject(err);
          if (resRedis) return resolve(resRedis);

          models.Blocks.countDocuments((err, total) => {
            if (err) return reject(err);

            models.Blocks.find()
              .select()
              .limit(lm)
              .skip((pg - 1) * lm)
              .sort(od)
              .lean()
              .exec((err, data) => {
                if (err) return reject(err);

                const result = {
                  Blocks: data,
                  Paginate: {
                    Page: parseInt(pg),
                    Count: data.length,
                    Total: total,
                  },
                };

                RedisCache.set(cacheBlocks, result, err => {
                  if (err) return reject(err);
                  return resolve(result);
                });
              });
          });
        });
      });
    },

    block: (parent, args, { models }) => {
      const { BlockID } = args;

      return new Promise((resolve, reject) => {
        const cacheBlock = Converter.formatCache(cache.block, args);
        RedisCache.get(cacheBlock, (err, resRedis) => {
          if (err) return reject(err);
          if (resRedis) return resolve(resRedis);

          models.Blocks.findOne()
            .where({ BlockID: BlockID })
            .lean()
            .exec((err, result) => {
              if (err) return reject(err);
              if (!result) return resolve({});

              RedisCache.set(cacheBlock, result, err => {
                if (err) return reject(err);
                return resolve(result);
              });
            });
        });
      });
    },
  },
};
