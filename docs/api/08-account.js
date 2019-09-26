/**
 * @swagger
 * tags:
 *  - name: Accounts
 *    description: Rest API of single Account by __AccountAddress__ param.
 * paths:
 *  /accounts/{accountAddress}:
 *    get:
 *      tags:
 *        - Accounts
 *      parameters:
 *        - in: path
 *          name: accountAddress
 *          schema:
 *            type: string
 *            example: 'BCZD_VxfO2S9aziIL3cn_cXW7uPDVPOrnXuP98GEAUC7'
 *          description: Single transaction by `AccountAddress`.
 *      summary: Single transaction by AccountAddress
 *      description: Get single transaction response with query parameters _AccountAddress_.
 *      responses:
 *        200 - OK:
 *          description: Everything worked as expected.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/PageAccount'
 *        500 - Internal Server Error:
 *          description: Something went wrong on Accounts server.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/SendInternalServerError'
 * definitions:
 *  PageAccount:
 *    properties:
 *      data:
 *        type: object
 *        $ref: '#/definitions/Account'
 *  Account:
 *    properties:
 *      AccountAddress:
 *        type: string
 *        example: 'BCZD_VxfO2S9aziIL3cn_cXW7uPDVPOrnXuP98GEAUC7'
 *      Balance:
 *        type: number
 *        example: -100000000000
 *      SpendableBalance:
 *        type: number
 *        example: -100000000000
 *      FirstActive:
 *        type: string
 *        example: ''
 *      LastActive:
 *        type: string
 *        example: ''
 *      TotalRewards:
 *        type: number
 *        example: 0
 *      TotalFeesPaid:
 *        type: number
 *        example: 0
 *      NodePublicKey:
 *        type: string
 *        example: ''
 */
