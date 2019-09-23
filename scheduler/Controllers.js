const moment = require('moment');
const { Block, Transaction, AccountBalance, NodeRegistration } = require('./Protos');
const { BlocksService, TransactionsService, AccountsService, NodesService } = require('../api/services');

var state = { lastHeightTransaction: 0, lastHeightBlock: 0, accountAddresses: [] };

module.exports = class Controllers {
  constructor() {
    this.nodesService = new NodesService();
    this.blocksService = new BlocksService();
    this.accountsService = new AccountsService();
    this.transactionsService = new TransactionsService();
  }

  updateBlocks(callback) {
    this.blocksService.getLastHeight((err, result) => {
      if (err) return callback(`[Blocks] Blocks Service - Get Last Height ${err}`, null);

      const params = { Limit: 500, Height: result ? parseInt(result.Height + 1) : 0 };
      Block.GetBlocks(params, (err, result) => {
        if (err) return callback(`[Blocks] Block - Get Blocks ${err}`, null);
        if (result && result.Blocks && result.Blocks.length < 1) return callback(null, null);

        const matchs = ['Height'];
        const items = result.Blocks.map(item => {
          return {
            BlockID: item.ID,
            Height: item.Height,
            Timestamp: moment.unix(item.Timestamp).valueOf(),
            PreviousBlockID: item.PreviousBlockHash,
            BlockSeed: item.BlockSeed,
            BlockSignature: item.BlockSignature,
            CumulativeDifficulty: item.CumulativeDifficulty,
            SmithScale: item.SmithScale,
            BlocksmithAddress: item.BlocksmithAddress,
            TotalAmount: item.TotalAmount,
            TotalFee: item.TotalFee,
            TotalRewards: parseFloat(item.TotalCoinBase) + parseFloat(item.TotalFee),
            Version: item.Version,
            TotalReceipts: null,
            ReceiptValue: null,
            BlocksmithID: item.BlocksmithID,
            PoPChange: null,
            PayloadLength: item.PayloadLength,
            PayloadHash: item.PayloadHash,
            TotalCoinBase: item.TotalCoinBase,
          };
        });
        this.blocksService.upsert(items, matchs, (err, result) => {
          if (err) return callback(`[Blocks] Upsert ${err}`, null);
          if (result && result.ok !== 1) return callback(`[Blocks] Upsert data failed`, null);
          return callback(null, `[Blocks] Upsert ${items.length} data successfully`);
        });
      });
    });
  }

  updateTransactions(callback) {
    state = { lastHeightTransaction: 0, lastHeightBlock: 0, accountAddresses: [] };
    this.transactionsService.getLastHeight((err, result) => {
      if (err) return callback(`[Transactions] Transactions Service - Get Last Height ${err}`, null);
      if (!result) {
        const height = 0;
        UpsertTransactions(this.transactionsService, height, height, (err, result) => {
          if (err) return callback(err, null);
          if (!result) return callback(null, null);
          return callback(null, result);
        });
        return;
      }

      let lastHeightTransaction = result.Height;
      state.lastHeightTransaction = lastHeightTransaction;
      this.blocksService.getLastHeight((err, result) => {
        if (err) return callback(err, null);
        if (!result) return callback(null, null);

        let lastHeightBlock = result.Height;
        state.lastHeightBlock = lastHeightBlock;
        UpsertTransactions(this.transactionsService, lastHeightTransaction + 1, lastHeightBlock, (err, result) => {
          if (err) return callback(err, null);
          if (!result) return callback(null, null);
          return callback(null, result);
        });
      });
    });

    function GetTransactionsByHeight(Height, callback) {
      const params = { Height, Pagination: { OrderField: 'block_height', OrderBy: 'ASC' } };
      Transaction.GetTransactions(params, (err, result) => {
        if (err) return callback(`[Transactions] Get Transactions ${err}`, null);
        if (result && result.Transactions && result.Transactions.length < 1) return callback(null, null);
        const results = result.Transactions.filter(item => item.Height === Height);
        return callback(null, results);
      });
    }

    function UpsertTransactions(service, heightStart, heightEnd, callback) {
      function GetUpsertTransactions(height, callback) {
        GetTransactionsByHeight(height, (err, results) => {
          if (err) return callback(err, null);
          if (!results) return callback(null, null);

          let sender = [];
          let recipient = [];
          const matchs = ['TransactionID', 'BlockID', 'Height'];
          const items = results.map(item => {
            sender.push(item.SenderAccountAddress);
            recipient.push(item.RecipientAccountAddress);

            return {
              TransactionID: item.ID,
              Timestamp: moment.unix(item.Timestamp).valueOf(),
              TransactionType: item.TransactionType,
              BlockID: item.BlockID,
              Height: item.Height,
              Sender: item.SenderAccountAddress,
              Recipient: item.RecipientAccountAddress,
              Confirmations: null,
              Fee: item.Fee,
              Version: item.Version,
              TransactionHash: item.TransactionHash,
              TransactionBodyLength: item.TransactionBodyLength,
              TransactionBodyBytes: item.TransactionBodyBytes,
              TransactionIndex: item.TransactionIndex,
              Signature: item.Signature,
            };
          });
          state.accountAddresses = sender.concat(recipient.filter(item => sender.indexOf(item) < 0));

          service.upsert(items, matchs, (err, result) => {
            if (err) return reject(`[Transactions - Height ${height}] Upsert ${err}`);
            if (result && result.ok !== 1) return reject(`[Transactions - Height ${height}] Upsert data failed`);
            return callback(null, items.length);
          });
        });
      }

      if (heightStart > heightEnd) return callback(null, null);
      if (heightStart === heightEnd) {
        GetUpsertTransactions(heightStart, (err, result) => {
          if (err) return callback(err, null);
          if (result < 1) return callback(null, null);
          return callback(null, `[Transactions] Upsert ${result} data successfully`);
        });
        return;
      }

      let transactions = [];
      for (let height = heightStart; height < heightEnd; height++) {
        const transaction = new Promise((resolve, reject) => {
          GetUpsertTransactions(height, (err, result) => {
            if (err) return reject(err);
            if (result < 1) return resolve(0);
            return resolve(result);
          });
        });
        transactions.push(transaction);
      }

      Promise.all(transactions).then(results => {
        const count = results.reduce((prev, curr) => {
          return parseInt(prev) + parseInt(curr);
        }, 0);

        if (count < 1) return callback(null, null);
        return callback(null, `[Transactions] Upsert ${count} data successfully`);
      });
    }
  }

  updateNodes(callback) {
    NodeRegistration.GetNodeRegistrations({}, (err, resp) => {
      if (err) return callback(`[Nodes] Node Registration - Get Node Registrations ${err}`, null);
      if (resp && resp.NodeRegistrations && resp.NodeRegistrations.length < 1) return callback(null, null);

      this.nodesService.checkIsNewNodes(resp.NodeRegistrations, (err, results) => {
        if (err) return callback(`[Nodes] Nodes Service - Check Is New Nodes ${err}`, null);
        if (!results) return callback(null, null);

        const matchs = ['NodeID', 'NodePublicKey'];
        const items = results.map(item => {
          return {
            NodePublicKey: item.NodePublicKey,
            OwnerAddress: item.AccountAddress,
            NodeAddress: item.NodeAddress,
            LockedFunds: item.LockedBalance,
            RegisteredBlockHeight: item.RegistrationHeight,
            ParticipationScore: null,
            RegistryStatus: item.Queued,
            BlocksFunds: null,
            RewardsPaid: null,
            Latest: item.Latest,
            Height: item.Height,
            NodeID: item.NodeID,
          };
        });
        this.nodesService.upsert(items, matchs, (err, result) => {
          if (err) return callback(`[Nodes] Upsert ${err}`, null);
          if (result && result.ok !== 1) return callback(`[Nodes] Upsert data failed`, null);
          return callback(null, `[Nodes] Upsert ${items.length} data successfully`);
        });
      });
    });
  }

  async updateAccounts(callback) {
    if (state.accountAddresses && state.accountAddresses.length < 1) return callback(null, null);

    const accounts = state.accountAddresses.map(accountAddress => {
      return new Promise((resolve, reject) => {
        AccountBalance.GetAccountBalance({ AccountAddress: accountAddress }, (err, result) => {
          if (err) return reject(`[Accounts] Account Balance - Get Account Balance ${err}`);
          if (result && result.AccountBalance && result.AccountBalance.length < 1) return resolve(0);
          const matchs = ['AccountAddress'];
          const items = [
            {
              AccountAddress: result.AccountBalance.AccountAddress,
              Balance: result.AccountBalance.Balance,
              SpendableBalance: result.AccountBalance.SpendableBalance,
              FirstActive: null,
              LastActive: null,
              TotalRewards: null,
              TotalFeesPaid: null,
              NodePublicKey: null,
              BlockHeight: result.AccountBalance.BlockHeight,
              PopRevenue: result.AccountBalance.PopRevenue,
            },
          ];

          this.accountsService.upsert(items, matchs, (err, result) => {
            if (err) return reject(`[Accounts] Upsert ${err}`);
            if (result && result.ok !== 1) return reject(`[Accounts] Upsert data failed`);
            return resolve(items.length);
          });
        });
      });
    });

    Promise.all(accounts).then(results => {
      const count = results.reduce((prev, curr) => {
        return parseInt(prev) + parseInt(curr);
      }, 0);

      if (count < 1) return callback(null, null);
      return callback(null, `[Accounts] Upsert ${count} data successfully`);
    });
  }
};
