var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 8080;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());
app.get('/', function(req, res) {
	res.send("To do AIP Root!");
});

//*************************************** GET /todos?completed=false // completed***********************
app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}
	db.todo.findAll({
		where: where
	}).then(function(todo) {
		res.json(todo);
	}, function(e) {
		res.status(500).json(e);
	});

});

//********************************************** GET '/todos' // completed ************************************
app.get('/todos', function(req, res) {
	db.todo.findAll();
	res.json(todos);
});
//********************************************** GET '/todos/id' // completed ********************************
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	db.todo.findById(todoId).then(function(todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).json({
				"error": "no match item"
			});
		}

	}, function(e) {
		res.status(500).send();
	});
});
//********************************************* POST request body //completed *********************************
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function(e) {
		res.status(400).json(e);
	});

});
//DELETE
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	db.todo.destroy({
			where: {
				id: todoId
			}
		}).then(function(rowAffect) {
			if (rowAffect === 0) {
				res.status(404).json({
					error: 'No todoId'
				});
			} else {
				res.status(200).send();
			}
		}),
		function() {
			res.status(500).send();
		};
});

app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var attribute = {};

	if (body.hasOwnProperty('completed')) {
		attribute.completed = body.completed;
	}
	if (body.hasOwnProperty('description')) {
		attribute.description = body.description;
	}

	db.todo.findById(todoId).then(function(todo) {
		if (todo) {
			return todo.update(attribute);
		} else {
			res.status(404).json({
				error: 'No todoId'
			});
		}
	}, function() {
		res.status(500).send();
	}).then(function(todo) {
		res.json(todo.toJSON());
	}, function(e) {
		res.status(404).send();
	});
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("API is serving....");
	});
});