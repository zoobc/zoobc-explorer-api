/**
 * @swagger
 * tags:
 *  - name: Transactions
 *    description: Rest API Block.
 * paths:
 *  /transactions:
 *    get:
 *      tags:
 *        - Transactions
 *      parameters:
 *        - in: query
 *          name: Limit
 *          schema:
 *            type: integer
 *            example: 5
 *          description: Number of block to fetch
 *        - in: query
 *          name: Offset
 *          schema:
 *            type: integer
 *            example: 1
 *          description: Fetch block from `n` height
 *      summary: Get Transactions
 *      description: Get list block.
 *      responses:
 *        200:
 *          description: response status
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/PageTransactions'
 *        500:
 *          description: response status
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
 *        type: array
 *        items: []
 *      TransactionBodyLength:
 *        type: Number
 *        example: 1
 *      TransactionBodyBytes:
 *        type: Objects
 *        example: 0
 *      Signature:
 *        type: Objects
 *        example: ''
 *      Transactions:
 *        type: array
 *        items: []
 *      Total:
 *        type: string
 *        example: ''
 */
