var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: true
	}
});

sequelize.sync({
	/*force: true*/
}).then(function() {
	console.log('Everything is synced!');
	Todo.findById(3).then(function(todo){
		if(todo){
			console.log(todo.toJSON());
		}else{
			console.log('Todo Not Found');
		}
	});
	/*Todo.create({
		description: "Test Item"
	}).then(function(todo) {
		return Todo.create({
			description: 'New Item'
		});
	}).then(function() {
		//return Todo.findById(1);
		return Todo.findAll({
			where: {
				completed: true,
				description:{
					$like: '%Test%'	
				}
			
			}
		});
	}).then(function(todos) {
		if (todos) {
			todos.forEach(function(todo) {
				console.log(todo.toJSON());
			});

		} else {
			console.log('No Item Found');
		}
	}).catch(function(e) {
		console.log(e);
	});*/
});