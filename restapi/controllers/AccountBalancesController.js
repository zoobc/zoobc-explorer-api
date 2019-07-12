const BaseController = require('./BaseController');
const HandleError = require('./HandleError');
const { ResponseBuilder } = require('../../utils');
const { AccountBalancesService } = require('../services');

module.exports = class AccountBalancesController extends BaseController {
  constructor() {
    super(new AccountBalancesService());
  }

  async get(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();

    try {
      this.service.findAll((err, result) => {
        if (err) {
          handleError.sendCatchError(res, err);
          return;
        }

        this.sendSuccessResponse(
          res,
          responseBuilder
            .setData(result.data)
            .setMessage('Account balances fetched successfully')
            .build()
        );
        return;
      });
    } catch (error) {
      handleError.sendCatchError(res, error);
    }
  }

  async find(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();
    const idReq = req.params.id;

    try {
      if (!idReq || typeof idReq === 'undefined' || idReq === 'null') {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder.setMessage('Invalid Payload Parameter').build()
        );
        return;
      }

      this.service.findById(idReq, (err, result) => {
        if (err) {
          handleError.sendCatchError(res, err);
          return;
        }

        this.sendSuccessResponse(
          res,
          responseBuilder
            .setData(result)
            .setMessage('Account balance fetched successfully')
            .build()
        );
        return;
      });
    } catch (error) {
      handleError.sendCatchError(res, error);
    }
  }
};
