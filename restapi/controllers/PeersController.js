const BaseController = require('./BaseController');
const HandleError = require('./HandleError');
const { ResponseBuilder } = require('../../utils');
const { PeerService } = require('../services');

module.exports = class PeersController extends BaseController {
  constructor() {
    super(new PeerService());
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
            .setMessage('Peers fetched successfully')
            .build()
        );
        return;
      });
    } catch (error) {
      handleError.sendCatchError(res, error);
    }
  }

  async getMap(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();

    try {
      this.service.findAllMap((err, result) => {
        if (err) {
          handleError.sendCatchError(res, err);
          return;
        }

        this.sendSuccessResponse(
          res,
          responseBuilder
            .setData(result.data)
            .setMessage('Map Peers fetched successfully')
            .build()
        );
        return;
      });
    } catch (error) {
      handleError.sendCatchError(res, error);
    }
  }
};
