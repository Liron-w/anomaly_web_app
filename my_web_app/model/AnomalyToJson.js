
function AnomalyToJson(reports) {

    let my_map = new Map()
    for(var j=0; j<reports.length; j++){
        var row = "description: " + reports[j].description + " , time step:" + reports[j].timeStep
        my_map[j.toString()] = row
    }

   // create json file
   var my_json = {}
   for(var k =0; k<reports.length; k++){
       my_json[k.toString()] = my_map[k.toString()]
   }
   let json = JSON.stringify(my_json); //JSON
    //fs.writeFileSync('anomaly.json', json);
   return json
}
module.exports.AnomalyToJson = AnomalyToJson
