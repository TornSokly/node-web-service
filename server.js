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
	var body = _.pick(req.body,'description','completed');

	if (! _.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length ==0) {
		return res.status(400).send();
	};
	body.description = body.description.trim();
	body.id = todoNextId++;
	todos.push(body);
	res.json(body);
});
//DELETE
app.delete('/todos/:id',function(req,res){
	var todoId = parseInt(req.params.id,10);
	var matchItem = _.findWhere(todos,{id:todoId});
	if(!matchItem){
		res.status(404).json({"error":"no match item"});
	}else{
		todos = _.without(todos,matchItem);
		res.json(matchItem);
	}
});
app.put('/todos/:id',function(req,res){
	var todoId = parseInt(req.params.id,10);
	var matchItem = _.findWhere(todos,{id:todoId});
	var body = _.pick(req.body,'description','completed');
	var validAttribute = {};

	if(!matchItem){
		return res.status(404).send();
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttribute.completed = body.completed;
	}else if(body.hasOwnProperty('completed')){
		return res.status(400).send();
	}
	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length != 0){
		validAttribute.description = body.description;
	}else if(body.hasOwnProperty('description')){
		return res.status(400).send();
	}
	_.extend(matchItem,validAttribute);
	res.json(matchItem);

});
app.listen(PORT,function(){
	console.log("API is serving....");
});

