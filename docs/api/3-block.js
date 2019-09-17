/**
 * @swagger
 * tags:
 *  - name: Blocks
 *    description: Rest API of single Block by __BlockID__ param.
 * paths:
 *  /blocks/{id}:
 *    get:
 *      tags:
 *        - Blocks
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *            example: 4704416403202874266
 *          description: Single block by `BlockID`.
 *      summary: Single block by ID
 *      description: Get single block response with query parameters _BlockID_.
 *      responses:
 *        200 - OK:
 *          description: Everything worked as expected.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/PageBlock'
 *        500 - Internal Server Error:
 *          description: Something went wrong on Blocks server.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/SendInternalServerError'
 * definitions:
 *  PageBlock:
 *    properties:
 *      data:
 *        type: object
 *        $ref: '#/definitions/Block'
 *  Block:
 *    properties:
 *      ID:
 *        type: string
 *        example: '4704416403202874266'
 *      PreviousBlockHash:
 *        type: string
 *        example: '3bfb90330d7e7fd439ec4afaa6ba6808e790276d83ab10196262a374dd7d6cd8'
 *      Height:
 *        type: number
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
 *        type: number
 *        example: 0
 *      PayloadLength:
 *        type: number
 *        example: 0
 *      PayloadHash:
 *        type: string
 *        example: '758fe235ef9986dd50394e88ac84e67e371b45cdc6f1b0c769d4c59add22be0e'
 */
