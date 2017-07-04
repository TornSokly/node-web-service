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

// GET /todos?completed=false
app.get('/todos', function(req, res) {
	var queryParams = req.query;
	var matchItem = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		matchItem = _.where(matchItem, {
			completed: true
		});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		matchItem = _.where(matchItem, {
			completed: false
		});
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		matchItem = _.filter(matchItem, function(todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}

	res.json(matchItem);
});

// GET '/todos'
app.get('/todos', function(req, res) {
	res.json(todos);
});
// GET '/todos/id'
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchItem = _.findWhere(todos, {
		id: todoId
	});
	if (matchItem) {
		res.json(matchItem);
	} else {
		res.status(404).send();
	}
});
//POST
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
	var matchItem = _.findWhere(todos, {
		id: todoId
	});
	if (!matchItem) {
		res.status(404).json({
			"error": "no match item"
		});
	} else {
		todos = _.without(todos, matchItem);
		res.json(matchItem);
	}
});
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchItem = _.findWhere(todos, {
		id: todoId
	});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttribute = {};

	if (!matchItem) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttribute.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}
	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length != 0) {
		validAttribute.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}
	_.extend(matchItem, validAttribute);
	res.json(matchItem);

});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("API is serving....");
	});
});