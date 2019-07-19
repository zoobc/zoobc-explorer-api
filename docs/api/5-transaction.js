/**
 * @swagger
 * tags:
 *  - name: Transaction
 *    description: Rest API Transaction.
 * paths:
 *  /transaction:
 *    get:
 *      tags:
 *        - Transaction
 *      parameters:
 *        - in: query
 *          name: ID
 *          schema:
 *            type: integer
 *            example: 23512315123
 *          description: BlockID to fetch
 *      summary: Get Transaction
 *      description: Get a transaction.
 *      responses:
 *        200:
 *          description: response status
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/PageTransaction'
 *        500:
 *          description: response status
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/SendInternalServerError'
 * definitions:
 *  PageTransaction:
 *    properties:
 *      data:
 *        type: array
 *        items:
 *          $ref: '#/definitions/Transaction'
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
