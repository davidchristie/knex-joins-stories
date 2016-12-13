const readline = require('readline');

const server = require('./server')

const PORT = 3000

server.listen(PORT, function () {
  console.log('CLEANING UP ALL OF THE THINGS THAT WE FIND... ON PORT', PORT)

  startREPL()
})

var knex = server.knex

function startREPL () {

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question('admin: ', input => {

    const parts = input.split(' ')
    const command = parts[0]

    switch (command) {
      case 'addcostume':
        const costume = parts[1]
        knex('characteristics').insert({description: costume})
          .then(data => {
            // console.log('How about now???!')
          })
        break
      default:
        console.log('Does not compute:', input)
    }

    rl.close()
    startREPL()
  })
}
