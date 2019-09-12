// const moment = require('moment');

const BaseService = require('./BaseService');
const { Blocks } = require('../../models');
// const { Converter } = require('../../utils');

// const chainType = 0;
// const limit = 10;
// const height = 1;
module.exports = class BlocksService extends BaseService {
  constructor() {
    super(Blocks);
  }

  getLastHeight(callback) {
    Blocks.findOne()
      .select('Height')
      .sort('-Height')
      .exec(callback);
  }

  // async getAll({ ChainType = chainType, Limit = limit, Height = height }, callback) {
  //   try {
  //     this.block.GetBlocks({ ChainType, Limit, Height }, async (err, result) => {
  //       if (err) {
  //         callback(err.details, null);
  //         return;
  //       }

  //       const { ChainType, Count, Height, Blocks } = result;
  //       Converter.formatDataGRPC(Blocks);
  //       callback(null, { data: { ChainType, Count, Height, Blocks } });
  //     });
  //   } catch (error) {
  //     throw Error(error.message);
  //   }
  // }

  // async getOne(id, callback) {
  //   try {
  //     this.block.GetBlock({ ID: id }, async (err, result) => {
  //       if (err && err.details !== 'BlockNotFound') {
  //         callback(err.details, null);
  //         return;
  //       }

  //       if (err && err.details === 'BlockNotFound') {
  //         callback(null, null);
  //         return;
  //       }

  //       Converter.formatDataGRPC2(result);
  //       callback(null, result);
  //     });
  //   } catch (error) {
  //     throw Error(error.message);
  //   }
  // }

  // async graphPeriod({ start_date, end_date, ChainType = chainType, Limit = limit, Height = height }, callback) {
  //   try {
  //     const startDateTimestamp = moment(start_date, 'DD-MM-YYYY').startOf('day');
  //     const endDateTimestamp = moment(end_date, 'DD-MM-YYYY').startOf('day');

  //     this.block.GetBlocks({ ChainType, Limit, Height }, async (err, result) => {
  //       if (err) {
  //         callback(err.details, null);
  //         return;
  //       }

  //       const { Blocks } = result;
  //       const graph = { graph: [['Timestamp', 'Sum Transactions', 'Sum Block']] };
  //       let timestamp = 0;

  //       Blocks.map(function(item) {
  //         let temp = moment.unix(item.Timestamp).format('DD-MM-YYYY');
  //         let final = moment(temp, 'DD-MM-YYYY').startOf('day');
  //         if (final.isSameOrAfter(startDateTimestamp, 'day') && final.isSameOrBefore(endDateTimestamp, 'day')) {
  //           if (item.Timestamp !== timestamp) {
  //             timestamp = item.Timestamp;
  //             let timestampString = moment.unix(timestamp).format('DD-MMM-YYYY HH:mm:ss');
  //             let tempArr = [];
  //             tempArr.push(timestampString, item.Transactions.length, 1);
  //             graph.graph.push(tempArr);
  //           } else {
  //             let timestampString = moment.unix(timestamp).format('DD-MMM-YYYY HH:mm:ss');
  //             const result = graph.graph.filter(item => item[0] === timestampString);
  //             if (result && result.length > 0) {
  //               result[0][1] += item.Transactions.length;
  //               result[0][2] += 1;
  //             }
  //           }
  //         }
  //         return item;
  //       });

  //       callback(null, { data: graph });
  //     });
  //   } catch (error) {
  //     throw Error(error.message);
  //   }
  // }

  // async graphSummary({ ChainType = chainType, Limit = limit, Height = height }, callback) {
  //   try {
  //     this.block.GetBlocks({ ChainType, Limit, Height }, async (err, result) => {
  //       if (err) {
  //         callback(err.details, null);
  //         return;
  //       }

  //       const { Blocks } = result;
  //       const graph = { graph: [['Category', 'Total'], ['Block', 0], ['Transaction', 0]] };

  //       Blocks.map(function(item) {
  //         graph.graph[1][1] += 1;
  //         graph.graph[2][1] += item.Transactions.length;
  //         return item;
  //       });

  //       callback(null, { data: graph });
  //     });
  //   } catch (error) {
  //     throw Error(error.message);
  //   }
  // }
};
