const BaseController = require('./BaseController');
const HandleError = require('./HandleError');
const { ResponseBuilder } = require('../../utils');
const { TransactionService } = require('../services');

module.exports = class TransactionController extends BaseController {
  constructor() {
    super(new TransactionService());
  }

  async get(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();

    try {
      this.service.findAll(req.query, (err, result) => {
        if (err) {
          handleError.sendCatchError(res, err);
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
    } catch (error) {
      handleError.sendCatchError(res, error);
    }
  }

  async transStat(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();
    const { senderPublicKey, recipientPublicKey, blockID, accPublicKey } = req.query;

    try {
      if (blockID && accPublicKey) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder.setMessage('Invalid Payload Parameter').build()
        );
        return;
      }

      this.service.transStat(
        { senderPublicKey, recipientPublicKey, blockID, accPublicKey },
        (err, result) => {
          if (err) {
            handleError.sendCatchError(res, err);
            return;
          }

          this.sendSuccessResponse(
            res,
            responseBuilder
              .setData(result)
              .setMessage('Transactions Amount Graph fetched successfully')
              .build()
          );
        }
      );
    } catch (error) {
      handleError.sendCatchError(res, error);
    }
  }

  async graph(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();

    try {
      this.service.graph(req.query, (err, result) => {
        if (err) {
          handleError.sendCatchError(res, err);
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
    } catch (error) {
      handleError.sendCatchError(res, error);
    }
  }
};
