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
    transactions(
      page: Int
      limit: Int
      order: String
      BlockID: String
      AccountAddress: String
      refresh: Boolean
    ): Transactions!
    transaction(TransactionID: String!): Transaction!
  }

  extend type Mutation {
    transactions: String!
  }

  extend type Subscription {
    transactions: [Transaction!]!
  }

  type Transactions {
    Transactions: [Transaction!]!
    Paginate: Paginate!
  }

  type Transaction {
    _id: ID!
    TransactionID: String
    Timestamp: Date
    TransactionType: Int
    BlockID: String
    Height: Int
    Sender: String
    SenderFormatted: String
    Recipient: String
    RecipientFormatted: String
    Fee: Float
    Status: String
    FeeConversion: String
    Version: Int
    TransactionHash: String
    TransactionHashFormatted: String
    TransactionBodyLength: Int
    TransactionBodyBytes: String
    TransactionIndex: Int
    MultisigChild: Boolean
    Signature: String
    TransactionBody: String
    Message: String
    MessageFormatted: String
    TransactionTypeName: String
    SendMoney: SendMoney
    ClaimNodeRegistration: ClaimNodeRegistration
    NodeRegistration: NodeRegistration
    RemoveNodeRegistration: RemoveNodeRegistration
    UpdateNodeRegistration: UpdateNodeRegistration
    SetupAccount: SetupAccount
    RemoveAccount: RemoveAccount
    MultiSignature: MultiSignature
    ApprovalEscrow: ApprovalEscrow
    Escrow: Escrow
    EscrowTransaction: Transaction
    MultiSignatureTransactions: [Transaction!]
    Block: Block!
    FeeVoteCommit: FeeVoteCommit
    FeeVoteReveal: FeeVoteReveal
    LiquidPayment: LiquidPayment
    LiquidPaymentStop: LiquidPaymentStop
  }

  type LiquidPaymentStop {
    TransactionID: String
  }

  type LiquidPayment {
    Amount: Float
    AmountConversion: String
    CompleteMinutes: Int
  }

  type FeeVoteInfo {
    RecentBlockHash: String
    RecentBlockHeight: String
    FeeVote: Int
  }

  type FeeVoteReveal {
    FeeVoteInfo: FeeVoteInfo
    VoterSignature: String
  }

  type FeeVoteCommit {
    VoteHash: String
  }

  type Escrow {
    ID: String
    SenderAddress: String
    SenderAddressFormatted: String
    RecipientAddress: String
    RecipientAddressFormatted: String
    ApproverAddress: String
    ApproverAddressFormatted: String
    Amount: Float
    AmountConversion: String
    Commission: Float
    CommissionConversion: String
    Timeout: String
    Status: String
    BlockHeight: Int
    Latest: Boolean
    Instruction: String
  }

  type SendMoney {
    Amount: Float
    AmountConversion: String
  }

  type NodeRegistration {
    NodePublicKey: String
    NodePublicKeyFormatted: String
    AccountAddress: String
    AccountAddressFormatted: String
    NodeAddress: NodeAddress
    LockedBalance: Float
    LockedBalanceConversion: String
    ProofOfOwnership: ProofOfOwnership
  }

  type SetupAccount {
    SetterAccountAddress: String
    SetterAccountAddressFormatted: String
    RecipientAccountAddress: String
    RecipientAccountAddressFormatted: String
    Property: String
    Value: String
  }

  type UpdateNodeRegistration {
    NodePublicKey: String
    NodePublicKeyFormatted: String
    NodeAddress: NodeAddress
    LockedBalance: Float
    LockedBalanceConversion: String
    ProofOfOwnership: ProofOfOwnership
  }

  type RemoveAccount {
    SetterAccountAddress: String
    SetterAccountAddressFormatted: String
    RecipientAccountAddress: String
    RecipientAccountAddressFormatted: String
    Property: String
    Value: String
  }

  type RemoveNodeRegistration {
    NodePublicKey: String
    NodePublicKeyFormatted: String
  }

  type ClaimNodeRegistration {
    NodePublicKey: String
    NodePublicKeyFormatted: String
    ProofOfOwnership: ProofOfOwnership
  }

  type ApprovalEscrow {
    Approval: String
    TransactionID: String
  }

  type MultiSignature {
    UnsignedTransactionBytes: String
    MultiSignatureInfo: MultiSignatureInfo
    SignatureInfo: SignatureInfo
  }

  type MultiSignatureInfo {
    MultisigAddress: String
    MultisigAddressFormatted: String
    BlockHeight: Int
    Nonce: String
    MinimumSignatures: Int
    Latest: Boolean
    Addresses: [String]
    AddressesFormatted: [String]
  }

  type SignatureInfo {
    TransactionHash: String
    TransactionHashFormatted: String
    Signatures: [Signatures]
  }

  type ProofOfOwnership {
    MessageBytes: String
    Signature: String
  }

  type Signatures {
    Address: String
    Signature: String
  }
`
