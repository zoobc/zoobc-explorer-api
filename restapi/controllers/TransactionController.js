const BaseController = require('./BaseController');
const HandleError = require('./HandleError');
const { ResponseBuilder } = require('../../utils');
const { TransactionService } = require('../services');

module.exports = class TransactionController extends BaseController {
  constructor() {
    super(new TransactionService());
  }

  async getAll(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();
    const { Limit, Page, AccountAddress } = req.query;

    try {
      this.service.getAll({ Limit, Page, AccountAddress }, (err, result) => {
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

  async getOne(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();
    const id = req.params.id;

    try {
      if (!this.checkReqParam(id)) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder
            .setData({})
            .setMessage('Invalid Payload Parameter')
            .build()
        );
        return;
      }

      this.service.getOne(id, (err, result) => {
        if (err) {
          handleError.sendCatchError(res, err);
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
    } catch (error) {
      handleError.sendCatchError(res, error);
    }
  }

  async graphAmount(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();
    const { Limit, Page, AccountAddress } = req.query;

    try {
      this.service.graphAmount({ Limit, Page, AccountAddress }, (err, result) => {
        if (err) {
          handleError.sendCatchError(res, err);
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
    } catch (error) {
      handleError.sendCatchError(res, error);
    }
  }

  async graphType(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();
    const { Limit, Page, AccountAddress } = req.query;

    try {
      this.service.graphType({ Limit, Page, AccountAddress }, (err, result) => {
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

  checkReqParam(param) {
    if (!param || typeof param === 'undefined' || param === 'null') {
      return false;
    }

    return true;
  }
};
