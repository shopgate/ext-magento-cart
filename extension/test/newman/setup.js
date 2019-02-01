const fs = require('fs')
const path = require('path')

if (!process.argv[2] || !process.argv[3]) {
  console.error('Usage: setupNewman your.email@mail.com your-password')
  process.exit(1)
}

const envTemplate = JSON.parse(fs.readFileSync(path.join(__dirname, 'environment.json.template')))

envTemplate.values = envTemplate.values.map(value => {
  const newValue = Object.assign({}, value)
  if (newValue.key === 'username') newValue.value = process.argv[2]
  if (newValue.key === 'password') newValue.value = process.argv[3]

  return newValue
})

fs.writeFileSync(path.join(__dirname, 'environment.json'), JSON.stringify(envTemplate, null, 2))
console.log('done')
