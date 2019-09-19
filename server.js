let express = require('express');
let bodyParser = require('body-parser');
let app = express();

const mongoose = require('mongoose');
const Task = require('./models/task');
const Developer = require('./models/developer');

let db;

mongoose.connect('mongodb://localhost:27017/fit2095db', {useNewUrlParser: true, useUnifiedTopology: true}, function (err) {
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    }
    console.log('Successfully connected');

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

//parse application/json
app.use(bodyParser.json());

//Setup the view Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//Setup the static assets directories
app.use(express.static('images'));
app.use(express.static('css'));

//To call the homepage
app.get('/', function (req, res) {
    res.render('index.html');
});

//GET callback method to render the html page and form to add the task
app.get('/addtask', function (req, res) {
    res.render('addtask.html');
});

app.get('/adddeveloper', function (req, res) {
    res.render('adddeveloper.html');
});

//POST method to handle POST requests from the input field
app.post('/newtask', function (req, res) {
    let taskdetails = req.body;
    taskdetails.taskstatus = "InProgress";
    let task1 = new Task({ 
        _id:  Math.round(Math.random()*100), 
        name: taskdetails.taskname, 
        assignto: taskdetails.taskassigned,
        due: taskdetails.taskdue,
        status: taskdetails.taskstatus,
        description: taskdetails.taskdescription 
    });
    task1.save(function (err) {
        if (err) throw err;
        console.log('Task successfully added to DB');
    });
    res.redirect('listtasks'); // redirect the client to list tasks page
});
 
app.post('/newdeveloper', function (req, res) {
    let developerdetails = req.body;
    let developer1 = new Developer({
        _id: Math.round(Math.random()*100), 
        developername: { 
            firstName: developerdetails.developerfirstname,
            lastName: developerdetails.developerlastname
        }, 
        level: String(developerdetails.developerlevel), 
        address: {
            
            state: developerdetails.stateaddress,
            suburb: developerdetails.suburbaddress,
            street: developerdetails.streetaddress,
            unit: developerdetails.unitaddress
        }
    });
    developer1.save(function (err) {
        if (err) throw err;
        console.log('Developer successfully added to DB');
    });
    res.redirect('listdevelopers'); // redirect the client to list developers page
});

app.get('/listtasks', function (req, res) {
    Task.find({}, function (err, data) {
        res.render('listtasks.html', { taskdb: data });
    });
});

app.get('/listdevelopers', function (req, res) {
    Developer.find({}, function (err, developerdata) {
        res.render('listdevelopers.html', { developerdb: developerdata });
    });
});

//Delete Task: 
//GET request: send the page to the client to enter the task's id
app.get('/deletetask', function (req, res) {
    res.render('deletetask.html');
});

//POST request: receive the task's id and do the delete operation 
app.post('/deletetaskdata', function (req, res) {
    let taskdetails = req.body;
    Task.deleteOne({ _id: taskdetails.taskId }, function (err, taskdb) {
        console.log(taskdb);
    });
    res.redirect('listtasks'); // redirect the client to list tasks page
});

//POST request to delete all tasks that are completed with the button
app.post('/deletealltasks', function (req, res) {
    Task.deleteMany({status: 'Completed'}, function (err, taskdb) {
        console.log(taskdb);
    });
    res.redirect('listtasks');
});

//Update Task: Two methods implemented two change the status from one status to the other and vice versa
app.get('/updatetask', function (req, res) {
    res.render('updatetask.html');
});

//POST method to change status of task from InProgress to Completed
app.post('/updatetaskdata', function (req, res) {
    let taskdetails = req.body;
    let filter = { _id: taskdetails.taskId };
    let update = { $set: { status: 'Completed' } };
    Task.updateOne(filter, update, function (err, taskdb){
        console.log(taskdb);
    });
    res.redirect('/listtasks');// redirect the client to list tasks page
});

//POST method to change status of task from Completed to InProgress
app.post('/updatecompletedtask', function (req, res) {
    let taskdetails = req.body;
    let filter = { _id: taskdetails.taskId };
    let update = { $set: { status: 'InProgress' } };
    Task.updateOne(filter, update, function (err, taskdb){
        console.log(taskdb);
    });
    res.redirect('/listtasks');// redirect the client to list tasks page
});

});

app.listen(8080);