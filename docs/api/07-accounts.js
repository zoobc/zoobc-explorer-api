/**
 * @swagger
 * tags:
 *  - name: Accounts
 *    description: Rest API of Accounts.
 * paths:
 *  /accounts:
 *    get:
 *      tags:
 *        - Accounts
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
 *          description: Total of accounts showed per page.
 *        - in: query
 *          name: order
 *          schema:
 *            type: string
 *            example: "AccountAddress"
 *          description: Order accounts field by asc `AccountAddress` or desc `-AccountAddress`.
 *        - in: query
 *          name: fields
 *          schema:
 *            type: string
 *            example: "AccountAddress Balance SpendableBalance"
 *          description: Select which accounts field to get.
 *      summary: List of accounts
 *      description: Get accounts response with query parameters _page_, _limit_, and _order_.
 *      responses:
 *        200 - OK:
 *          description: Everything worked as expected.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/PageAccounts'
 *        500 - Internal Server Error:
 *          description: Something went wrong on Accounts server.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/SendInternalServerError'
 * definitions:
 *  PageAccounts:
 *    properties:
 *      data:
 *        type: array
 *        items:
 *          $ref: '#/definitions/Accounts'
 *  Accounts:
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
