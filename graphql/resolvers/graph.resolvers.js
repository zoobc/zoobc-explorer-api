module.exports = {
  Query: {
    transactionGraph: (parent, args, { models }) => {
      return new Promise((resolve, reject) => {
        models.Transactions.aggregate(
          [
            {
              $match: {
                Timestamp: {
                  $gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
                },
                SendMoney: { $ne: null },
              },
            },
            {
              $group: {
                _id: {
                  day: { $dayOfMonth: '$Timestamp' },
                  month: { $month: '$Timestamp' },
                  year: { $year: '$Timestamp' },
                },
                amount: { $sum: { $toDouble: '$SendMoney.AmountConversion' } },
              },
            },
            {
              $sort: {
                '_id.year': 1,
                '_id.month': 1,
                '_id.day': 1,
              },
            },
          ],
          function(err, data) {
            if (err) return reject(err);

            const result = data.map(item => {
              const { day, month, year } = item._id;
              return {
                name: `${day}-${month}-${year}`,
                amt: item.amount,
              };
            });
            return resolve(result);
          }
        );
      });
    },
    blockGraph: (parent, args, { models }) => {
      return new Promise((resolve, reject) => {
        models.Blocks.aggregate(
          [
            {
              $match: {
                Timestamp: {
                  $gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
                },
              },
            },
            {
              $group: {
                _id: {
                  day: { $dayOfMonth: '$Timestamp' },
                  month: { $month: '$Timestamp' },
                  year: { $year: '$Timestamp' },
                },
                count: { $sum: 1 },
              },
            },
            {
              $sort: {
                '_id.year': 1,
                '_id.month': 1,
                '_id.day': 1,
              },
            },
          ],
          function(err, data) {
            if (err) return reject(err);

            const result = data.map(item => {
              const { day, month, year } = item._id;
              return {
                name: `${day}-${month}-${year}`,
                amt: item.count,
              };
            });
            return resolve(result);
          }
        );
      });
    },
  },
};
