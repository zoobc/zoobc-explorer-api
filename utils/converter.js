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
    if (item.TransactionType === 0) {
      item.TransactionType = 'Empty';
    } else if (item.TransactionType === 1) {
      item.TransactionType = 'Ordinary Payment';
    } else if (item.TransactionType === 3) {
      item.TransactionType = 'Node Registration';
    }

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

    // Transaction Type Conversion Value
    if (key === 'TransactionType') {
      if (Payload[key] === 0) {
        Payload[key] = 'Empty';
      } else if (Payload[key] === 1) {
        Payload[key] = 'Ordinary Payment';
      } else if (Payload[key] === 3) {
        Payload[key] = 'Node Registration';
      }
    }
  });
};

module.exports = {
  formatDataGRPC,
  formatDataGRPC2,
};
