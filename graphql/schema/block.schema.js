/** 
 * ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
 * This file is part of ZooBC <https://github.com/zoobc/zoobc-explorer-api>

 * ZooBC is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * ZooBC is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with ZooBC.  If not, see <http://www.gnu.org/licenses/>.

 * Additional Permission Under GNU GPL Version 3 section 7.
 * As the special exception permitted under Section 7b, c and e, 
 * in respect with the Author’s copyright, please refer to this section:

 * 1. You are free to convey this Program according to GNU GPL Version 3,
 *     as long as you respect and comply with the Author’s copyright by 
 *     showing in its user interface an Appropriate Notice that the derivate 
 *     program and its source code are “powered by ZooBC”. 
 *     This is an acknowledgement for the copyright holder, ZooBC, 
 *     as the implementation of appreciation of the exclusive right of the
 *     creator and to avoid any circumvention on the rights under trademark
 *     law for use of some trade names, trademarks, or service marks.

 * 2. Complying to the GNU GPL Version 3, you may distribute 
 *     the program without any permission from the Author. 
 *     However a prior notification to the authors will be appreciated.

 * ZooBC is architected by Roberto Capodieci & Barton Johnston
 * contact us at roberto.capodieci[at]blockchainzoo.com
 * and barton.johnston[at]blockchainzoo.com

 * IMPORTANT: The above copyright notice and this permission notice
 * shall be included in all copies or substantial portions of the Software.
**/

const { gql } = require('apollo-server-express')

module.exports = gql`
  extend type Query {
    blocks(page: Int, limit: Int, order: String, NodePublicKey: String, refresh: Boolean): Blocks!
    block(BlockID: String!): Block!
  }

  extend type Mutation {
    blocks: String!
  }

  extend type Subscription {
    blocks: [Block!]!
  }

  type Blocks {
    Blocks: [Block!]!
    Paginate: Paginate!
  }
  type Block {
    # Block
    _id: ID!
    BlockID: String
    BlockHash: String
    BlockHashFormatted: String
    PreviousBlockID: String
    PreviousBlockIDFormatted: String
    Height: Int
    Timestamp: Date
    BlockSeed: String
    BlockSignature: String
    CumulativeDifficulty: String
    SmithScale: Int
    BlocksmithID: String
    BlocksmithIDFormatted: String
    TotalAmount: Float
    TotalAmountConversion: String
    TotalFee: Float
    TotalFeeConversion: String
    TotalCoinBase: Float
    TotalCoinBaseConversion: String
    Version: Int
    PayloadLength: Int
    PayloadHash: String
    MerkleRoot: String
    MerkleTree: String
    ReferenceBlockHeight: Int

    # BlockExtendedInfo
    TotalReceipts: Float
    ReceiptValue: Float
    PopChange: String
    BlocksmithAddress: String
    BlocksmithAddressFormatted: String
    SkippedBlocksmiths: [SkippedBlocksmith]

    # Aggregate
    TotalRewards: Float
    TotalRewardsConversion: String
    PublishedReceipts: [PublishedReceipt]
    TotalTransaction: Int
    PopChanges: [PopChange]
    AccountRewards: [AccountReward]
  }

  type SkippedBlocksmith {
    BlocksmithPublicKey: String
    BlocksmithPublicKeyFormatted: String
    POPChange: String
    BlockHeight: Int
    BlocksmithIndex: Int
  }

  type PublishedReceipt {
    IntermediateHashes: String
    IntermediateHashesFormatted: String
    BlockHeight: Int
    ReceiptIndex: Int
    PublishedIndex: Int
    Receipt: Receipt
  }

  type Receipt {
    SenderPublicKey: String
    SenderPublicKeyFormatted: String
    RecipientPublicKey: String
    RecipientPublicKeyFormatted: String
    DatumType: Int
    DatumHash: String
    ReferenceBlockHeight: Int
    ReferenceBlockHash: String
    RMRLinked: String
    RecipientSignature: String
  }

  type PopChange {
    NodeID: String
    NodePublicKey: String
    NodePublicKeyFormatted: String
    Latest: Boolean
    Score: String
    Height: Int
    DifferenceScores: Float
    DifferenceScorePercentage: Float
    Flag: String
  }

  type AccountReward {
    AccountAddress: String
    AccountAddressFormatted: String
    BalanceChange: Float
    BalanceChangeConversion: String
    BlockHeight: Int
    TransactionID: Int
    Timestamp: Date
    EventType: String
  }
`
