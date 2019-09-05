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
    const { ChainType, Limit, Height } = req.query;

    try {
      this.service.getAll({ ChainType, Limit, Height }, (err, result) => {
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
    const { start_date, end_date, ChainType, Limit, Height } = req.query;

    try {
      if (!start_date || !end_date) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder
            .setData({})
            .setMessage('Invalid Payload Parameter')
            .build()
        );
        return;
      }

      if (!moment(start_date, 'DD-MM-YYYY').isValid() || !moment(end_date, 'DD-MM-YYYY').isValid()) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder
            .setData({})
            .setMessage('Invalid Date Format, must be (DD-MM-YYYY)')
            .build()
        );
        return;
      }

      this.service.graphPeriod({ start_date, end_date, ChainType, Limit, Height }, (err, result) => {
        if (err) {
          handleError.sendCatchError(res, err);
          return;
        }
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
    const { ChainType, Limit, Height } = req.query;

    try {
      this.service.graphSummary({ ChainType, Limit, Height }, (err, result) => {
        if (err) {
          handleError.sendCatchError(res, err);
          return;
        }
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
