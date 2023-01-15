const fs = require('fs')
const path = require('path')
const Web3 = require('web3')
const { stringizing } = require('./keypair')

// * DEV *
// ETHDencer test
const contract = '0xd900Bb9Ba8ec19d28Cdab322dCcE0B785f734D4c'
const fromBlock = 8303095
const endBlock = 	8303157
const provider = 'https://goerli.infura.io/v3/1d0842dba8df4b07a2a02ab24c44e6be'

const sleep = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

const PublishMessageSign = '0x8bb5a8cf78a5b2f53c73e2feacb1fb3e91c3f03cb15e33f53174db20e37e3928'
const SignUpSign = '0xc7563c66f89e2fb0839e2b64ed54fe4803ff9428777814772ccfe4c385072c4b'

;(async () => {
  const web3 = new Web3(provider)

  const messages = []
  const states = []

  function handleMessage(log) {
    const idx = Number(log.topics[1])
    const d = web3.eth.abi.decodeParameters(['uint256[9]'], log.data)[0]
    const msg = d.slice(0, 7).map(n => BigInt(n))
    const pubkey = d.slice(7, 9).map(n => BigInt(n))
    messages.push({ idx, msg, pubkey })
  }

  function handleSignup(log) {
    const idx = Number(log.topics[1])
    const d = web3.eth.abi.decodeParameters(['uint256[3]'], log.data)[0]
    const pubkey = d.slice(0, 2).map(n => BigInt(n))
    const balance = BigInt(d[2])
    states.push({ idx, balance, pubkey })
  }

  const number = await web3.eth.getBlockNumber()
  console.log(number)

  for (let i = fromBlock; i < endBlock; i += 2000) {
    const from = i
    const to = i + 1999
    await web3.eth
      .getPastLogs({
        fromBlock: from,
        toBlock: to,
        topics: [
          [PublishMessageSign, SignUpSign],
        ],
        address: contract,
      })
      .then((logs) => {
        for (const log of logs) {
          if (log.topics[0] === PublishMessageSign) {
            handleMessage(log)
          } else {
            handleSignup(log)
          }
        }
        console.log(logs.length)
      })
      .catch((err) => {
        console.error(err.message || err)
      })
    console.log(`Processed: from height ${from}, to height ${to}.`)
    await sleep(1000)
  }

  fs.writeFileSync(
    path.join(__dirname, '../build/contract-logs.json'),
    JSON.stringify(
      stringizing({ messages, states }),
      undefined,
      2
    )
  )
})()