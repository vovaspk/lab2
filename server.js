var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/mytasks', ['tasks']);
var ObjectId = mongojs.ObjectId;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//bodyParser Midlleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static path

app.use(express.static(path.join(__dirname, 'public')));



app.get('/', function(req,res){
db.tasks.find(function(err,docs){
console.log(docs);
	res.render('index', {
		title: 'tasks',
		tasks: docs
		});
	});
	
});


app.post('/tasks/add/', function(req,res){
var newTask = {
		id: req.body.id,
		name: req.body.name,
		status: req.body.status

	}

	db.tasks.insert(newTask, function(err,result){
			if(err){
				console.log(err);
			}
			res.redirect('/');
	});
});


app.post('/tasks/update', function(req,res, next){
	var newTask = {
		name: req.body.name,
		status: req.body.status
	}
	const id = ObjectId(req.body.id.trim());
	db.tasks.update({_id: id}, newTask, function(err,result){
			if(err){
				console.log(err);
			}
			res.redirect('/');
	});
});


app.get('/tasks/delete/:id', function(req,res){
	db.tasks.remove({"_id": ObjectId(req.params.id)},function(err, result){
		if(err){
			console.log(err);
		}
		res.redirect('/');
	});

});






app.listen(3000, function(){
console.log('Server started on port 3000...');
});






