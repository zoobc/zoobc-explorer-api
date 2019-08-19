const BaseController = require('./BaseController');
const HandleError = require('./HandleError');
const { ResponseBuilder } = require('../../utils');
const { BlockService } = require('../services');
const moment = require('moment');

module.exports = class BlockController extends BaseController {
  constructor() {
    super(new BlockService());
  }

  async getAll(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();

    try {
      this.service.getAll(req.query, (err, result) => {
        if (err) {
          handleError.sendCatchError(res, err);
          return;
        }

        this.sendSuccessResponse(
          res,
          responseBuilder
            .setData(result.data)
            .setMessage('Blocks fetched successfully')
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
    const idReq = req.params.id;

    try {
      if (!this.checkReqParam(idReq)) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder.setMessage('Invalid Payload Parameter').build()
        );
        return;
      }

      this.service.getOne(idReq, (err, result) => {
        if (err) {
          handleError.sendCatchError(res, err);
          return;
        }

        this.sendSuccessResponse(
          res,
          responseBuilder
            .setData(result)
            .setMessage('Block fetched successfully')
            .build()
        );
        return;
      });
    } catch (error) {
      handleError.sendCatchError(res, error);
    }
  }

  async graphPeriod(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();
    const { start_date, end_date } = req.query;

    try {
      if (!start_date || !end_date) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder.setMessage('Invalid Payload Parameter').build()
        );
        return;
      }

      if (
        !moment(start_date, 'DD-MM-YYYY').isValid() ||
        !moment(end_date, 'DD-MM-YYYY').isValid()
      ) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder.setMessage('Invalid Date Format, must be (DD-MM-YYYY)').build()
        );
        return;
      }

      this.service.graphPeriod(req.query, (err, result) => {
        if (err) handleError.sendCatchError(res, err);
        this.sendSuccessResponse(
          res,
          responseBuilder
            .setData(result.data)
            .setMessage('Block Transaction Period Graph fetched successfully')
            .build()
        );
      });
    } catch (error) {
      handleError.sendCatchError(res, error);
    }
  }

  async graphSummary(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();

    try {
      this.service.graphSummary(req.query, (err, result) => {
        if (err) handleError.sendCatchError(res, err);
        this.sendSuccessResponse(
          res,
          responseBuilder
            .setData(result.data)
            .setMessage('Block Transaction Summary Graph fetched successfully')
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
