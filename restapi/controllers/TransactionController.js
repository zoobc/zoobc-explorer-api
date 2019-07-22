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
    const { limit, offSet } = req.query;
    this.service.transStat({ limit, offSet }, (err, result) => {
      if (err) {
        handleError.sendCatchError(res, err);
        return;
      }

      this.sendSuccessResponse(
        res,
        responseBuilder
          .setData(result)
          .setMessage('Transactions fetched successfully')
          .build()
      );
    });
  }
  catch(error) {
    handleError.sendCatchError(res, error);
  }

  async getOne(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();
    const { id } = req.params;

    try {
      if (!id) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder.setMessage('Invalid Payload Parameter').build()
        );
        return;
      }

      this.service.getTransaction({ id }, (err, result) => {
        if (err) {
          handleError.sendCatchError(res, err);
          return;
        }

        this.sendSuccessResponse(
          res,
          responseBuilder
            .setData(result)
            .setMessage('Transactions fetched successfully')
            .build()
        );
      });
    } catch (error) {
      handleError.sendCatchError(res, error);
    }
  }

  async graphTransStat(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();
    const { limit, offSet } = req.query;
    try {
      this.service.transStat({ limit, offSet }, (err, result) => {
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
      });
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
