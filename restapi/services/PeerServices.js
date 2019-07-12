// const BaseService = require('./BaseService');
const iplocation = require('iplocation').default;
const { Peers } = require('../../models');

module.exports = class PeerService {
  constructor() {
    this.peers = Peers;
  }

  async findAll(callback) {
    try {
      this.peers.GetPeers({}, (err, result) => {
        if (err) {
          callback(err.details, null);
          return;
        }

        callback(null, {
          data: result.Peers,
        });
      });
    } catch (error) {
      throw Error(error.message);
    }
  }

  async findAllMap(callback) {
    try {
      this.peers.GetPeers({}, async (err, result) => {
        if (err) {
          callback(err.details, null);
          return;
        }

        const { Peers } = result;
        const promiseLatLong = Peers.map(async item => {
          const ipLoc = await iplocation(item.Address);
          item.lat = ipLoc.latitude;
          item.long = ipLoc.longitude;
          item.region = ipLoc.region;
          item.city = ipLoc.city;
          return item;
        });

        callback(null, {
          data: await Promise.all(promiseLatLong),
        });
      });
    } catch (error) {
      throw Error(error.message);
    }
  }
};
