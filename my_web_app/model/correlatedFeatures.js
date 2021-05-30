
class correlatedFeatures{
  feature1;
  feature2;
  corrlation;
  threshold;
  line_reg;
  cx;
  cy;
  
  constructor(feature1, feature2, corrlation,threshold){
    this.feature1= feature1;
    this.feature2 = feature2;
    this.corrlation = corrlation;
    this.threshold = threshold;
  }

  setLine(l){
    this.line_reg = l;
  }

  setCenter(x,y){
    this.cx = x;
    this.cy = y;
  }
}

module.exports= correlatedFeatures;
