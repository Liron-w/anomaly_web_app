function showAnomalies(detected) {
    let result = ''
    var jsonObject = JSON.parse(detected)
    Object.keys(jsonObject).forEach(key => { 
        result+=key+" : " + jsonObject[key] + "\n" //values 
    })
    return result
}
//export file to module
module.exports.showAnomalies = showAnomalies