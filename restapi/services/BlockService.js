const { Block } = require('../../models');
const { Converter } = require('../../utils');
const moment = require('moment');

module.exports = class BlockService {
  constructor() {
    this.block = Block;
  }

  async findAll({ BlockSize, BlockHeight }, callback) {
    try {
      this.block.GetBlocks({ BlockSize: BlockSize, BlockHeight: BlockHeight }, (err, result) => {
        if (err) {
          callback(err.details, null);
          return;
        }

        const { Blocks, BlockSize, BlockHeight } = result;
        Converter.formatDataGRPC(Blocks);
        callback(null, {
          data: { Blocks, BlockSize, BlockHeight },
        });
      });
    } catch (error) {
      throw Error(error.message);
    }
  }

  async graphPeriod({ start_date, end_date }, callback) {
    try {
      const startDateTimestamp = moment(start_date, 'DD-MM-YYYY').startOf('day');
      const endDateTimestamp = moment(end_date, 'DD-MM-YYYY').startOf('day');

      this.block.GetBlocks({ BlockSize: 1, BlockHeight: 1 }, (err, result) => {
        if (err) {
          callback(err.details, null);
          return;
        }

        const { Blocks } = result;

        const graph = {
          graph: [['Timestamp', 'Sum Transactions', 'Sum Block']],
        };

        let timestamp = 0;

        Blocks.map(function(item) {
          let temp = moment.unix(item.Timestamp).format('DD-MM-YYYY');
          let final = moment(temp, 'DD-MM-YYYY').startOf('day');
          if (
            final.isSameOrAfter(startDateTimestamp, 'day') &&
            final.isSameOrBefore(endDateTimestamp, 'day')
          ) {
            if (item.Timestamp !== timestamp) {
              timestamp = item.Timestamp;
              let timestampString = moment.unix(timestamp).format('DD-MMM-YYYY HH:mm:ss');
              let tempArr = [];
              tempArr.push(timestampString, item.Transactions.length, 1);
              graph.graph.push(tempArr);
            } else {
              let timestampString = moment.unix(timestamp).format('DD-MMM-YYYY HH:mm:ss');
              const result = graph.graph.filter(item => item[0] === timestampString);
              if (result && result.length > 0) {
                result[0][1] += item.Transactions.length;
                result[0][2] += 1;
              }
            }
          }
          return item;
        });

        callback(null, {
          data: graph,
        });
      });
    } catch (error) {
      throw Error(error.message);
    }
  }

  async graphSummary(callback) {
    try {
      this.block.GetBlocks({ BlockSize: 1, BlockHeight: 1 }, (err, result) => {
        if (err) {
          callback(err.details, null);
          return;
        }

        const { Blocks } = result;

        const graph = {
          graph: [['Category', 'Total'], ['Block', 0], ['Transaction', 0]],
        };

        Blocks.map(function(item) {
          graph.graph[1][1] += 1;
          graph.graph[2][1] += item.Transactions.length;
          return item;
        });

        callback(null, {
          data: graph,
        });
      });
    } catch (error) {
      throw Error(error.message);
    }
  }
};
