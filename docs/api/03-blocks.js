/** 
 * ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
 * This file is part of ZooBC <https://github.com/zoobc/zoobc-explorer-api>

 * ZooBC is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * ZooBC is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with ZooBC.  If not, see <http://www.gnu.org/licenses/>.

 * Additional Permission Under GNU GPL Version 3 section 7.
 * As the special exception permitted under Section 7b, c and e, 
 * in respect with the Author’s copyright, please refer to this section:

 * 1. You are free to convey this Program according to GNU GPL Version 3,
 *     as long as you respect and comply with the Author’s copyright by 
 *     showing in its user interface an Appropriate Notice that the derivate 
 *     program and its source code are “powered by ZooBC”. 
 *     This is an acknowledgement for the copyright holder, ZooBC, 
 *     as the implementation of appreciation of the exclusive right of the
 *     creator and to avoid any circumvention on the rights under trademark
 *     law for use of some trade names, trademarks, or service marks.

 * 2. Complying to the GNU GPL Version 3, you may distribute 
 *     the program without any permission from the Author. 
 *     However a prior notification to the authors will be appreciated.

 * ZooBC is architected by Roberto Capodieci & Barton Johnston
 * contact us at roberto.capodieci[at]blockchainzoo.com
 * and barton.johnston[at]blockchainzoo.com

 * IMPORTANT: The above copyright notice and this permission notice
 * shall be included in all copies or substantial portions of the Software.
**/

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
