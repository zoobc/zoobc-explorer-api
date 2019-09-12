// const pageLimit = require('../../config/config').app.pageLimit;

module.exports = class BaseService {
  constructor(model) {
    this.model = model;
  }

  async upsert(items, matchs, callback) {
    this.model.upsertMany(items, matchs, callback);
  }
};
