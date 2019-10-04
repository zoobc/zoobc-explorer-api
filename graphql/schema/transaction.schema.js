const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    transactions(page: Int, limit: Int, order: String, BlockID: String, AccountAddress: String): Transactions!
    transaction(TransactionID: String!): Transaction!
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
    Confirmations: Boolean
    Fee: Float
    FeeConversion: Float
    Version: Int
    TransactionHash: String
    TransactionBodyLength: Int
    TransactionBodyBytes: String
    TransactionIndex: Int
    Signature: String
    TransactionBody: String
    TransactionTypeName: String
    SendMoney: SendMoney
    NodeRegistration: NodeRegistration
    SetupAccount: SetupAccount
    UpdateNodeRegistration: UpdateNodeRegistration
    RemoveAccount: RemoveAccount
    RemoveNodeRegistration: RemoveNodeRegistration
    ClaimNodeRegistration: ClaimNodeRegistration
    Block: Block!
  }

  type SendMoney {
    Amount: Float
    AmountConversion: Float
  }

  type NodeRegistration {
    NodePublicKey: String
    AccountAddress: String
    NodeAddress: String
    LockedBalance: Float
    LockedBalanceConversion: Float
    ProofOfOwnership: ProofOfOwnership
  }

  type SetupAccount {
    SetterAccountAddress: String
    RecipientAccountAddress: String
    Property: String
    Value: String
    MuchTime: Int
  }

  type UpdateNodeRegistration {
    NodePublicKey: String
    NodeAddress: String
    LockedBalance: Float
    LockedBalanceConversion: Float
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
    AccountAddress: String
    ProofOfOwnership: ProofOfOwnership
  }

  type ProofOfOwnership {
    MessageBytes: String
    Signature: String
  }
`;
