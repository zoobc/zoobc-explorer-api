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
 *          description: Order blocks field by asc `Height` or desc `-Height`.
 *        - in: query
 *          name: fields
 *          schema:
 *            type: string
 *            example: "BlockID Height Timestamp"
 *          description: Select which blocks field to get.
 *      summary: List of blocks
 *      description: Get blocks response with query parameters _page_, _limit_, and _order_.
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
 */
