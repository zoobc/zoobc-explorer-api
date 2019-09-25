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
    fields = fields !== undefined ? fields.replace(/,/g, ' ') : {};
    order = order !== undefined ? BaseService.parseOrder(order) : { _id: 'asc' };

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

  findAll({ fields, where, order }, callback) {
    where = where !== undefined ? where : {};
    fields = fields !== undefined ? fields.replace(/,/g, ' ') : {};
    order = order !== undefined ? BaseService.parseOrder(order) : { _id: 'asc' };

    this.model
      .find(where)
      .select(fields)
      .sort(order)
      .lean()
      .exec((err, result) => {
        if (err) {
          callback(err, null);
          return;
        }

        callback(null, result);
      });
  }

  destroyMany(payload, callback) {
    this.model.deleteMany(payload, callback);
  }

  upsert(items, matchs, callback) {
    this.model.upsertMany(items, matchs, callback);
  }
};
