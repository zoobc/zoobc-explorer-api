const BaseService = require('./BaseService');
const { Transactions } = require('../../models');
const pageLimit = require('../../config/config').app.pageLimit;

module.exports = class TransactionsService extends BaseService {
  constructor() {
    super(Transactions);
  }

  paginateTransaction({ page, limit, blockID, fields, order }, callback) {
    page = page !== undefined ? parseInt(page) : 1;
    limit = limit !== undefined ? parseInt(limit) : parseInt(pageLimit);
    fields = fields !== undefined ? fields.replace(/,/g, ' ') : {};
    order = order !== undefined ? BaseService.parseOrder(order) : { _id: 'asc' };
    blockID = blockID !== undefined ? blockID.replace(/,/g, ' ') : {};

    this.model.countDocuments((err, total) => {
      if (err) {
        callback(err, null);
        return;
      }

      this.model
        .find({ BlockID: blockID })
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

  getLastHeight(callback) {
    Transactions.findOne()
      .select('Height')
      .sort('-Height')
      .exec(callback);
  }

  getAccountsByLastHeight(callback) {
    Transactions.findOne()
      .select('SenderAccountAddress RecipientAccountAddress')
      .sort('-Height')
      .exec((err, result) => {
        if (err) {
          callback(err, null);
          return;
        }

        if (result) {
          let accounts = [];
          if (result.SenderAccountAddress) {
            accounts.push(result.SenderAccountAddress);
          }
          if (result.RecipientAccountAddress) {
            accounts.push(result.RecipientAccountAddress);
          }
          callback(null, accounts);
          return;
        }

        callback(null, null);
      });
  }

  getAccountsFromTransactions(callback) {
    Transactions.aggregate(
      [
        {
          $group: {
            _id: null,
            SenderAccountAddress: { $addToSet: '$SenderAccountAddress' },
            RecipientAccountAddress: { $addToSet: '$RecipientAccountAddress' },
          },
        },
      ],
      (err, results) => {
        if (err) {
          callback(err, null);
          return;
        }

        if (results && results.length > 0) {
          const accounts = results[0].SenderAccountAddress.concat(
            results[0].RecipientAccountAddress.filter(item => {
              return results[0].SenderAccountAddress.indexOf(item) < 0;
            })
          );
          callback(null, accounts);
        } else {
          callback(null, null);
          return;
        }
      }
    );
  }
};
