const moment = require('moment');

const isValidByteArray = array => {
  if (array && array.byteLength !== undefined) return true;
  return false;
};

// for argument type of array
const formatDataGRPC = Payload => {
  Payload.map(function(item) {
    Object.entries(item).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formatDataGRPC(item[key]);
      }
      if (isValidByteArray(value)) {
        if (key === 'Type' || key === 'Subtype' || key === 'Version') {
          item[key] = value[0];
        } else {
          item[key] = Buffer.from(value).toString('base64');
        }
      }
      if (key === 'Timestamp') {
        item[key] = moment.unix(value).format('DD-MMM-YYYY HH:mm:ss');
      }
    });

    // Transaction Type Conversion Value
    if (item.Type === 0 && item.Subtype === 0) {
      item.Type = 'Empty';
    } else if (item.Type === 1 && item.Subtype === 0) {
      item.Type = 'Ordinary Payment';
    } else if (item.Type === 3 && item.Subtype === 0) {
      item.Type = 'Node Registration';
    }

    delete item.Subtype;

    return item;
  });
};

// for argument type of object
const formatDataGRPC2 = Payload => {
  Object.entries(Payload).forEach(([key, value]) => {
    if (isValidByteArray(value)) {
      Payload[key] = Buffer.from(value).toString('base64');
    }
    if (key === 'Timestamp') {
      Payload[key] = moment.unix(value).format('DD-MMM-YYYY HH:mm:ss');
    }
  });
};

module.exports = {
  formatDataGRPC,
  formatDataGRPC2,
};
