const fs = require("fs");

//create json from csv
function csvJSON(csv, type){
    var lines = csv.split('\n')
    var feature = lines[0].split(',')
    feature[feature.length - 1] = feature[feature.length - 1].replace('\r','') // remove '/r'
    var my_map = []
    
    //create the key on the map
    for(var t =0; t<feature.length; t++){
        my_map[feature[t]] = []
    }
    //create the map key and valu
    for(var i = 1; i<lines.length-1; i++){
         var row = lines[i].split(',')
         row[row.length - 1] = row[row.length - 1].replace('\r','') // remove '/r'
         for(var j=0; j<feature.length; j++){
            my_map[feature[j]].push(row[j])  
         }
    }
    // create json file
    var my_json = {}
    for(var k =0; k<feature.length; k++){
        my_json[feature[k]] = my_map[feature[k]]
    }
    let json = JSON.stringify(my_json); //JSON
    if (type == 'train'){
        fs.writeFileSync('train.json', json);
    }
    if (type == 'test'){
        fs.writeFileSync('test.json', json);

    }
    return json
}

module.exports.csvJSON = csvJSON
