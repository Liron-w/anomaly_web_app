const line = require('./Line');
const point = require('./Point');

class AnomalyDetection {
  constructor(){

  }
  avg(x_arr) {
    let sum = 0;
    for (let i = 0; i < x_arr.length; i++) {
      sum += parseFloat(x_arr[i]);
    }
    let ret = sum / (x_arr.length);
    return ret;
  }

  variance(x_arr) {
    let av = this.avg(x_arr);
    let sum = 0;
    for (let i = 0; i < x_arr.length; i++) {
      let tmp = parseFloat(x_arr[i]);
      sum += tmp * tmp;
    }
    let s = sum / x_arr.length;
    let s1 = av * av;
    let s2 = s-s1;
    return s2;
  }

  // returns the covariance of X and Y
  cov(x_arr, y_arr) {
    let sum = 0;
    for (let i = 0; i < x_arr.length; i++) {
      let tmp_x = parseFloat(x_arr[i]);
      let tmp_y = parseFloat(y_arr[i]);
      sum +=  tmp_x * tmp_y;
    }
    sum /= x_arr.length;
    let temp = this.avg(x_arr) * this.avg(y_arr);
    let temp2 = sum-temp;
    return temp2;
  }

  // returns the Pearson correlation coefficient of X and Y
  pearson(x_arr, y_arr) {
    if(x_arr.length == 0){
      return 0;
    }
    if(y_arr.length == 0){
      return 0;
    }
    let var_x = Math.sqrt(this.variance(x_arr));
    let var_y = Math.sqrt(this.variance(y_arr));
    let covar = this.cov(x_arr, y_arr);
    if(var_x == 0 || var_y == 0){
      return 0;
    }
    let ret4 = covar/(var_x * var_y);
    return ret4;
  }

  // performs a linear regression and returns the line equation
  linear_reg(points) {
    let x = [];
    let y = [];
    for (let i = 0; i < points.length; i++) {
      x[i] = parseFloat(points[i].x);
      y[i] = parseFloat(points[i].y);
    }
    let a = this.cov(x, y) / this.variance(x);
    let b = this.avg(y) - a * (this.avg(x));

    return new line(a, b);
  }

  // returns the deviation between point p and the line equation of the points
  dev(p, points) {
    const l = linear_reg(points);
    return this.dev(p, l);
  }

  // returns the deviation between point p and the line
  dev(p, l) {
    let ret = p.y - l.f(p.x);
    return Math.abs(ret);
  }
}

module.exports= AnomalyDetection;