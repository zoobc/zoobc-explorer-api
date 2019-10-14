/**
 * @swagger
 * tags:
 *  - name: Nodes
 *    description: Rest API of single Node by __NodeID__ param.
 * paths:
 *  /nodes/{nodeID}:
 *    get:
 *      tags:
 *        - Nodes
 *      parameters:
 *        - in: path
 *          name: nodeID
 *          schema:
 *            type: string
 *            example: '0'
 *          description: Single node by `NodeID`.
 *      summary: Single node by NodeID
 *      description: Get single node response with query parameters _NodeID_.
 *      responses:
 *        200 - OK:
 *          description: Everything worked as expected.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/PageNode'
 *        500 - Internal Server Error:
 *          description: Something went wrong on Nodes server.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/SendInternalServerError'
 * definitions:
 *  PageNode:
 *    properties:
 *      data:
 *        type: object
 *        $ref: '#/definitions/Node'
 *  Node:
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
