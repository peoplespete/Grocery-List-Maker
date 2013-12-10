exports.index = function(req, res){
  res.render('home/index', {title: 'Grocery List Maker'});
};


// GET /groceryList
exports.groceryList = function(req, res){
  res.render('home/groceryList', {title: 'Grocery List'});
};
