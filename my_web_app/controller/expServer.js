const express = require('express')
const fileUpload = require('express-fileupload')
const train_json = require('../controller/train.json')
const test_json = require('../controller/test.json')
const csv_json = require('../model/csvJson')
const simple = require('../model/SimpleAnomalyDetector')
const anomalies = require('../model/ShowAnomalies')
const anomalyJson = require('../model/AnomalyToJson')

const app = express()

app.use(express.urlencoded({
    extended: false
}))

app.use(fileUpload())
app.use(express.static('../view'))

app.get('/', (req, res) => {
    res.sendFile('./index.html')
})

app.post('/detectAPI', (req, res) => {
    if (req.files.train_file && req.files.test_file) {
        //crate train.json
        csvDataTrain = req.files.train_file.data.toString('utf8');
        var result1 = csv_json.csvJSON(csvDataTrain, 'train')
        //crate test.json
        csvDataTest = req.files.test_file.data.toString('utf8');
        var result2 = csv_json.csvJSON(csvDataTest, 'test')
        // checking hybrid or regression
        var bollean 
        if(req.body.algorithm == 'hybrid'){
            bollean = true
        }
        if(req.body.algorithm == 'regression'){
            bollean = false
        }
        //send to learn
        var algo = new simple(0.9, bollean)
        algo.learnNormal(train_json)
        // send to detect
        var anomaly_report = algo.detect(test_json)
        var anomaly_json = AnomalyToMap(anomaly_report)
        let table = create_table(anomaly_json)
        res.send(table);

        //let result = anomalies.showAnomalies(anomaly_json)
        //res.write(result)
    }
    res.end()
})

app.post('/detect', (req, res) => {
    if (req.files.train_file && req.files.test_file) {
        //crate train.json
        csvDataTrain = req.files.train_file.data.toString('utf8');
        var result1 = csv_json.csvJSON(csvDataTrain, 'train')
        //crate test.json
        csvDataTest = req.files.test_file.data.toString('utf8');
        var result2 = csv_json.csvJSON(csvDataTest, 'test')
        // checking hybrid or regression
        var bollean 
        if(req.body.algorithm == 'hybrid'){
            bollean = true
        }
        if(req.body.algorithm == 'regression'){
            bollean = false
        }
        //send to learn
        var algo = new simple(0.9, bollean)
        algo.learnNormal(train_json)
        // send to detect
        var anomaly_report = algo.detect(test_json)
        var anomaly_json = anomalyJson.AnomalyToJson(anomaly_report)
        let result = anomalies.showAnomalies(anomaly_json)
        res.write(result)
    }
    res.end()
})

app.listen(8080) //change
// rgb(255, 241, 194);
// body  rgb(235, 227, 227);
// iframe rgb(255, 241, 194);
// tr:hover {background-color:rgb(243, 227, 174);} \n td {background-color:rgb(253, 233, 52); color: black; font-weight: bold;} \ n h2.hidden { visibility: hidden;; }</style>"

function create_table(data){
    let text = "<h1></h1>"
    text += "<style>\n table, th, td { \n border: 1px solid black;\n border-collapse: collapse;\n } \n"
    text += "th, td { padding: 15px; \n font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;\n text-align: center; \n }\n #t01 tr:nth-child(even)  { \n  background-color: #eee; \n } \n #t01 tr:nth-child(odd) { \n background-color: #fff; \n }\n"
    text += " #t01 th { \n background-color: black; \n color: white; \n }\n tr:hover {background-color:rgb(176, 226, 226);} \n td {background-color:rgb(140, 207, 207); color: black; font-weight: bold;} \ n h2.hidden { visibility: hidden;; }</style>"
    text += "<table>" 
    text+= "<table style= \"width:100%\" >\n"
    text+= "<tr> \n <td> Feature </td> \n <td> Anomalies </td> \n </tr> \n"
    let keys = Object.keys(data)
    for(let key of keys){
        let time_step = "";
        let value = data[key];
        if(value.length>0){
            let list = value.toString().split(',')
           for(let i=0; i<list.length;i++){
               time_step += list[i]
            }
        }
        text += " <tr> \n <th>"+ key + "</th> \n <th>" + time_step+"   "  +"</th> \n </tr> \n"
    }
    return text;
}



function AnomalyToMap(reports) {

    let my_map = new Map()
    for(var j=0; j<reports.length; j++){
        var row = reports[j].timeStep
        var index = j.toString()+'. '+reports[j].description
        my_map[index] = row.toString()
    }
    return my_map
}