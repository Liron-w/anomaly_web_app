
const anomalydetection = require('./AnomalyDetection');
const point = require('./Point');
const corFeat = require('./correlatedFeatures');
const anomalyReport = require('./AnomalyReport');
const enclosingCircle = require('smallest-enclosing-circle')


var algo = new anomalydetection();


class SimpleAnomalyDetector {
  constructor(thresh, flag) {
    //this.threshold = 0.9; // delete!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    this.threshold = thresh;
    this.cf = []; 
    this.flag = flag;
    //this.flag = true;

  }

  toPoints(x, y) {
    var ps = [];
    for (let i = 0; i < x.length; i++) {
      ps[i] = new point(parseFloat(x[i]), parseFloat(y[i]));
    }
    return ps;
  }
  findThreshold(ps, rl) {
    let max = 0;
    for (let i = 0; i < ps.length; i++) {
      let y = parseFloat(ps[i].y);
      let x = rl.f(parseFloat(ps[i].x));
      let d = Math.abs(y - x);
      if (d > max)
        max = d;
    }
    return max;
  }

  dist(p1, p2) {
    let a = p1.x - p2.x;
    let b = p1.y - p2.y;

    return Math.sqrt( a*a + b*b );
  }

  learnNormal(data) {
    var attributes = Object.keys(data);
    var len = attributes.length;

    for (let i = 0; i < len; i++) {
      var f1 = attributes[i];
      let max = 0;
      let jmax = 0;
      for (let j = i + 1; j < len; j++) {
        var p = Math.abs(algo.pearson(data[attributes[i]], data[attributes[j]], len)); // col by index ?
        if (p > max) {
          max = p;
          jmax = j;
        }
      }
      var f2 = attributes[jmax];
      var ps = this.toPoints(data[f1], data[f2]);

      //learnHelper(ts, max, f1, f2, ps);
      if (max > this.threshold) {
        let len = data[f1].length;
        let l = algo.linear_reg(ps);
        let f = this.findThreshold(ps, l) * 1.1;
        var c = new corFeat(f1, f2, max, f);
        c.setLine(l);
        this.cf.push(c);
      }
      if (this.flag == true) {
        if (max > 0.5 && max < this.threshold) {
          let circlee = new enclosingCircle(ps);
          let t = circlee["r"] * 1.1;
          var corr = new corFeat(f1, f2, max, t);
          corr.setCenter(circlee["x"], circlee["y"]);
          this.cf.push(corr);
        }
      }
    }

  }

  detect(data) {
    var reports = [];
    var attributes = Object.keys(data);
    //var size = attributes.length;
    for (let i = 0; i < this.cf.length; ++i) {
      var feature1 = this.cf[i].feature1;
      var feature2 = this.cf[i].feature2;
      var x_arr = data[feature1];
      var y_arr = data[feature2];

      for (let time_step = 0; time_step < x_arr.length; time_step++) {
      
       
        //var x_point = parseFloat(data[feature1][time_step]); 
        //var y_point = parseFloat(data[feature2][time_step]);

        var x_point = parseFloat(x_arr[time_step]); 
        var y_point = parseFloat(y_arr[time_step]);
        
        let check = this.cf[i];
        let check2 = check.corrlation;
        
        if( check2 > this.threshold){
          let p = new point(x_point, y_point);
          let l = this.cf[i].line_reg;
          let t = this.cf[i].threshold;
          let lf = l.f(p.x);

          if(Math.abs(p.y - lf)> t){

          //if ((algo.dev(p, l) ) > t)  {
            let descruption = feature1 + "-" + feature2;
            let anomaly = new anomalyReport(descruption, time_step + 1); 
            reports.push(anomaly);
          }

        }
        let cor = this.cf[i].corrlation;
        if (this.flag==true && cor > 0.5 && cor< 0.9 ){
          let p1= new point(x_point, y_point);
          let p2 = new point(this.cf[i].cx, this.cf[i].cy);
          if(Math.abs(this.dist(p1,p2) > this.cf[i].threshold)){
            let descruption = feature1 + "-" + feature2;
            reports.push(new anomalyReport(descruption, time_step + 1));
          }

        }
      }
    }
    return reports;

  }
}
module.exports = SimpleAnomalyDetector;
