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

require('dotenv').config()

module.exports = {
  app: {
    port: process.env.PORT,
    host: process.env.HOST || 'localhost',
    tokenSecret: process.env.TOKEN_SECRET || '884d31c5d4766dc624e1225888babeb7',
    tokenExpired: 12 /** hours */,
    mainRoute: '/zoobc/api/v1',
    redisExpired: 60 /** seconds */,
    openSslKeyPath: process.env.SSL_KEYPATH || null,
    openSslCertPath: process.env.SSL_CERTPATH || null,
    loggerFilePath: './logs/access.log',
    rateLimitSuspendTime: 5,
    rateLimitMaxHitPerIP: 500,
    pageLimit: 10,
    rootPassword: process.env.ROOT_PASSWORD || '1234567890',
    useCluster: process.env.USE_CLUSTER || 'true',
  },
  db: {
    port: process.env.DB_PORT || 27017,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  redis: {
    port: process.env.RD_PORT || 6379,
    host: process.env.RD_HOST,
    password: process.env.RD_PASSWORD,
  },
  token: {
    audience: 'zoobc-service.user',
    issuer: 'zoobc-service.id-backend',
    subject: 'zoobc-service-access-token',
  },
  graphql_client: {
    id: process.env.GRAPHQL_CLIENT_ID || '1234567890',
    secret: process.env.GRAPHQL_CLIENT_SECRET || 'client-secret-key',
    useSignatureHeader: process.env.USE_SIGNATURE_HEADER || 'true',
  },
}
