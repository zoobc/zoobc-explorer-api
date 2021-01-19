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
