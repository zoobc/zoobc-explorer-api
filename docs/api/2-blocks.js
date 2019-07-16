/**
 * @swagger
 * tags:
 *  - name: Blocks
 *    description: Rest API Block.
 * paths:
 *  /blocks:
 *    get:
 *      tags:
 *        - Blocks
 *      parameters:
 *        - in: query
 *          name: ChainType
 *          schema:
 *            type: integer
 *            example: 1
 *          description: Number indicating chaintype
 *        - in: query
 *          name: Limit
 *          schema:
 *            type: integer
 *            example: 5
 *          description: Number of block to fetch
 *        - in: query
 *          name: Height
 *          schema:
 *            type: integer
 *            example: 1
 *          description: Fetch block from `n` height
 *      summary: Get Blocks
 *      description: Get list block.
 *      responses:
 *        200:
 *          description: response status
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/PageBlocks'
 *        500:
 *          description: response status
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/SendInternalServerError'
 * definitions:
 *  PageBlocks:
 *    properties:
 *      data:
 *        type: array
 *        items:
 *          $ref: '#/definitions/Blocks'
 *  Blocks:
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
 */
