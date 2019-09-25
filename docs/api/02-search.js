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
 *          name: id
 *          schema:
 *            type: string
 *            example: '-6885775591523989049'
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
 *  Block:
 *    properties:
 *      BlockID:
 *        type: string
 *        example: '-6705850196976533509'
 *      Height:
 *        type: number
 *        example: 0
 *      Timestamp:
 *        type: string
 *        example: '2019-07-03T01:27:51.000Z'
 *      PreviousBlockID:
 *        type: string
 *        example: ''
 *      BlockSeed:
 *        type: string
 *        example: '670cf4093aca3170801b6605ab236dbe3c96f62ec78086b2b9ab96b363e8335b'
 *      BlockSignature:
 *        type: string
 *        example: 'f3831afb0cfbaca8e9fca6523d0b23d14aa2e6f9ac1726f12c30acd4d622bb0a'
 *      CumulativeDifficulty:
 *        type: string
 *        example: '56081443881549597'
 *      SmithScale:
 *        type: string
 *        example: '107765422'
 *      BlocksmithAddress:
 *        type: string
 *        example: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
 *      TotalAmount:
 *        type: number
 *        example: 200000000000
 *      TotalFee:
 *        type: number
 *        example: 0
 *      TotalRewards:
 *        type: number
 *        example: 0
 *      Version:
 *        type: number
 *        example: 1
 *      TotalReceipts:
 *        type: number
 *        example: 99
 *      ReceiptValue:
 *        type: number
 *        example: 99
 *      BlocksmithID:
 *        type: string
 *        example: 'BCZD_VxfO2S9aziIL3cn_cXW7uPDVPOrnXuP98GEAUC7'
 *      PopChange:
 *        type: string
 *        example: '-20'
 *      PayloadLength:
 *        type: number
 *        example: 1004
 *      PayloadHash:
 *        type: string
 *        example: 'wV4hRTom9eFrB7dDCan6jGOPyIIRJdw1/2Oth+pOfGw='
 *      TotalCoinBase:
 *        type: number
 *        example: 0
 *  Transaction:
 *    properties:
 *      TransactionID:
 *        type: string
 *        example: '-6885775591523989049'
 *      Timestamp:
 *        type: string
 *        example: '2019-07-11T00:53:09.000Z'
 *      TransactionType:
 *        type: number
 *        example: 2
 *      BlockID:
 *        type: string
 *        example: '-6705850196976533509'
 *      Height:
 *        type: number
 *        example: 0
 *      Sender:
 *        type: string
 *        example: 'BCZD_VxfO2S9aziIL3cn_cXW7uPDVPOrnXuP98GEAUC7'
 *      Recipient:
 *        type: string
 *        example: 'BCZEGOb3WNx3fDOVf9ZS4EjvOIv_UeW4TVBQJ_6tHKlE'
 *      Confirmations:
 *        type: boolean
 *        example: true
 *      Fee:
 *        type: number
 *        example: 0
 *      Version:
 *        type: number
 *        example: 1
 *      TransactionHash:
 *        type: string
 *        example: 'x0ko+JTPcKAFukBQYg+DLeeZmdhpYCUWCeZ2Y8YNQAc='
 *      TransactionBodyLength:
 *        type: number
 *        example: 243
 *      TransactionBodyBytes:
 *        type: string
 *        example: 'mToyyAc9bOXMMMeRFWN9SzEtdmHbUPL0ZIaQ9iWQ1YcsAAAAQkNaRUdPYjNXTngzZkRPVmY5WlM0RWp2T0l2X1VlVzRUVkJRSl82dEhLbEUHAAAAMC4wLjAuMAAAAAAAAAAAQkNaRUdPYjNXTngzZkRPVmY5WlM0RWp2T0l2X1VlVzRUVkJRSl82dEhLbEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=='
 *      TransactionIndex:
 *        type: number
 *        example: 2
 *      Signature:
 *        type: string
 *        example: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
 */
