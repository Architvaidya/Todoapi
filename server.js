var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;
var _ = require('underscore');

app.use(bodyParser.json());

app.post('/todos', function (req, res) {

	var body = req.body;
	body = _.pick(body, 'completed', 'description');
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){

		res.status(400).send();
	}
	body.description = body.description.trim();
	body.id = todoNextId++;
	todos.push(body);
	res.json(todos);
});

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function (req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;
	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
		//console.log('true');
		filteredTodos = _.where(filteredTodos, {completed: true});
		
	}else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
		//console.log('false');
		filteredTodos = _.where(filteredTodos, {completed: false});
	}else{
		res.status(404).send();
	}

	res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id:todoId});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
});

app.delete('/todos/:id', function(req, res){
	var toddoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id:toddoId});
	if(matchedTodo){
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);


	}else{
		res.status(404).json({error: 'The requested id not found'});
	}
});

app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchedTodo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});


app.listen(PORT, function () {
	console.log('Server started on ' + PORT + '!');
});