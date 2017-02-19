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
	res.json(todos);
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


app.listen(PORT, function () {
	console.log('Server started on ' + PORT + '!');
});