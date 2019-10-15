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

  paginate({ page, limit, fields, where, order }, callback) {
    page = page !== undefined ? parseInt(page) : 1;
    limit = limit !== undefined ? parseInt(limit) : parseInt(pageLimit);
    fields = fields !== undefined ? fields.replace(/,/g, ' ') : {};
    order = order !== undefined ? BaseService.parseOrder(order) : { _id: 'asc' };
    where = where !== undefined ? { [where.split(':')[0]]: where.split(':')[1].toString() } : {};

    this.model.countDocuments(where, (err, total) => {
      if (err) return callback(err, null);

      this.model
        .find(where)
        .select(fields)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(order)
        .lean()
        .exec((err, data) => {
          if (err) return callback(err, null);

          const result = {
            data,
            paginate: {
              page: parseInt(page),
              count: data.length,
              total,
            },
          };
          return callback(null, result);
        });
    });
  }

  findOne(where, callback) {
    this.model
      .findOne()
      .where(where)
      .lean()
      .exec((err, results) => {
        if (err) return callback(err, null);

        const result = Array.isArray(results) ? results[0] : results;
        return callback(null, result);
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
        if (err) return callback(err, null);
        return callback(null, result);
      });
  }

  created(payload, callback) {
    this.model.create(payload, callback);
  }

  upsert(items, matchs, callback) {
    this.model.upsertMany(items, matchs, callback);
  }

  destroyMany(payload, callback) {
    this.model.deleteMany(payload, callback);
  }
};
