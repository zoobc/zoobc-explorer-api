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
            BlockID: item.Block.ID,
            Height: item.Block.Height,
            Timestamp: moment.unix(item.Block.Timestamp).valueOf(),
            PreviousBlockID: item.Block.PreviousBlockHash,
            BlockSeed: item.Block.BlockSeed,
            BlockSignature: item.Block.BlockSignature,
            CumulativeDifficulty: item.Block.CumulativeDifficulty,
            SmithScale: item.Block.SmithScale,
            BlocksmithAddress: item.Block.BlocksmithPublicKey ? item.Block.BlocksmithPublicKey : null,
            TotalAmount: item.Block.TotalAmount,
            TotalFee: item.Block.TotalFee,
            TotalRewards: parseFloat(item.Block.TotalCoinBase) + parseFloat(item.Block.TotalFee),
            Version: item.Block.Version,
            TotalReceipts: item.TotalReceipts,
            ReceiptValue: item.ReceiptValue,
            BlocksmithID: item.BlocksmithAccountAddress,
            PopChange: item.PopChange,
            PayloadLength: item.Block.PayloadLength,
            PayloadHash: item.Block.PayloadHash,
            TotalCoinBase: item.Block.TotalCoinBase,
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
            if (err) return callback(`[Transactions - Height ${height}] Upsert ${err}`, null);
            if (result && result.ok !== 1) return callback(`[Transactions - Height ${height}] Upsert data failed`, null);
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

      Promise.all(transactions)
        .then(results => {
          const count = results.reduce((prev, curr) => {
            return parseInt(prev) + parseInt(curr);
          }, 0);

          if (count < 1) return callback(null, null);
          return callback(null, `[Transactions] Upsert ${count} data successfully`);
        })
        .catch(error => callback(error, null));
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
            NodePublicKey: item.NodePublicKey ? Buffer.from(item.NodePublicKey).toString('base64') : null,
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

  updateAccounts(callback) {
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

    Promise.all(accounts)
      .then(results => {
        const count = results.reduce((prev, curr) => {
          return parseInt(prev) + parseInt(curr);
        }, 0);

        if (count < 1) return callback(null, null);
        return callback(null, `[Accounts] Upsert ${count} data successfully`);
      })
      .catch(error => callback(error, null));
  }

  rollback(callback) {
    this.blocksService.getLastHeight(async (err, result) => {
      if (err) return callback(`[Rollback] Blocks Service - Get Last Height ${err}`, null);
      if (!result || !result.Height) return callback(null, { success: false, info: null });

      const Limit = 800;
      const Height = parseInt(result.Height) - Limit < 0 ? 1 : parseInt(result.Height) - Limit;
      this.blocksService.getFromHeight({ Limit, Height }, (err, results) => {
        if (err) return callback(`[Rollback] Blocks Service - Get From Height ${err}`, null);
        if (results && results.length < 1) return callback(null, { success: false, info: null });
        const resultsExplorer = results
          .map(item => ({ BlockID: item.BlockID, Height: item.Height }))
          .sort((a, b) => (a.Height < b.Height ? 1 : -1));

        Block.GetBlocks({ Limit, Height }, (err, result) => {
          if (err) return callback(`[Rollback] Block - Get Blocks ${err}`, null);
          if (result && result.Blocks && result.Blocks.length < 1) return callback(null, { success: false, info: null });
          const resultsCore = result.Blocks.map(item => ({
            BlockID: item.Block.ID,
            Height: item.Block.Height,
          })).sort((a, b) => (a.Height < b.Height ? 1 : -1));

          if (resultsCore.length < 1) return callback(null, { success: false, info: null });
          const diffs = resultsExplorer
            .filter(({ BlockID: val1 }) => !resultsCore.some(({ BlockID: val2 }) => val2 === val1))
            .sort((a, b) => (a.Height > b.Height ? 1 : -1));
          const rollHeight = diffs.length > 0 ? diffs[0].Height : null;
          if (!rollHeight) return callback(null, { success: false, info: null });

          this.blocksService.destroyMany({ Height: { $gte: rollHeight } }, (err, result) => {
            if (err) return callback(`[Rollback] Blocks Service - Destroy Many ${err}`, null);
            if (result.ok < 1 || result.deletedCount < 1) return callback(null, { success: false, info: 'Blocks' });
            return callback(null, { success: true, info: `[Rollback - Blocks] Delete ${result.deletedCount} data successfully` });
          });

          this.transactionsService.destroyMany({ Height: { $gte: rollHeight } }, (err, result) => {
            if (err) return callback(`[Rollback] Transactions Service - Destroy Many ${err}`, null);
            if (result.ok < 1 || result.deletedCount < 1) return callback(null, { success: false, info: 'Transactions' });
            return callback(null, { success: true, info: `[Rollback - Transactions] Delete ${result.deletedCount} data successfully` });
          });

          this.nodesService.destroyMany({ Height: { $gte: rollHeight } }, (err, result) => {
            if (err) return callback(`[Rollback] Nodes Service - Destroy Many ${err}`, null);
            if (result.ok < 1 || result.deletedCount < 1) return callback(null, { success: false, info: 'Nodes' });
            return callback(null, { success: true, info: `[Rollback - Nodes] Delete ${result.deletedCount} data successfully` });
          });

          this.accountsService.destroyMany({ BlockHeight: { $gte: rollHeight } }, (err, result) => {
            if (err) return callback(`[Rollback] Accounts Service - Destroy Many ${err}`, null);
            if (result.ok < 1 || result.deletedCount < 1) return callback(null, { success: false, info: 'Accounts' });
            return callback(null, { success: true, info: `[Rollback - Accounts] Delete ${result.deletedCount} data successfully` });
          });
        });
      });
    });
  }
};
