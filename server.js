var express = require('express');
var bodyParser = require('body-parser');
var _= require('underscore');

var app = express();
var PORT = process.env.PORT || 8080;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());
app.get('/',function(req,res){
	res.send("To do AIP Root!");
});

// GET '/todos'
app.get('/todos',function(req,res){
	res.json(todos);
});
// GET '/todos/id'
app.get('/todos/:id',function(req,res){
	var todoId = parseInt(req.params.id,10);
	var matchItem = _.findWhere(todos,{id: todoId});
	if(matchItem){
		res.json(matchItem);
	}else{
		res.status(404).send();
	}
});
//POST
app.post('/todos',function(req,res){
	var body = req.body;
	if (! _.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length ==0) {
		return res.status(400).send();
	};
	body.id = todoNextId++;
	todos.push(body);
	res.json(body);
});
app.listen(PORT,function(){
	console.log("API is serving....");
});
