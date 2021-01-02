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
