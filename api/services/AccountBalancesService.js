const BaseService = require('./BaseService');
const { AccountBalances } = require('../../models');

module.exports = class AccountBalancesService extends BaseService {
  constructor() {
    super(AccountBalances);
  }
};
