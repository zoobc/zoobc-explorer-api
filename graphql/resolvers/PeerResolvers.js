const { ForbiddenError } = require('apollo-server');
const { combineResolvers } = require('graphql-resolvers');
const iplocation = require('iplocation').default;
const { Peers } = require('../../models');

module.exports = {
  Query: {
    peers: combineResolvers(async () => {
      try {
        return new Promise((resolve, reject) => {
          Peers.GetPeers({}, (err, result) => {
            if (err) return reject(err);
            const { Peers = null } = result;
            resolve(Peers);
          });
        });
      } catch (error) {
        throw new ForbiddenError('Get Peers Error:', error);
      }
    }),

    mapPeers: combineResolvers(async () => {
      try {
        return new Promise(async (resolve, reject) => {
          Peers.GetPeers({}, async (err, result) => {
            if (err) return reject(err);
            const { Peers = null } = result;

            const promiseLatLong = Peers.map(async item => {
              const ipLoc = await iplocation(item.Address);
              item.Lat = ipLoc.latitude;
              item.Long = ipLoc.longitude;
              item.Region = ipLoc.region;
              item.City = ipLoc.city;
              return item;
            });

            resolve(await Promise.all(promiseLatLong));
          });
        });
      } catch (error) {
        throw new ForbiddenError('Get Map Peers Error:', error);
      }
    }),
  },
};
