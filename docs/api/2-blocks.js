/**
 * @swagger
 * tags:
 *  - name: Blocks
 *    description: Rest API of Blocks.
 * paths:
 *  /blocks:
 *    get:
 *      tags:
 *        - Blocks
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
 *          description: Total of blocks showed per page.
 *        - in: query
 *          name: order
 *          schema:
 *            type: string
 *            example: "Height"
 *          description: Order blocks field by asc "Height" or desc "-Height".
 *      summary: List of blocks
 *      description: Get blocks response with query parameters 'page', 'limit', and 'order'
 *      responses:
 *        200 - OK:
 *          description: Everything worked as expected.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/PageBlocks'
 *        500 - Internal Server Error:
 *          description: Something went wrong on Blocks server.
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
 *        example: '4704416403202874266'
 *      PreviousBlockHash:
 *        type: string
 *        example: '3bfb90330d7e7fd439ec4afaa6ba6808e790276d83ab10196262a374dd7d6cd8'
 *      Height:
 *        type: Number
 *        example: 10
 *      Timestamp:
 *        type: string
 *        example: '20-Sep-2019 03:31:19'
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
 *        example: 0
 *      PayloadLength:
 *        type: Number
 *        example: 0
 *      PayloadHash:
 *        type: string
 *        example: '758fe235ef9986dd50394e88ac84e67e371b45cdc6f1b0c769d4c59add22be0e'
 */
