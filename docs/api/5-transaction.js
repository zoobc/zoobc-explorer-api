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
 *            type: integer
 *            example: 4665691722858518568
 *          description: Single transaction by `TransactionID`.
 *      summary: Single transaction by ID
 *      description: Get single transaction response with query parameters _TransactionID_.
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
 *  Transaction:
 *    properties:
 *      ID:
 *        type: string
 *        example: '4704416403202874266'
 *      BlockID:
 *        type: string
 *        example: '4545420970999433273'
 *      Version:
 *        type: number
 *        example: '1'
 *      Height:
 *        type: number
 *        example: 10
 *      SenderAccountAddress:
 *        type: string
 *        example: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
 *      RecipientAccountAddress:
 *        type: string
 *        example: 'f3831afb0cfbaca8e9fca6523d0b23d14aa2e6f9ac1726f12c30acd4d622bb0a'
 *      TransactionType:
 *        type: number
 *        example: '1'
 *      Fee:
 *        type: number
 *        example: '0'
 *      Timestamp:
 *        type: number
 *        example: '20-Sep-2019 03:31:19'
 *      TransactionHash:
 *        type: string
 *        example: '670cf4093aca3170801b6605ab236dbe3c96f62ec78086b2b9ab96b363e8335b'
 *      TransactionBodyLength:
 *        type: number
 *        example: 1
 *      TransactionBodyBytes:
 *        type: string
 *        example: '3bfb90330d7e7fd439ec4afaa6ba6808e790276d83ab10196262a374dd7d6cd8'
 *      TransactionIndex:
 *        type: number
 *        example: '1'
 *      Signature:
 *        type: string
 *        example: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
 */
