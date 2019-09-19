const { combineResolvers } = require('graphql-resolvers');
const { Accounts } = require('../../models');
const { Converter, RedisCache } = require('../../utils');

const pageLimit = require('../../config/config').app.pageLimit;
const cache = {
  Accounts: 'Accounts',
  Account: 'Account',
};

function parseOrder(string) {
  if (string[0] === '-') {
    return { [string.slice(1)]: 'desc' };
  }
  return { [string]: 'asc' };
}

module.exports = {
  Query: {
    Accounts: combineResolvers((parent, args, { models }) => {
      const { page, limit, order } = args;
      const pg = page !== undefined ? parseInt(page) : 1;
      const lm = limit !== undefined ? parseInt(limit) : parseInt(pageLimit);
      const od = order !== undefined ? parseOrder(order) : { _id: 'asc' };

      return new Promise((resolve, reject) => {
        const cacheAccounts = Converter.formatCache(cache.Accounts, args);
        RedisCache.get(cacheAccounts, (err, resRedis) => {
          if (err) return reject(err);
          if (resRedis) return resolve(resRedis);

          Accounts.find()
            .select()
            .limit(lm)
            .skip((pg - 1) * lm)
            .sort(od)
            .lean()
            .exec((err, result) => {
              if (err) return reject(err);
              RedisCache.set(cacheAccounts, result, err => {
                if (err) return reject(err);
                return resolve(result);
              });
            });
        });
      });
    }),

    Account: combineResolvers((parent, args, { models }) => {
      const { accountAddress } = args;
      return new Promise((resolve, reject) => {
        const cacheAccount = Converter.formatCache(cache.account, args);
        RedisCache.get(cacheAccount, (err, resRedis) => {
          if (err) return reject(err);
          if (resRedis) return resolve(resRedis);

          Accounts.findOne()
            .where({ AccountAddress: accountAddress })
            .lean()
            .exec((err, results) => {
              if (err) return reject(err);

              const result = Array.isArray(results) ? results[0] : results;
              RedisCache.set(cacheAccount, result, err => {
                if (err) return reject(err);
                return resolve(result);
              });
            });
        });
      });
    }),
  },
};
