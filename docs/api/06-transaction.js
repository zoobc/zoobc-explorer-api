/**
 * @swagger
 * tags:
 *  - name: Transactions
 *    description: Rest API of single Transaction by __TransactionID__ param.
 * paths:
 *  /transactions/{id}:
 *    get:
 *      tags:
 *        - Transactions
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *            example: '-6885775591523989049'
 *          description: Single transaction by `TransactionID`.
 *      summary: Single transaction by ID
 *      description: Get single transaction response with query parameters _TransactionID_.
 *      responses:
 *        200 - OK:
 *          description: Everything worked as expected.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/PageTransaction'
 *        500 - Internal Server Error:
 *          description: Something went wrong on Transactions server.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/SendInternalServerError'
 * definitions:
 *  PageTransaction:
 *    properties:
 *      data:
 *        type: object
 *        $ref: '#/definitions/Transaction'
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
