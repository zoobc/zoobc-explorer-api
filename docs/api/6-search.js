/**
 * @swagger
 * tags:
 *  - name: Search
 *    description: Rest API SearchAPI to search by BlockID or TransactionID.
 * paths:
 *  /search:
 *    get:
 *      tags:
 *        - Search
 *      parameters:
 *        - in: query
 *          name: ID
 *          schema:
 *            type: integer
 *            example: -8411591260855429783
 *          description: Block ID or TransactionID
 *      summary: Get Single Block or Transaction
 *      description: Get Single Block by Block ID or Transaction.
 *      responses:
 *        200:
 *          description: response status
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/PageBlock'
 *        500:
 *          description: response status
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/SendInternalServerError'
 * definitions:
 *  PageBlock:
 *    properties:
 *      data:
 *        type: object
 *        $ref: '#/definitions/Block'
 *  PageTransaction:
 *    properties:
 *      data:
 *        type: array
 *        items:
 *          $ref: '#/definitions/Transaction'
 *  Block:
 *    properties:
 *      ID:
 *        type: string
 *        example: '-9217256230337793364'
 *      PreviousBlockHash:
 *        type: string
 *        example: 'phqSwa3IJiN1/l7bXgKiSdWIzHYCez44fmEfTAErUSHNCAglqhYWa8Mu5P+gM0UffgiumLGoB644gc1tyAc0cA=='
 *      Height:
 *        type: Number
 *        example: 379
 *      Timestamp:
 *        type: string
 *        example: '16-Jul-2019 03:31:19'
 *      BlockSeed:
 *        type: string
 *        example: 'L8BqsLkQ8j1v72uErTeX3FQe77khcHeE6uFiFLT7/UTA9cLlwmYdrgRzyG++vCnjK3Jn9pRc1qvvRjpg7DIUjQ=='
 *      BlockSignature:
 *        type: string
 *        example: 'g8laoR+unV2WxUiartNxbB2sXGDFuvUxXqj372xfdcMyh7VCb1qvdb4v7riUB1Gp9uGYLTpCvsWb1be+Mi/XDQ=='
 *      CumulativeDifficulty:
 *        type: string
 *        example: '62619300479358'
 *      SmithScale:
 *        type: string
 *        example: '76112951'
 *      BlocksmithID:
 *        type: string
 *        example: 'BCZEGOb3WNx3fDOVf9ZS4EjvOIv/UeW4TVBQJ/6tHKk='
 *      TotalAmount:
 *        type: string
 *        example: '0'
 *      TotalFee:
 *        type: string
 *        example: '0'
 *      TotalCoinBase:
 *        type: string
 *        example: '0'
 *      Version:
 *        type: Number
 *        example: 1
 *      PayloadLength:
 *        type: Number
 *        example: 0
 *      PayloadHash:
 *        type: string
 *        example: ''
 *      Transactions:
 *        type: array
 *        items: []
 *  Transaction:
 *    properties:
 *      ID:
 *        type: string
 *        example: '-9217256230337793364'
 *      BlockID:
 *        type: string
 *        example: '4545420970999433273'
 *      Version:
 *        type: Number
 *        example: '1'
 *      Height:
 *        type: Number
 *        example: 379
 *      SenderAccountType:
 *        type: string
 *        example: '16-Jul-2019 03:31:19'
 *      SenderAccountAddress:
 *        type: string
 *        example: 'L8BqsLkQ8j1v72uErTeX3FQe77khcHeE6uFiFLT7/UTA9cLlwmYdrgRzyG++vCnjK3Jn9pRc1qvvRjpg7DIUjQ=='
 *      RecipientAccountType:
 *        type: string
 *        example: 'g8laoR+unV2WxUiartNxbB2sXGDFuvUxXqj372xfdcMyh7VCb1qvdb4v7riUB1Gp9uGYLTpCvsWb1be+Mi/XDQ=='
 *      RecipientAccountAddress:
 *        type: string
 *        example: '62619300479358'
 *      TransactionType:
 *        type: Number
 *        example: '76112951'
 *      Fee:
 *        type: Number
 *        example: '0'
 *      Timestamp:
 *        type: Number
 *        example: '1562806389280'
 *      TransactionHash:
 *        type: string
 *        example: ''
 *      TransactionBodyLength:
 *        type: Number
 *        example: 1
 *      TransactionBodyBytes:
 *        type: string
 *        example: ''
 *      Signature:
 *        type: string
 *        example: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
 */
