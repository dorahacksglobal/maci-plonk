const fs = require('fs')

const inputFile = process.argv[2]
if (!inputFile) {
  console.log('no input proof is specified')
  process.exit(1)
}

if (!/\.json$/.test(inputFile)) {
  console.log('invalid verification_key format, expected *.json')
  process.exit(1)
}

try {
  const rawdata = fs.readFileSync(inputFile)
  const data = JSON.parse(rawdata)

  const output = []

  output.push(
    [
      data.A.slice(0, 2),
      data.B.slice(0, 2),
      data.C.slice(0, 2),
    ]
  )
  
  output.push(data.Z.slice(0, 2))

  output.push(
    [
      data.T1.slice(0, 2),
      data.T2.slice(0, 2),
      data.T3.slice(0, 2),
    ]
  )

  output.push(
    [
      [data.eval_a],
      [data.eval_b],
      [data.eval_c],
    ]
  )

  output.push([data.eval_zw])

  output.push(['0x3ec3131c48683a5c59a0ac01993c856e3ad8459e205d9b423dfa9b5a8a0da82'])

  output.push([data.eval_r])

  output.push(
    [
      [data.eval_s1],
      [data.eval_s2],
    ]
  )

  output.push(data.Wxi.slice(0, 2))
  output.push(data.Wxiw.slice(0, 2))

  console.log(JSON.stringify(output))
} catch (e) {
  console.log(e.message || e)
  process.exit(1)
}
