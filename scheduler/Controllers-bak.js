const moment = require('moment');
const { Converter } = require('../utils');
const { Block, Transaction, AccountBalance, NodeRegistration } = require('./Protos');
const { BlocksService, BlockReceiptsService, TransactionsService, AccountsService, NodesService } = require('../api/services');

let state = { blocksAddition: false, accountAddresses: [], addNodePublicKeys: [], delNodePublicKeys: [] };

module.exports = class Controllers {
  constructor() {
    this.nodesService = new NodesService();
    this.blocksService = new BlocksService();
    this.accountsService = new AccountsService();
    this.transactionsService = new TransactionsService();
    this.blockReceiptsService = new BlockReceiptsService();
  }

  udateBlocks(callback) {
    state.blocksAddition = false;

    this.blocksService.getLastHeight((err, result) => {
      if (err) return callback(`[Blocks] Blocks Service - Get Last Height ${err}`, null);

      const params = { Limit: 500, Height: result ? parseInt(result.Height + 1) : 0 };
      Block.GetBlocks(params, (err, result) => {
        if (err) return callback(`[Blocks] Block - Get Blocks ${err}`, null);
        if (result && result.Blocks && result.Blocks.length < 1) return callback(null, null);

        const matchs = ['BlockID', 'Height'];
        const items = result.Blocks.map(item => {
          if (item.BlockReceipts && item.BlockReceipts.length > 0) {
            /** WAITING FROM CORE */
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

            this.blockReceiptsService.upsert(item.BlockReceipts, matchs, (err, result) => {
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
            TotalAmountConversion: Converter.zoobitConversion(item.Block.TotalAmount),
            TotalFee: item.Block.TotalFee,
            TotalFeeConversion: Converter.zoobitConversion(item.Block.TotalFee),
            TotalCoinBase: item.Block.TotalCoinBase,
            TotalCoinBaseConversion: Converter.zoobitConversion(item.Block.TotalCoinBase),
            TotalRewards: totalRewards,
            TotalRewardsConversion: Converter.zoobitConversion(totalRewards),
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
          state.blocksAddition = true;
          return callback(null, `[Blocks] Upsert ${items.length} data successfully`);
        });
      });
    });
  }

  updateTransactions(callback) {
    if (!state.blocksAddition) return callback(null, null);
    state = { accountAddresses: [], addNodePublicKeys: [], delNodePublicKeys: [] };

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

          let accountAddresses = [];
          let addNodePublicKeys = [];
          let delNodePublicKeys = [];
          // let TotalFeesPaidSender = 0;

          const results = result.Transactions.filter(item => item.Height === height);
          const items = results.map(item => {
            let sendMoney = null;
            let claimNodeRegistration = null;
            let nodeRegistration = null;
            let removeNodeRegistration = null;
            let updateNodeRegistration = null;
            let setupAccount = null;
            let removeAccount = null;
            let transactionTypeName = '';
            switch (item.TransactionType) {
              case 1:
                transactionTypeName = 'Send Money';
                sendMoney = {
                  Amount: item.sendMoneyTransactionBody.Amount,
                  AmountConversion: Converter.zoobitConversion(item.sendMoneyTransactionBody.Amount),
                };
                break;
              case 2:
                transactionTypeName = 'Node Registration';
                addNodePublicKeys.push(item.nodeRegistrationTransactionBody.NodePublicKey);
                nodeRegistration = {
                  NodePublicKey: Buffer.from(item.nodeRegistrationTransactionBody.NodePublicKey).toString('base64'),
                  AccountAddress: item.nodeRegistrationTransactionBody.AccountAddress,
                  NodeAddress: item.nodeRegistrationTransactionBody.NodeAddress,
                  LockedBalance: item.nodeRegistrationTransactionBody.LockedBalance,
                  LockedBalanceConversion: Converter.zoobitConversion(item.nodeRegistrationTransactionBody.LockedBalance),
                  ProofOfOwnership: item.nodeRegistrationTransactionBody.ProofOfOwnership,
                };
                break;
              case 3:
                transactionTypeName = 'Setup Account';
                setupAccount = item.setupAccountDatasetTransactionBody;
                break;
              case 258:
                transactionTypeName = 'Update Node Registration';
                addNodePublicKeys.push(item.updateNodeRegistrationTransactionBody.NodePublicKey);
                updateNodeRegistration = {
                  NodePublicKey: Buffer.from(item.updateNodeRegistrationTransactionBody.NodePublicKey).toString('base64'),
                  NodeAddress: item.updateNodeRegistrationTransactionBody.NodeAddress,
                  LockedBalance: item.updateNodeRegistrationTransactionBody.LockedBalance,
                  LockedBalanceConversion: Converter.zoobitConversion(item.updateNodeRegistrationTransactionBody.LockedBalance),
                  ProofOfOwnership: item.updateNodeRegistrationTransactionBody.ProofOfOwnership,
                };
                break;
              case 259:
                transactionTypeName = 'Remove Account';
                removeAccount = item.removeAccountDatasetTransactionBody;
                break;
              case 514:
                transactionTypeName = 'Remove Node Registration';
                delNodePublicKeys.push(item.removeNodeRegistrationTransactionBody.NodePublicKey);
                removeNodeRegistration = {
                  NodePublicKey: Buffer.from(item.removeNodeRegistrationTransactionBody.NodePublicKey).toString('base64'),
                };
                break;
              case 770:
                transactionTypeName = 'Claim Node Registration';
                addNodePublicKeys.push(item.claimNodeRegistrationTransactionBody.NodePublicKey);
                claimNodeRegistration = {
                  NodePublicKey: Buffer.from(item.claimNodeRegistrationTransactionBody.NodePublicKey).toString('base64'),
                  AccountAddress: item.claimNodeRegistrationTransactionBody.AccountAddress,
                  ProofOfOwnership: item.claimNodeRegistrationTransactionBody.ProofOfOwnership,
                };
                break;
              default:
                transactionTypeName = 'Empty';
                break;
            }

            accountAddresses.push({
              IsSender: true,
              AccountAddress: item.SenderAccountAddress,
              Fee: parseInt(item.Fee),
              FeeConversion: Converter.zoobitConversion(parseInt(item.Fee)),
              // Balance: 0,
              // BalanceConversion: 0,
              // FirstActive: null,
              // LastActive: null,
              // TotalRewards: 0,
              // TotalRewardsConversion: 0,
              // TotalFeesPaid: 0,
              // TotalFeesPaidConversion: 0,
              // TotalFeesPaid: parseInt(TotalFeesPaidSender) + parseInt(item.Fee),
              // TotalFeesPaidConversion: Converter.zoobitConversion(TotalFeesPaidSender + parseInt(item.Fee)),
              BlockHeight: item.Height,
              Timestamp: moment.unix(item.Timestamp).valueOf(),
            });

            accountAddresses.push({
              IsSender: false,
              AccountAddress: item.RecipientAccountAddress,
              Fee: 0,
              FeeConversion: 0,
              // Balance: 0,
              // BalanceConversion: 0,
              // FirstActive: null,
              // LastActive: null,
              // TotalRewards: 0,
              // TotalRewardsConversion: 0,
              // TotalFeesPaid: 0,
              // TotalFeesPaidConversion: 0,
              BlockHeight: item.Height,
              Timestamp: moment.unix(item.Timestamp).valueOf(),
            });

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
              FeeConversion: Converter.zoobitConversion(item.Fee),
              Version: item.Version,
              TransactionHash: item.TransactionHash,
              TransactionBodyLength: item.TransactionBodyLength,
              TransactionBodyBytes: item.TransactionBodyBytes,
              TransactionIndex: item.TransactionIndex,
              Signature: item.Signature,
              TransactionBody: item.TransactionBody,
              TransactionTypeName: transactionTypeName,
              SendMoney: sendMoney,
              ClaimNodeRegistration: claimNodeRegistration,
              NodeRegistration: nodeRegistration,
              RemoveNodeRegistration: removeNodeRegistration,
              UpdateNodeRegistration: updateNodeRegistration,
              SetupAccount: setupAccount,
              RemoveAccount: removeAccount,
            };
          });

          // state.accountAddresses = accountAddresses.filter((v, i) => accountAddresses.indexOf(v) === i);
          state.accountAddresses = accountAddresses;
          state.addNodePublicKeys = addNodePublicKeys.filter((v, i) => addNodePublicKeys.indexOf(v) === i);
          state.delNodePublicKeys = delNodePublicKeys.filter((v, i) => delNodePublicKeys.indexOf(v) === i);

          const matchs = ['TransactionID', 'Height'];
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
    if (state.addNodePublicKeys.length < 1) return callback(null, null);

    const addNodes = state.addNodePublicKeys.map(nodePublicKey => {
      return new Promise((resolve, reject) => {
        NodeRegistration.GetNodeRegistration({ NodePublicKey: nodePublicKey }, (err, resp) => {
          if (err) return reject(`[Nodes] Node Registration - Get Node Registration ${err}`, null);
          if (resp && resp.NodeRegistration && resp.NodeRegistration === {}) return resolve(0);

          const items = [
            {
              NodePublicKey: resp.NodeRegistration.NodePublicKey
                ? Buffer.from(resp.NodeRegistration.NodePublicKey).toString('base64')
                : null,
              OwnerAddress: resp.NodeRegistration.AccountAddress,
              NodeAddress: resp.NodeRegistration.NodeAddress,
              LockedFunds: resp.NodeRegistration.LockedBalance,
              RegisteredBlockHeight: resp.NodeRegistration.RegistrationHeight,
              ParticipationScore: null,
              RegistryStatus: resp.NodeRegistration.Queued,
              BlocksFunds: null,
              RewardsPaid: null,
              Latest: resp.NodeRegistration.Latest,
              Height: resp.NodeRegistration.Height,
              NodeID: resp.NodeRegistration.NodeID,
            },
          ];

          const matchs = ['NodeID', 'NodePublicKey'];
          this.nodesService.upsert(items, matchs, (err, result) => {
            if (err) return reject(`[Nodes] Upsert ${err}`);
            if (result && result.ok !== 1) return reject(`[Nodes] Upsert data failed`);
            return resolve(items.length);
          });
        });
      });
    });

    Promise.all(addNodes)
      .then(results => {
        const count = results.reduce((prev, curr) => {
          return parseInt(prev) + parseInt(curr);
        }, 0);

        if (count < 1) return callback(null, null);
        return callback(null, `[Nodes] Upsert ${count} data successfully`);
      })
      .catch(error => callback(error, null));
  }

  deleteNodes(callback) {
    if (state.delNodePublicKeys.length < 1) return callback(null, null);

    const nodePublicKeys = state.delNodePublicKeys.map(nodePublicKey => {
      return Buffer.from(nodePublicKey).toString('base64');
    });
    this.nodesService.destroyMany({ NodePublicKey: { $in: nodePublicKeys } }, (err, result) => {
      if (err) return callback(`[Nodes] Nodes Service - Destroy Many ${err}`, null);
      if (result.ok < 1 || result.deletedCount < 1) return callback(null, null);
      return callback(null, `[Nodes] Deleted ${nodePublicKeys.length} data successfully`);
    });
  }

  updateAccountTransactions(callback) {
    // console.log('==state.accountAddresses', state.accountAddresses);
    state.accountAddresses = [
      {
        IsSender: true,
        AccountAddress: 'BCZD_VxfO2S9aziIL3cn_cXW7uPDVPOrnXuP98GEAUC7',
        Fee: 0,
        FeeConversion: 0,
        Balance: 0,
        BalanceConversion: 0,
        FirstActive: null,
        LastActive: null,
        TotalRewards: 0,
        TotalRewardsConversion: 0,
        TotalFeesPaid: 0,
        TotalFeesPaidConversion: 0,
        BlockHeight: 0,
        Timestamp: 1562806389000,
      },
      {
        IsSender: true,
        AccountAddress: 'RIwnKZz2UwV3q5cf2gFY7llMT3jUFXTjcO7LWdbWcy19',
        Fee: 5000,
        FeeConversion: 0.00005,
        Balance: 0,
        BalanceConversion: 0,
        FirstActive: null,
        LastActive: null,
        TotalRewards: 0,
        TotalRewardsConversion: 0,
        TotalFeesPaid: 5000,
        TotalFeesPaidConversion: 0.00005,
        BlockHeight: 20,
        Timestamp: 1569914656000,
      },
      {
        IsSender: false,
        AccountAddress: 'GOyhJUaHmc473WupBhmDsLE949ytd-yRL0k8-Miqufqb',
        Fee: 0,
        FeeConversion: 0,
        Balance: 0,
        BalanceConversion: 0,
        FirstActive: null,
        LastActive: null,
        TotalRewards: 0,
        TotalRewardsConversion: 0,
        TotalFeesPaid: 0,
        TotalFeesPaidConversion: 0,
        BlockHeight: 20,
        Timestamp: 1569914656000,
      },
    ];

    if (state.accountAddresses.length < 1) return callback(null, null);
  }

  updateAccounts(callback) {
    // // console.log('==state.accountAddresses', state.accountAddresses);
    // state.accountAddresses = [
    //   {
    //     IsSender: true,
    //     AccountAddress: 'BCZD_VxfO2S9aziIL3cn_cXW7uPDVPOrnXuP98GEAUC7',
    //     Fee: 0,
    //     FeeConversion: 0,
    //     Balance: 0,
    //     BalanceConversion: 0,
    //     FirstActive: null,
    //     LastActive: null,
    //     TotalRewards: 0,
    //     TotalRewardsConversion: 0,
    //     TotalFeesPaid: 0,
    //     TotalFeesPaidConversion: 0,
    //     BlockHeight: 0,
    //     Timestamp: 1562806389000,
    //   },
    //   {
    //     IsSender: true,
    //     AccountAddress: 'RIwnKZz2UwV3q5cf2gFY7llMT3jUFXTjcO7LWdbWcy19',
    //     Fee: 5000,
    //     FeeConversion: 0.00005,
    //     Balance: 0,
    //     BalanceConversion: 0,
    //     FirstActive: null,
    //     LastActive: null,
    //     TotalRewards: 0,
    //     TotalRewardsConversion: 0,
    //     TotalFeesPaid: 5000,
    //     TotalFeesPaidConversion: 0.00005,
    //     BlockHeight: 20,
    //     Timestamp: 1569914656000,
    //   },
    //   {
    //     IsSender: false,
    //     AccountAddress: 'GOyhJUaHmc473WupBhmDsLE949ytd-yRL0k8-Miqufqb',
    //     Fee: 0,
    //     FeeConversion: 0,
    //     Balance: 0,
    //     BalanceConversion: 0,
    //     FirstActive: null,
    //     LastActive: null,
    //     TotalRewards: 0,
    //     TotalRewardsConversion: 0,
    //     TotalFeesPaid: 0,
    //     TotalFeesPaidConversion: 0,
    //     BlockHeight: 20,
    //     Timestamp: 1569914656000,
    //   },
    // ];

    if (state.accountAddresses.length < 1) return callback(null, null);


    // const AccountAddress = state.accountAddresses.map(i => i.AccountAddress);
    // const params = { where: { AccountAddress: { $in: AccountAddress } }, order: 'Height' };
    // console.log('==AccountAddress', AccountAddress);
    // this.accountsService.findAll(params, (err, results) => {
    //   if (err) return callback(`[Accounts] Account Service - Find All ${err}`, null);
    //   // console.log('==results', results);
    //   if (results && results.length < 1) {

    //   }
    // });

    // const accounts = state.accountAddresses.map(accountAddress => {
    //   return new Promise((resolve, reject) => {
    //     AccountBalance.GetAccountBalance({ AccountAddress: accountAddress }, (err, result) => {
    //       if (err) return reject(`[Accounts] Account Balance - Get Account Balance ${err}`);
    //       if (result && result.AccountBalance && result.AccountBalance === {}) return resolve(0);

    //       const items = [
    //         {
    //           AccountAddress: result.AccountBalance.AccountAddress,
    //           Balance: result.AccountBalance.Balance,
    //           BalanceConversion: Converter.zoobitConversion(result.AccountBalance.Balance),
    //           SpendableBalance: result.AccountBalance.SpendableBalance,
    //           SpendableBalanceConversion: Converter.zoobitConversion(result.AccountBalance.SpendableBalance),
    //           FirstActive: null,
    //           LastActive: null,
    //           TotalRewards: null,
    //           TotalRewardsConversion: null,
    //           TotalFeesPaid: null,
    //           TotalFeesPaidConversion: null,
    //           NodePublicKey: null,
    //           BlockHeight: result.AccountBalance.BlockHeight,
    //           PopRevenue: result.AccountBalance.PopRevenue,
    //           Latest: result.AccountBalance.Latest,
    //         },
    //       ];

    //       const matchs = ['AccountAddress', 'BlockHeight'];
    //       this.accountsService.upsert(items, matchs, (err, result) => {
    //         if (err) return reject(`[Accounts] Upsert ${err}`);
    //         if (result && result.ok !== 1) return reject(`[Accounts] Upsert data failed`);
    //         return resolve(items.length);
    //       });
    //     });
    //   });
    // });

    // Promise.all(accounts)
    //   .then(results => {
    //     const count = results.reduce((prev, curr) => {
    //       return parseInt(prev) + parseInt(curr);
    //     }, 0);

    //     if (count < 1) return callback(null, null);
    //     return callback(null, `[Accounts] Upsert ${count} data successfully`);
    //   })
    //   .catch(error => callback(error, null));
  }

  redudance(callback) {
    this.blocksService.destoryRedudance((err, result) => {
      if (err) return callback(`[Redudance] Blocks Service - Destroy Redudance ${err}`);
      if (!result) return callback(null, null);
      return callback(null, `[Redudance] Delete duplicate ${result} data successfully`);
    });
  }

  rollback(callback) {
    this.blocksService.getLastHeight(async (err, result) => {
      if (err) return callback(`[Rollback] Blocks Service - Get Last Height ${err}`, { success: false, info: null });
      if (!result || !result.Height) return callback(null, { success: false, info: null });

      const Limit = 800;
      const Height = parseInt(result.Height) - Limit < 1 ? 1 : parseInt(result.Height) - Limit;
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

        // this.accountsService.destroyMany({ BlockHeight: { $gte: result.Height } }, (err, result) => {
        //   if (err) return callback(`[Rollback] Accounts Service - Destroy Many ${err}`, { success: false, info: null });
        //   if (result.ok < 1 || result.deletedCount < 1) return callback(null, { success: false, info: 'Accounts' });
        //   return callback(null, { success: true, info: `[Rollback - Accounts] Delete ${result.deletedCount} data successfully` });
        // });
      });
    });

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
  }
};
