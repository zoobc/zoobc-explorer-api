const pageLimit = require('../../config/config').app.pageLimit;

module.exports = class BaseService {
  constructor(model) {
    this.model = model;
  }

  static parseOrder(string) {
    if (string[0] === '-') {
      return { [string.slice(1)]: 'desc' };
    }
    return { [string]: 'asc' };
  }

  paginate({ page, limit, fields, order }, callback) {
    page = page !== undefined ? parseInt(page) : 1;
    limit = limit !== undefined ? parseInt(limit) : parseInt(pageLimit);
    order = order !== undefined ? BaseService.parseOrder(order) : { _id: 'asc' };
    fields = fields !== undefined ? fields.replace(/,/g, ' ') : {};

    this.model.countDocuments((err, total) => {
      if (err) {
        callback(err, null);
        return;
      }

      this.model
        .find()
        .select(fields)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(order)
        .lean()
        .exec((err, data) => {
          if (err) {
            callback(err, null);
            return;
          }

          const result = {
            data,
            paginate: {
              page: parseInt(page),
              count: data.length,
              total,
            },
          };
          callback(null, result);
        });
    });
  }

  findOne(where, callback) {
    this.model
      .findOne()
      .where(where)
      .lean()
      .exec((err, results) => {
        if (err) {
          callback(err, null);
          return;
        }

        const result = Array.isArray(results) ? results[0] : results;
        callback(null, result);
      });
  }

  upsert(items, matchs, callback) {
    this.model.upsertMany(items, matchs, callback);
  }
};
