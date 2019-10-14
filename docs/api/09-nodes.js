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
