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
      const { page, limit, order, NodePublicKey } = args;
      const pg = page !== undefined ? parseInt(page) : 1;
      const lm = limit !== undefined ? parseInt(limit) : parseInt(pageLimit);
      const od = order !== undefined ? parseOrder(order) : { Height: 'asc' };
      const npkBuff = new Buffer(NodePublicKey, 'base64');
      const nodePublicKey = NodePublicKey !== undefined ? { BlocksmithAddress: npkBuff } : {};

      return new Promise((resolve, reject) => {
        const cacheBlocks = Converter.formatCache(cache.blocks, args);
        RedisCache.get(cacheBlocks, (err, resRedis) => {
          if (err) return reject(err);
          if (resRedis) return resolve(resRedis);

          models.Blocks.countDocuments((err, totalWithoutFilter) => {
            if (err) return reject(err);

            models.Blocks.where(nodePublicKey).countDocuments((err, totalWithFilter) => {
              if (err) return reject(err);

              models.Blocks.find()
                .where(nodePublicKey)
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
                      Total: nodePublicKey ? totalWithFilter : totalWithoutFilter,
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
