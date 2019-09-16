const BaseService = require('./BaseService');
const { NodeRegistrations } = require('../../models');

module.exports = class NodeRegistrationsService extends BaseService {
  constructor() {
    super(NodeRegistrations);
  }

  getLastHeight(callback) {
    NodeRegistrations.findOne()
      .select('Height')
      .sort('-Height')
      .exec(callback);
  }
};
