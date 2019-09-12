const BaseController = require('./BaseController');
const HandleError = require('./HandleError');
const { ResponseBuilder } = require('../../utils');
const { BlocksService, TransactionService } = require('../services');

module.exports = class SearchController extends BaseController {
  constructor() {
    super();
    this.blockService = new BlocksService();
    this.transactionService = new TransactionService();
  }

  async SearchIdHash(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();
    const { ID } = req.query;

    try {
      if (!ID) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder
            .setData({})
            .setMessage('Invalid Payload Parameter')
            .build()
        );
        return;
      }

      if (ID == 0) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder
            .setData({})
            .setMessage('Invalid data: unable to add value by zero.')
            .build()
        );
        return;
      }

      this.blockService.getOne(ID, (errBlock, resultBlock) => {
        if (errBlock) {
          handleError.sendCatchError(res, errBlock);
          return;
        }
        if (resultBlock) {
          this.sendSuccessResponse(
            res,
            responseBuilder
              .setData(resultBlock)
              .setMessage('Block fetched successfully')
              .build()
          );
          return;
        } else {
          this.transactionService.getOne(ID, (errTrans, resultTrans) => {
            if (errTrans) {
              handleError.sendCatchError(res, errTrans);
              return;
            }
            this.sendSuccessResponse(
              res,
              responseBuilder
                .setData(resultTrans)
                .setMessage('Transaction fetched successfully')
                .build()
            );
            return;
          });
        }
      });
    } catch (error) {
      handleError.sendCatchError(res, error);
    }
  }
};
