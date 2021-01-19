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

const childProcess = require('child_process')
const spawn = childProcess.spawn
const exec = childProcess.exec

module.exports = (pid, signal, callback) => {
  var tree = {}
  var pidsToProcess = {}
  tree[pid] = []
  pidsToProcess[pid] = 1

  if (typeof signal === 'function' && callback === undefined) {
    callback = signal
    signal = undefined
  }

  switch (process.platform) {
    case 'win32':
      exec('taskkill /pid ' + pid + ' /T /F', callback)
      break
    case 'darwin':
      buildProcessTree(
        pid,
        tree,
        pidsToProcess,
        function (parentPid) {
          return spawn('pgrep', ['-P', parentPid])
        },
        function () {
          killAll(tree, signal, callback)
        }
      )
      break
    // case 'sunos':
    //     buildProcessTreeSunOS(pid, tree, pidsToProcess, function () {
    //         killAll(tree, signal, callback);
    //     });
    //     break;
    default:
      // Linux
      buildProcessTree(
        pid,
        tree,
        pidsToProcess,
        function (parentPid) {
          return spawn('ps', ['-o', 'pid', '--no-headers', '--ppid', parentPid])
        },
        function () {
          killAll(tree, signal, callback)
        }
      )
      break
  }
}

function killAll(tree, signal, callback) {
  var killed = {}
  try {
    Object.keys(tree).forEach(function (pid) {
      tree[pid].forEach(function (pidpid) {
        if (!killed[pidpid]) {
          killPid(pidpid, signal)
          killed[pidpid] = 1
        }
      })
      if (!killed[pid]) {
        killPid(pid, signal)
        killed[pid] = 1
      }
    })
  } catch (err) {
    if (callback) {
      return callback(err)
    } else {
      throw err
    }
  }
  if (callback) {
    return callback()
  }
}

function killPid(pid, signal) {
  try {
    process.kill(parseInt(pid, 10), signal)
  } catch (err) {
    if (err.code !== 'ESRCH') throw err
  }
}

function buildProcessTree(parentPid, tree, pidsToProcess, spawnChildProcessesList, cb) {
  var ps = spawnChildProcessesList(parentPid)
  var allData = ''
  ps.stdout.on('data', function (data) {
    var temp = data.toString('ascii')
    allData += temp
  })

  var onClose = function (code) {
    delete pidsToProcess[parentPid]

    if (code != 0) {
      // no more parent processes
      if (Object.keys(pidsToProcess).length == 0) {
        cb()
      }
      return
    }

    allData.match(/\d+/g).forEach(function (pid) {
      pid = parseInt(pid, 10)
      tree[parentPid].push(pid)
      tree[pid] = []
      pidsToProcess[pid] = 1
      buildProcessTree(pid, tree, pidsToProcess, spawnChildProcessesList, cb)
    })
  }

  ps.on('close', onClose)
}
