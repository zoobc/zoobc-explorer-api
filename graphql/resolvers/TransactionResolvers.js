// const { ForbiddenError } = require('apollo-server');
const { combineResolvers } = require('graphql-resolvers');
const { Transactions } = require('../../models');
const { Converter, RedisCache } = require('../../utils');

const pageLimit = require('../../config/config').app.pageLimit;
const page = 1;

const cache = {
  transactions: 'transactions',
  transaction: 'transaction',
};

function parseOrder(string) {
  if (string[0] === '-') {
    return { [string.slice(1)]: 'desc' };
  }
  return { [string]: 'asc' };
}

module.exports = {
  Query: {
    transactions: combineResolvers(async (parent, args, { models }) => {
      const { page, limit, order } = args;
      const pg = page !== undefined ? parseInt(page) : 1;
      const lm = limit !== undefined ? parseInt(limit) : parseInt(pageLimit);
      const od = order !== undefined ? parseOrder(order) : { _id: 'asc' };

      return new Promise((resolve, reject) => {
        const cacheTransaction = Converter.formatCache(cache.transactions, args);
        RedisCache.get(cacheTransaction, (err, resRedis) => {
          if (err) return reject(err);
          if (resRedis) return resolve(resRedis);

          models.Transactions.find()
            .select()
            .limit(lm)
            .skip((pg - 1) * lm)
            .sort(od)
            .lean()
            .exec((err, result) => {
              if (err) return reject(err);

              RedisCache.set(cacheTransaction, result, err => {
                if (err) return reject(err);
                return resolve(result);
              });
            });
        });
      });
    }),

    transaction: combineResolvers(async (parent, args, { models }) => {
      const { ID } = args;
      return new Promise((resolve, reject) => {
        const cacheTransaction = Converter.formatCache(cache.transaction, args);
        RedisCache.get(cacheTransaction, (err, resRedis) => {
          if (err) return reject(err);
          if (resRedis) return resolve(resRedis);

          models.Transactions.findOne()
            .where({ ID: ID })
            .lean()
            .exec((err, results) => {
              if (err) return reject(err);

              const result = Array.isArray(results) ? results[0] : results;
              RedisCache.set(cacheTransaction, result, err => {
                if (err) return reject(err);
                return resolve(result);
              });
            });
        });
      });
    }),
  },
};
