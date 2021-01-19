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
 *            type: string
 *            example: '-6885775591523989049'
 *          description: Single transaction by `TransactionID`.
 *      summary: Single transaction by ID
 *      description: Get single transaction response with query parameters _TransactionID_.
 *      responses:
 *        200 - OK:
 *          description: Everything worked as expected.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/PageTransaction'
 *        500 - Internal Server Error:
 *          description: Something went wrong on Transactions server.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/SendInternalServerError'
 * definitions:
 *  PageTransaction:
 *    properties:
 *      data:
 *        type: object
 *        $ref: '#/definitions/Transaction'
 *  Transaction:
 *    properties:
 *      TransactionID:
 *        type: string
 *        example: '-6885775591523989049'
 *      Timestamp:
 *        type: string
 *        example: '2019-07-11T00:53:09.000Z'
 *      TransactionType:
 *        type: number
 *        example: 2
 *      BlockID:
 *        type: string
 *        example: '-6705850196976533509'
 *      Height:
 *        type: number
 *        example: 0
 *      Sender:
 *        type: string
 *        example: 'BCZD_VxfO2S9aziIL3cn_cXW7uPDVPOrnXuP98GEAUC7'
 *      Recipient:
 *        type: string
 *        example: 'BCZEGOb3WNx3fDOVf9ZS4EjvOIv_UeW4TVBQJ_6tHKlE'
 *      Confirmations:
 *        type: boolean
 *        example: true
 *      Fee:
 *        type: number
 *        example: 0
 *      Version:
 *        type: number
 *        example: 1
 *      TransactionHash:
 *        type: string
 *        example: 'x0ko+JTPcKAFukBQYg+DLeeZmdhpYCUWCeZ2Y8YNQAc='
 *      TransactionBodyLength:
 *        type: number
 *        example: 243
 *      TransactionBodyBytes:
 *        type: string
 *        example: 'mToyyAc9bOXMMMeRFWN9SzEtdmHbUPL0ZIaQ9iWQ1YcsAAAAQkNaRUdPYjNXTngzZkRPVmY5WlM0RWp2T0l2X1VlVzRUVkJRSl82dEhLbEUHAAAAMC4wLjAuMAAAAAAAAAAAQkNaRUdPYjNXTngzZkRPVmY5WlM0RWp2T0l2X1VlVzRUVkJRSl82dEhLbEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=='
 *      TransactionIndex:
 *        type: number
 *        example: 2
 *      Signature:
 *        type: string
 *        example: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
 */
