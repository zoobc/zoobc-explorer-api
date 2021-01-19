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
 *  - name: Nodes
 *    description: Rest API of Nodes.
 * paths:
 *  /nodes:
 *    get:
 *      tags:
 *        - Nodes
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
 *          description: Total of nodes showed per page.
 *        - in: query
 *          name: order
 *          schema:
 *            type: string
 *            example: "Height"
 *          description: Order nodes field by asc `Height` or desc `-Height`.
 *        - in: query
 *          name: fields
 *          schema:
 *            type: string
 *            example: "NodeID NodePublicKey OwnerAddress NodeAddress"
 *          description: Select which nodes field to get.
 *      summary: List of nodes
 *      description: Get nodes response with query parameters _page_, _limit_, and _order_.
 *      responses:
 *        200 - OK:
 *          description: Everything worked as expected.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/PageNodes'
 *        500 - Internal Server Error:
 *          description: Something went wrong on Nodes server.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/SendInternalServerError'
 * definitions:
 *  PageNodes:
 *    properties:
 *      data:
 *        type: array
 *        items:
 *          $ref: '#/definitions/Nodes'
 *  Nodes:
 *    properties:
 *      NodePublicKey:
 *        type: string
 *        example: 'mToyyAc9bOXMMMeRFWN9SzEtdmHbUPL0ZIaQ9iWQ1Yc='
 *      OwnerAddress:
 *        type: string
 *        example: 'BCZEGOb3WNx3fDOVf9ZS4EjvOIv_UeW4TVBQJ_6tHKlE'
 *      NodeAddress:
 *        type: string
 *        example: '0.0.0.0'
 *      LockedFunds:
 *        type: string
 *        example: '0'
 *      RegisteredBlockHeight:
 *        type: number
 *        example: 0
 *      ParticipationScore:
 *        type: number
 *        example: 0
 *      RegistryStatus:
 *        type: boolean
 *        example: false
 *      BlocksFunds:
 *        type: number
 *        example: 0
 *      RewardsPaid:
 *        type: number
 *        example: 0
 *      Latest:
 *        type: boolean
 *        example: true
 *      Height:
 *        type: number
 *        example: 0
 *      NodeID:
 *        type: string
 *        example: '0'
 */
