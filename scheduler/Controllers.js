const moment = require('moment');
const { Block, Transaction, AccountBalance, NodeRegistration } = require('./Protos');
const { BlocksService, BlockReceiptsService, TransactionsService, AccountsService, NodesService } = require('../api/services');

var state = { accountAddresses: [], nodePublicKeys: [] };

function currConversion(curr) {
  if (!curr) return 0;
  return curr / Math.pow(10, 8);
}

module.exports = class Controllers {
  constructor() {
    this.nodesService = new NodesService();
    this.blocksService = new BlocksService();
    this.accountsService = new AccountsService();
    this.transactionsService = new TransactionsService();
    this.blockReceiptsService = new BlockReceiptsService();
  }

  updateBlocks(callback) {
    this.blocksService.getLastHeight((err, result) => {
      if (err) return callback(`[Blocks] Blocks Service - Get Last Height ${err}`, null);

      const params = { Limit: 500, Height: result ? parseInt(result.Height + 1) : 0 };
      Block.GetBlocks(params, (err, result) => {
        if (err) return callback(`[Blocks] Block - Get Blocks ${err}`, null);
        if (result && result.Blocks && result.Blocks.length < 1) return callback(null, null);

        const matchs = ['BlockID', 'Height'];
        const items = result.Blocks.map(item => {
          if (item.BlockReceipts && item.BlockReceipts.length > 0) {
            // const blockReceipts = item.BlockReceipts.map(receipt => {
            //   return {
            //     BlockID: receipt.BlockID,
            //     Height: receipt.Height,
            //     SenderPublicKey: receipt.SenderPublicKey,
            //     ReceiverPublicKey: receipt.ReceiverPublicKey,
            //     DataType: receipt.DataType,
            //     DataHash: receipt.DataHash,
            //     ReceiptMerkleRoot: receipt.ReceiptMerkleRoot,
            //     ReceiverSignature: receipt.ReceiverSignature,
            //   };
            // });

            const matchBlockReceipts = ['BlockID', 'Height'];
            this.blockReceiptsService.upsert(item.BlockReceipts, matchBlockReceipts, (err, result) => {
              if (err) return callback(`[Block Receipts] Upsert ${err}`, null);
              if (result && result.ok !== 1) return callback(`[Block Receipts] Upsert data failed`, null);
              return callback(null, `[Block Receipts] Upsert ${item.BlockReceipts.length} data successfully`);
            });
          }

          const totalRewards = parseFloat(item.Block.TotalCoinBase) + parseFloat(item.Block.TotalFee);
          return {
            BlockID: item.Block.ID,
            PreviousBlockID: item.Block.PreviousBlockHash,
            Height: item.Block.Height,
            Timestamp: moment.unix(item.Block.Timestamp).valueOf(),
            BlockSeed: item.Block.BlockSeed,
            BlockSignature: item.Block.BlockSignature,
            CumulativeDifficulty: item.Block.CumulativeDifficulty,
            SmithScale: item.Block.SmithScale,
            BlocksmithAddress: item.Block.BlocksmithPublicKey,
            TotalAmount: item.Block.TotalAmount,
            TotalAmountConversion: currConversion(item.Block.TotalAmount),
            TotalFee: item.Block.TotalFee,
            TotalFeeConversion: currConversion(item.Block.TotalFee),
            TotalCoinBase: item.Block.TotalCoinBase,
            TotalCoinBaseConversion: currConversion(item.Block.TotalCoinBase),
            TotalRewards: totalRewards,
            TotalRewardsConversion: currConversion(totalRewards),
            Version: item.Block.Version,
            PayloadLength: item.Block.PayloadLength,
            PayloadHash: item.Block.PayloadHash,
            BlocksmithID: item.BlocksmithAccountAddress,
            TotalReceipts: item.TotalReceipts,
            ReceiptValue: item.ReceiptValue,
            PopChange: item.PopChange,
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
    state = { accountAddresses: [], nodePublicKeys: [] };

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

      const lastHeightTransaction = result.Height;
      this.blocksService.getLastHeight((err, result) => {
        if (err) return callback(err, null);
        if (!result) return callback(null, null);

        const lastHeightBlock = result.Height;
        UpsertTransactions(this.transactionsService, lastHeightTransaction + 1, lastHeightBlock, (err, result) => {
          if (err) return callback(err, null);
          if (!result) return callback(null, null);
          return callback(null, result);
        });
      });
    });

    function UpsertTransactions(service, heightStart, heightEnd, callback) {
      function GetUpsertTransactions(height, callback) {
        const params = { Height: height, Pagination: { OrderField: 'block_height', OrderBy: 'ASC' } };
        Transaction.GetTransactions(params, (err, result) => {
          if (err) return callback(`[Transactions] Get Transactions ${err}`, null);
          if (result && result.Transactions && result.Transactions.length < 1) return callback(null, null);

          let sender = [];
          let recipient = [];
          const matchs = ['TransactionID', 'Height'];

          const results = result.Transactions.filter(item => item.Height === height);
          const items = results.map(item => {
            sender.push(item.SenderAccountAddress);
            recipient.push(item.RecipientAccountAddress);
            state.nodePublicKeys.push(item.ID);

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
              FeeConversion: currConversion(item.Fee),
              Version: item.Version,
              TransactionHash: item.TransactionHash,
              TransactionBodyLength: item.TransactionBodyLength,
              TransactionBodyBytes: item.TransactionBodyBytes,
              TransactionIndex: item.TransactionIndex,
              Signature: item.Signature,
            };
          });

          const concatAccounts = sender.concat(recipient.filter(item => sender.indexOf(item) < 0));
          const accounts = concatAccounts.filter((v, i) => concatAccounts.indexOf(v) === i);
          state.accountAddresses = state.accountAddresses.concat(accounts.filter(item => state.accountAddresses.indexOf(item) < 0));

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
    // // console.log('==state.transactionIDs', state.transactionIDs);
    // const transactionIDs = ['-7153423959411140033', '4066855019449265628', '7429271499130620937'];
    // if (transactionIDs.length < 1) return callback(null, null);

    // transactionIDs.forEach(ID => {
    //   Transaction.GetTransaction({ ID }, (err, resp) => {
    //     if (err) return callback(`[Nodes] Transaction - Get Transaction ${err}`, null);
    //     console.log('==resp', resp);
    //   });
    // });

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
              BalanceConversion: currConversion(result.AccountBalance.Balance),
              SpendableBalance: result.AccountBalance.SpendableBalance,
              SpendableBalanceConversion: currConversion(result.AccountBalance.SpendableBalance),
              FirstActive: null,
              LastActive: null,
              TotalRewards: null,
              TotalRewardsConversion: null,
              TotalFeesPaid: null,
              TotalFeesPaidConversion: null,
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

  redudance(callback) {
    this.blocksService.destoryRedudance((err, result) => {
      if (err) return callback(`[Redudance] Blocks Service - Destroy Redudance ${err}`);
      if (!result) return callback(null, null);
      return callback(null, `[Redudance] Delete duplicate ${result} data successfully`);
    });
  }

  rollback(callback) {
    function getDiffBlockHeight(service, limit, height, callback) {
      if (height < 1) return callback(null, null);

      Block.GetBlocks({ Limit: limit, Height: height }, (err, result) => {
        if (err) return callback(`[Rollback] Block - Get Blocks ${err}`);
        if (result && result.Blocks && result.Blocks.length < 1) {
          const prevHeight = height - limit;
          return getDiffBlockHeight(service, limit, prevHeight, callback);
        }

        service.getFromHeight({ Limit: limit, Height: height }, (err, results) => {
          if (err) return callback(`[Rollback] Blocks Service - Get From Height ${err}`, null);
          if (results && results.length < 1) {
            const prevHeight = height - limit;
            return getDiffBlockHeight(service, limit, prevHeight, callback);
          }

          const resultsCore = result.Blocks.map(item => ({
            BlockID: item.Block.ID,
            Height: item.Block.Height,
          })).sort((a, b) => (a.Height > b.Height ? 1 : -1));

          const resultsExplorer = results
            .map(item => ({ BlockID: item.BlockID, Height: item.Height }))
            .sort((a, b) => (a.Height > b.Height ? 1 : -1));

          const diffs = resultsCore.filter(({ BlockID: val1 }) => !resultsExplorer.some(({ BlockID: val2 }) => val2 === val1));
          if (diffs && diffs.length < 1) {
            const prevHeight = height - limit;
            return getDiffBlockHeight(service, limit, prevHeight, callback);
          }

          const diff = Array.isArray(diffs) ? diffs[0] : diffs;
          return callback(null, diff);
        });
      });
    }

    this.blocksService.getLastHeight(async (err, result) => {
      if (err) return callback(`[Rollback] Blocks Service - Get Last Height ${err}`, { success: false, info: null });
      if (!result || !result.Height) return callback(null, { success: false, info: null });

      const Limit = 800;
      const Height = parseInt(result.Height) - Limit < 0 ? 1 : parseInt(result.Height) - Limit;
      getDiffBlockHeight(this.blocksService, Limit, Height, (err, result) => {
        if (err) return callback(err, { success: false, info: null });
        if (!result) return callback(null, { success: false, info: null });

        this.blocksService.destroyMany({ Height: { $gte: result.Height } }, (err, result) => {
          if (err) return callback(`[Rollback] Blocks Service - Destroy Many ${err}`, { success: false, info: null });
          if (result.ok < 1 || result.deletedCount < 1) return callback(null, { success: false, info: 'Blocks' });
          return callback(null, { success: true, info: `[Rollback - Blocks] Delete ${result.deletedCount} data successfully` });
        });

        this.transactionsService.destroyMany({ Height: { $gte: result.Height } }, (err, result) => {
          if (err) return callback(`[Rollback] Transactions Service - Destroy Many ${err}`, { success: false, info: null });
          if (result.ok < 1 || result.deletedCount < 1) return callback(null, { success: false, info: 'Transactions' });
          return callback(null, { success: true, info: `[Rollback - Transactions] Delete ${result.deletedCount} data successfully` });
        });

        this.nodesService.destroyMany({ Height: { $gte: result.Height } }, (err, result) => {
          if (err) return callback(`[Rollback] Nodes Service - Destroy Many ${err}`, { success: false, info: null });
          if (result.ok < 1 || result.deletedCount < 1) return callback(null, { success: false, info: 'Nodes' });
          return callback(null, { success: true, info: `[Rollback - Nodes] Delete ${result.deletedCount} data successfully` });
        });

        this.accountsService.destroyMany({ BlockHeight: { $gte: result.Height } }, (err, result) => {
          if (err) return callback(`[Rollback] Accounts Service - Destroy Many ${err}`, { success: false, info: null });
          if (result.ok < 1 || result.deletedCount < 1) return callback(null, { success: false, info: 'Accounts' });
          return callback(null, { success: true, info: `[Rollback - Accounts] Delete ${result.deletedCount} data successfully` });
        });
      });
    });
  }
};
