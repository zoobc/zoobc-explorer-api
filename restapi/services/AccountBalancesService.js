const { AccountBalances } = require('../../models');

module.exports = class AccountBalancesService {
  constructor() {
    this.accountBalances = AccountBalances;
  }

  async findAll(callback) {
    try {
      this.accountBalances.GetAccountBalances({}, (err, result) => {
        if (err) {
          callback(err.details, null);
          return;
        }

        const { AccountBalances } = result;
        AccountBalances.map(item => {
          const buffer = Buffer.from(item.PublicKey).toString('base64');
          return (item.PublicKey = buffer);
        });

        callback(null, { data: AccountBalances });
      });
    } catch (error) {
      throw Error(error.message);
    }
  }

  async findById(id, callback) {
    try {
      const decodedData = Buffer.from(id, 'base64');
      this.accountBalances.GetAccountBalance({ PublicKey: decodedData }, (err, result) => {
        if (err) {
          callback(err.details, null);
          return;
        }

        result.PublicKey = Buffer.from(result.PublicKey).toString('base64');
        callback(null, result);
      });
    } catch (error) {
      throw Error(error.message);
    }
  }
};
