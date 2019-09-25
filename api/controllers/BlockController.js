// const moment = require('moment');
const BaseController = require('./BaseController');
const HandleError = require('./HandleError');
const { BlocksService } = require('../services');
const { ResponseBuilder, Converter, RedisCache } = require('../../utils');

const cache = {
  blocks: 'blocks',
  block: 'block',
  period: 'block:period',
  summary: 'block:summary',
};

module.exports = class BlockController extends BaseController {
  constructor() {
    super(new BlocksService());
  }

  async getAll(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();
    const { page, limit, fields, order } = req.query;

    try {
      const cacheBlocks = Converter.formatCache(cache.blocks, req.query);
      RedisCache.get(cacheBlocks, (errRedis, resRedis) => {
        if (errRedis) {
          handleError.sendCatchError(res, errRedis);
          return;
        }

        if (resRedis) {
          this.sendSuccessResponse(
            res,
            responseBuilder
              .setData(resRedis)
              .setMessage('Blocks fetched successfully')
              .build()
          );
          return;
        }

        this.service.paginate({ page, limit, fields, order }, (err, result) => {
          if (err) {
            handleError.sendCatchError(res, err);
            return;
          }

          RedisCache.set(cacheBlocks, result, err => {
            if (err) {
              handleError.sendCatchError(res, err);
              return;
            }

            this.sendSuccessResponse(
              res,
              responseBuilder
                .setData(result.data)
                .setPaginate(result.paginate)
                .setMessage('Blocks fetched successfully')
                .build()
            );
            return;
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

      const cacheBlock = Converter.formatCache(cache.block, id);
      RedisCache.get(cacheBlock, (errRedis, resRedis) => {
        if (errRedis) {
          handleError.sendCatchError(res, errRedis);
          return;
        }

        if (resRedis) {
          this.sendSuccessResponse(
            res,
            responseBuilder
              .setData(resRedis)
              .setMessage('Block fetched successfully')
              .build()
          );
          return;
        }

        this.service.findOne({ BlockID: id }, (err, result) => {
          if (err) {
            handleError.sendCatchError(res, err);
            return;
          }

          if (!result) {
            this.sendNotFoundResponse(
              res,
              responseBuilder
                .setData({})
                .setMessage('Block not found')
                .build()
            );
            return;
          }

          RedisCache.set(cacheBlock, result, err => {
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
        });
      });
    } catch (error) {
      handleError.sendCatchError(res, error);
    }
  }

  async graphPeriod(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();
    // const { start_date, end_date, ChainType, Limit, Height } = req.query;

    try {
      // if (!start_date || !end_date) {
      //   this.sendInvalidPayloadResponse(
      //     res,
      //     responseBuilder
      //       .setData({})
      //       .setMessage('Invalid Payload Parameter')
      //       .build()
      //   );
      //   return;
      // }
      // if (!moment(start_date, 'DD-MM-YYYY').isValid() || !moment(end_date, 'DD-MM-YYYY').isValid()) {
      //   this.sendInvalidPayloadResponse(
      //     res,
      //     responseBuilder
      //       .setData({})
      //       .setMessage('Invalid Date Format, must be (DD-MM-YYYY)')
      //       .build()
      //   );
      //   return;
      // }
      // const cachePeriod = Converter.formatCache(cache.period, req.query);
      // RedisCache.get(cachePeriod, (errRedis, resRedis) => {
      //   if (errRedis) {
      //     handleError.sendCatchError(res, errRedis);
      //     return;
      //   }
      //   if (resRedis) {
      //     this.sendSuccessResponse(
      //       res,
      //       responseBuilder
      //         .setData(resRedis)
      //         .setMessage('Block Transaction Period Graph fetched successfully')
      //         .build()
      //     );
      //     return;
      //   }
      //   this.service.graphPeriod({ start_date, end_date, ChainType, Limit, Height }, (err, result) => {
      //     if (err) {
      //       handleError.sendCatchError(res, err);
      //       return;
      //     }
      //     RedisCache.set(cachePeriod, result.data, errRedis => {
      //       if (errRedis) {
      //         handleError.sendCatchError(res, errRedis);
      //         return;
      //       }
      //       this.sendSuccessResponse(
      //         res,
      //         responseBuilder
      //           .setData(result.data)
      //           .setMessage('Block Transaction Period Graph fetched successfully')
      //           .build()
      //       );
      //     });
      //   });
      // });
    } catch (error) {
      handleError.sendCatchError(res, error);
    }
  }

  async graphSummary(req, res) {
    const responseBuilder = new ResponseBuilder();
    const handleError = new HandleError();
    // const { ChainType, Limit, Height } = req.query;

    try {
      // const cacheSummary = Converter.formatCache(cache.summary, req.query);
      // RedisCache.get(cacheSummary, (errRedis, resRedis) => {
      //   if (errRedis) {
      //     handleError.sendCatchError(res, errRedis);
      //     return;
      //   }
      //   if (resRedis) {
      //     this.sendSuccessResponse(
      //       res,
      //       responseBuilder
      //         .setData(resRedis)
      //         .setMessage('Block Transaction Summary Graph fetched successfully')
      //         .build()
      //     );
      //   }
      //   this.service.graphSummary({ ChainType, Limit, Height }, (err, result) => {
      //     if (err) {
      //       handleError.sendCatchError(res, err);
      //       return;
      //     }
      //     RedisCache.set(cacheSummary, result.data, errRedis => {
      //       if (errRedis) {
      //         handleError.sendCatchError(res, errRedis);
      //         return;
      //       }
      //       this.sendSuccessResponse(
      //         res,
      //         responseBuilder
      //           .setData(result.data)
      //           .setMessage('Block Transaction Summary Graph fetched successfully')
      //           .build()
      //       );
      //     });
      //   });
      // });
    } catch (error) {
      handleError.sendCatchError(res, error);
    }
  }
};
