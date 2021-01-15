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

function splitArgObjects(args) {
  const newArgs = []
  let index = 0

  while (index < args.length) {
    const arg = args[index]

    if (arg.indexOf('{') !== -1) {
      const temp = []

      while (args[index].indexOf('}') === -1) {
        temp.push(args[index])
        index++
      }
      temp.push(args[index])

      newArgs.push(temp.join(' ').replace(/([\w\d-]+):\s*([\w\d-]*)/g, '"$1": "$2"'))
    } else {
      newArgs.push(arg)
    }

    index++
  }

  return newArgs
}

const parse = function parse(args = []) {
  if (!args.length) {
    args = process.argv.slice(2)
  }

  if (args[0] && args[0].match(/node$/)) {
    args = args.slice(2)
  }

  const newArgs = splitArgObjects(args)
  function parseArgs(args, obj) {
    // Check if end reached
    if (!args.length) {
      return obj
    }

    const arg = args[0]

    // if statement match conditions:
    // 1. --key=value || -key=value
    // 2. --no-key
    // 3. --key value|nothing
    // else add to unknown arr
    if (/^(--|-).+=/.test(arg)) {
      const match = arg.match(/^(--|-)([^=]+)=([\s\S]*)$/)
      // Set key(match[2]) = value(match[3])
      obj[match[2]] = match[3]
    } else if (/^--no-.+/.test(arg)) {
      // Set key = true
      obj[arg.match(/^--no-(.+)/)[1]] = false
    } else if (/^(--|-).+/.test(arg)) {
      const key = arg.match(/^(--|-)(.+)/)[2]
      const next = args[1]

      // If next value exist and not prefixed with - or --
      if (next && !/^(-|--)/.test(next)) {
        obj[key] = next
        return parseArgs(args.slice(2), obj)
      } else {
        obj[key] = true
      }
    } else {
      obj.unknown.push(arg)
    }

    return parseArgs(args.slice(1), obj)
  }

  const parseResult = parseArgs(newArgs, { unknown: [] })

  // Covert to proper type
  for (let prop in parseResult) {
    try {
      parseResult[prop] = JSON.parse(parseResult[prop])
    } catch (e) {
      continue
    }
  }

  return parseResult
}

module.exports = parse
