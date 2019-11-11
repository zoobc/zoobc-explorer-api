const BaseService = require('./BaseService');
const { Users } = require('../../models');

module.exports = class UsersService extends BaseService {
  constructor() {
    super(Users);
  }
};
