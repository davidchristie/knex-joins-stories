var development = require('./knexfile').development
var knex = require('knex')(development)

module.exports = {
  getAssignments,
  getHome,
  getView,
  knex,
  postAdd,
  postChange,
  postDelete,
  postRubbish
}

function getAssignments (req, res) {
  knex('wombles').join('rubbish', 'wombles.rubbish_id', '=', 'rubbish.id')
    .select(
      'wombles.id',
      'wombles.name',
      'rubbish.name as rubbish'
    )
    .then(wombles => {
      console.log(wombles)
      res.render('assignments', {wombles: wombles})
    })
    .catch(error => {
      console.log(error)
      res.status(500).send("Couldn't show you the users")
    })
}

function getHome (req, res) {
  knex('wombles').select()
    .then(wombles => {
      res.render('home', {wombles: wombles})
    })
    .catch(error => {
      console.log(error)
      res.status(500).send("Couldn't show you the users")
    })
}

function getView (req, res) {
  Promise.all([
    knex('wombles').join('characteristics', 'wombles.characteristic_id', '=', 'characteristics.id')
      .select(
        'wombles.id',
        'wombles.name',
        'characteristics.description'
      )
      .where('wombles.id', req.params.id),
    knex('characteristics'),
    knex('rubbish')
  ])
  .then(values => {
    var wombles = values[0]
    var characteristics = values[1]
    var rubbish = values[2]
    var data = wombles[0]
    data.characteristics = characteristics
    data.rubbish = rubbish
    res.render('view', data)
  })
  .catch(error => {
    console.log(error)
    res.status(500).send("Couldn't show you the users")
  })
}

function postAdd (req, res) {
  // console.log(req.body)
  knex('characteristics').insert({description: req.body.characteristic})
    .then(data => {
      var characteristicId = data[0]
      knex('wombles').insert({
        name: req.body.name,
        characteristic_id: characteristicId
      })
      .then(data => {
        res.redirect('/')
      })
      .catch(error => {
        console.log(error)
        res.status(500).send("Couldn't show you the users")
      })

    })
    .catch(error => {
      console.log(error)
      res.status(500).send("Couldn't show you the users")
    })

}

function postChange (req, res) {
  var wombleId = req.params.id
  var characteristicId = req.body.characteristic
  knex('wombles').select()
    .where('id', wombleId)
    .update('characteristic_id', characteristicId)
    .then(() => {
      res.redirect(`/view/${wombleId}`)
    })
    .catch(error => {
      console.log(error)
      res.status(500).send("Couldn't show you the users")
    })
}

function postDelete (req, res) {
  knex('wombles').select()
    .where('id', req.params.id)
    .del()
    .then(data => {
      res.redirect('/')
    })
    .catch(error => {
      console.log(error)
      res.status(500).send("Couldn't show you the users")
    })
}

function postRubbish (req, res) {
  var wombleId = req.params.id
  var rubbishId = req.body.rubbish
  knex('wombles').select()
    .where('id', wombleId)
    .update('rubbish_id', rubbishId)
    .then(() => {
      res.redirect(`/view/${wombleId}`)
    })
    .catch(error => {
      console.log(error)
      res.status(500).send("Couldn't show you the users")
    })
}
