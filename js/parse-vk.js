const fs = require('fs')

const inputFile = process.argv[2]
if (!inputFile) {
  console.log('no input verification_key is specified')
  process.exit(1)
}

if (!/\.json$/.test(inputFile)) {
  console.log('invalid verification_key format, expected *.json')
  process.exit(1)
}

function g1(g1) {
  return [
    g1[0],
    g1[0] === '0' ? '0' : g1[1] 
  ]
}

try {
  const rawdata = fs.readFileSync(inputFile)
  const data = JSON.parse(rawdata)

  const output = [
    data.power,

    ...g1(data.Qm),
    ...g1(data.Ql),
    ...g1(data.Qr),
    ...g1(data.Qo),
    ...g1(data.Qc),

    ...g1(data.S1),
    ...g1(data.S2),
    ...g1(data.S3),

    data.X_2[0][0],
    data.X_2[0][1],
    data.X_2[1][0],
    data.X_2[1][1],

    data.w
  ]

  // // domain_size
  // output.push(2 ** data.power)

  // // num_inputs
  // output.push(1)

  // // omega
  // output.push([data.w])

  // // selector_commitments
  // output.push(
  //   [
  //     data.Ql.slice(0, 2),
  //     data.Qr.slice(0, 2),
  //     data.Qo.slice(0, 2),
  //     data.Qm.slice(0, 2),
  //     data.Qc.slice(0, 2),
  //   ]
  // )

  // // permutation_commitments
  // output.push([
  //   data.S1.slice(0, 2),
  //   data.S2.slice(0, 2),
  //   data.S3.slice(0, 2),
  // ])

  // // permutation_non_residues
  // output.push([
  //   [data.k1],
  //   [data.k2],
  // ])

  // // g2_x
  // output.push(data.X_2.slice(0, 2).map(a => a.reverse()))

  // console.log(JSON.stringify(output))

  console.log(output.map((n) => BigInt(n).toString(16).padStart(64, '0')).join(''))
} catch (e) {
  console.log(e.message || e)
  process.exit(1)
}
