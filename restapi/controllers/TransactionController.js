const BaseController = require('./BaseController');
const HandleError = require('./HandleError');
const { ResponseBuilder, Converter } = require('../../utils');
const { TransactionService, RedisService } = require('../services');

const cache = {
  transactions: 'transactions',
  transactions: 'transactions',
  amount: 'transaction:amount',
  type: 'transaction:type',
};

module.exports = class TransactionController extends BaseController {
  constructor() {
    super(new TransactionService());
    this.redisService = new RedisService();
  }

  async getAll(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();
    const { Limit, Page, AccountAddress } = req.query;

    try {
      const cacheTransactions = Converter.formatCache(cache.transactions, req.query);
      this.redisService.get(cacheTransactions, (errRedis, resRedis) => {
        if (errRedis) {
          handleError.sendCatchError(res, errRedis);
          return;
        }

        if (resRedis) {
          this.sendSuccessResponse(
            res,
            responseBuilder
              .setData(resRedis)
              .setMessage('Transactions fetched successfully')
              .build()
          );
          return;
        }

        this.service.getAll({ Limit, Page, AccountAddress }, (err, result) => {
          if (err) {
            handleError.sendCatchError(res, err);
            return;
          }

          this.redisService.set(cacheTransactions, result.data, errRedis => {
            if (errRedis) {
              handleError.sendCatchError(res, errRedis);
              return;
            }

            this.sendSuccessResponse(
              res,
              responseBuilder
                .setData(result.data)
                .setMessage('Transactions fetched successfully')
                .build()
            );
          });
        });
      });
    } catch (error) {
      handleError.sendCatchError(res, error);
    }
  }

  async getOne(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();
    const id = req.params.id;

    try {
      if (!id) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder
            .setData({})
            .setMessage('Invalid Payload Parameter')
            .build()
        );
        return;
      }

      const cacheTransaction = Converter.formatCache(cache.transaction, req.query);
      this.redisService.get(cacheTransaction, (errRedis, resRedis) => {
        if (errRedis) {
          handleError.sendCatchError(res, errRedis);
          return;
        }

        if (resRedis) {
          this.sendSuccessResponse(
            res,
            responseBuilder
              .setData(resRedis)
              .setMessage('Transaction fetched successfully')
              .build()
          );
        }

        this.service.getOne(id, (err, result) => {
          if (err) {
            handleError.sendCatchError(res, err);
            return;
          }

          if (!result) {
            this.sendNotFoundResponse(
              res,
              responseBuilder
                .setData({})
                .setMessage('Transaction not found')
                .build()
            );
            return;
          }

          this.redisService.set(cacheTransaction, result, errRedis => {
            if (errRedis) {
              handleError.sendCatchError(res, errRedis);
              return;
            }

            this.sendSuccessResponse(
              res,
              responseBuilder
                .setData(result)
                .setMessage('Transaction fetched successfully')
                .build()
            );
          });
        });
      });
    } catch (error) {
      handleError.sendCatchError(res, error);
    }
  }

  async graphAmount(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();
    const { Limit, Page, AccountAddress } = req.query;

    try {
      const cacheAmount = Converter.formatCache(cache.amount, req.query);
      this.redisService.get(cacheAmount, (errRedis, resRedis) => {
        if (errRedis) {
          handleError.sendCatchError(res, errRedis);
          return;
        }

        if (resRedis) {
          this.sendSuccessResponse(
            res,
            responseBuilder
              .setData(resRedis)
              .setMessage('Transactions Amount Graph fetched successfully')
              .build()
          );
        }

        this.service.graphAmount({ Limit, Page, AccountAddress }, (err, result) => {
          if (err) {
            handleError.sendCatchError(res, err);
            return;
          }

          this.redisService.set(cacheAmount, result.data, errRedis => {
            if (errRedis) {
              handleError.sendCatchError(res, errRedis);
              return;
            }

            this.sendSuccessResponse(
              res,
              responseBuilder
                .setData(result.data)
                .setMessage('Transactions Amount Graph fetched successfully')
                .build()
            );
          });
        });
      });
    } catch (error) {
      handleError.sendCatchError(res, error);
    }
  }

  async graphType(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();
    const { Limit, Page, AccountAddress } = req.query;

    try {
      const cacheType = Converter.formatCache(cache.type, req.query);
      this.redisService.get(cacheType, (errRedis, resRedis) => {
        if (errRedis) {
          handleError.sendCatchError(res, errRedis);
          return;
        }

        if (resRedis) {
          this.sendSuccessResponse(
            res,
            responseBuilder
              .setData(resRedis)
              .setMessage('Transaction Type Graph fetched successfully')
              .build()
          );
        }

        this.service.graphType({ Limit, Page, AccountAddress }, (err, result) => {
          if (err) {
            handleError.sendCatchError(res, err);
            return;
          }

          this.redisService.set(cacheType, result.data, errRedis => {
            if (errRedis) {
              handleError.sendCatchError(res, errRedis);
              return;
            }

            this.sendSuccessResponse(
              res,
              responseBuilder
                .setData(result.data)
                .setMessage('Transaction Type Graph fetched successfully')
                .build()
            );
          });
        });
      });
    } catch (error) {
      handleError.sendCatchError(res, error);
    }
  }
};
