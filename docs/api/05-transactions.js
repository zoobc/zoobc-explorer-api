/**
 * @swagger
 * tags:
 *  - name: Transactions
 *    description: Rest API of Transactions.
 * paths:
 *  /transactions:
 *    get:
 *      tags:
 *        - Transactions
 *      parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            example: 1
 *          description: Number of pagination.
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *            example: 5
 *          description: Total of transactions showed per page.
 *        - in: query
 *          name: order
 *          schema:
 *            type: string
 *            example: "Height"
 *          description: Order blocks field by asc `Height` or desc `-Height`.
 *        - in: query
 *          name: fields
 *          schema:
 *            type: string
 *            example: "ID TransactionID BlockID Version Height"
 *          description: Select which transactions field to get.
 *      summary: List of transactions
 *      description: Get transactions response with query parameters _page_, _limit_, and _order_.
 *      responses:
 *        200 - OK:
 *          description: Everything worked as expected.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/PageTransactions'
 *        500 - Internal Server Error:
 *          description: Something went wrong on Transactions server.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/SendInternalServerError'
 * definitions:
 *  PageTransactions:
 *    properties:
 *      data:
 *        type: array
 *        items:
 *          $ref: '#/definitions/Transactions'
 *  Transactions:
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
