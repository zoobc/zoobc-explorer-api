const { gql } = require('apollo-server-express')

module.exports = gql`
  extend type Query {
    transactions(page: Int, limit: Int, order: String, BlockID: String, AccountAddress: String): Transactions!
    transaction(TransactionID: String!): Transaction!
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
    Recipient: String
    Fee: Float
    FeeConversion: String
    Version: Int
    TransactionHash: String
    TransactionBodyLength: Int
    TransactionBodyBytes: String
    TransactionIndex: Int
    MultisigChild: Boolean
    Signature: String
    Escrow: Escrow
    TransactionBody: String
    TransactionTypeName: String
    SendMoney: SendMoney
    NodeRegistration: NodeRegistration
    SetupAccount: SetupAccount
    UpdateNodeRegistration: UpdateNodeRegistration
    RemoveAccount: RemoveAccount
    RemoveNodeRegistration: RemoveNodeRegistration
    ClaimNodeRegistration: ClaimNodeRegistration
    ApprovalEscrow: ApprovalEscrow
    MultiSignature: MultiSignature
    MultiSignatureTransactions: [Transaction!]!
    Block: Block!
  }

  type Escrow {
    ID: String
    SenderAddress: String
    RecipientAddress: String
    ApproverAddress: String
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
    AccountAddress: String
    NodeAddress: NodeAddress
    LockedBalance: Float
    LockedBalanceConversion: String
    ProofOfOwnership: ProofOfOwnership
  }

  type SetupAccount {
    SetterAccountAddress: String
    RecipientAccountAddress: String
    Property: String
    Value: String
  }

  type UpdateNodeRegistration {
    NodePublicKey: String
    NodeAddress: NodeAddress
    LockedBalance: Float
    LockedBalanceConversion: String
    ProofOfOwnership: ProofOfOwnership
  }

  type RemoveAccount {
    SetterAccountAddress: String
    RecipientAccountAddress: String
    Property: String
    Value: String
  }

  type RemoveNodeRegistration {
    NodePublicKey: String
  }

  type ClaimNodeRegistration {
    NodePublicKey: String
    ProofOfOwnership: ProofOfOwnership
  }

  type ApprovalEscrow {
    TransactionID: String
    Approval: String
  }

  type MultiSignature {
    MultiSignatureInfo: MultiSignatureInfo
    UnsignedTransactionBytes: String
    SignatureInfo: SignatureInfo
  }

  type MultiSignatureInfo {
    MinimumSignatures: Int
    Nonce: String
    Addresses: [String]
    MultisigAddress: String
    BlockHeight: Int
    Latest: Boolean
  }

  type SignatureInfo {
    TransactionHash: String
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
