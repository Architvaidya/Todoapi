var express = require('express');
var app = new express();
var PORT = process.env.PORT || 3000;

app.get('/', function(req, res){
	
	res.send('Todo app');
});

app.listen(PORT, function(){
	console.log('Server started on port: '+PORT);
});