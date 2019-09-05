const BaseController = require('./BaseController');
const HandleError = require('./HandleError');
const { ResponseBuilder } = require('../../utils');
const { SearchService } = require('../services');

module.exports = class SearchController extends BaseController {
  constructor() {
    super(new SearchService());
  }

  async SearchIdHash(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();
    const idHash = req.params.id;

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

      this.service.getOneBlock(id, (err, result) => {
        if (err) {
          this.service.getOneTransaction(id, (err, result) => {
            if (err) {
              handleError.sendCatchError(res, err);
              return;
            }
        }
      }

        this.sendSuccessResponse(
          res,
          responseBuilder
            .setData(result)
            .setMessage('Data fetched successfully')
            .build()
        );
        return;
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
