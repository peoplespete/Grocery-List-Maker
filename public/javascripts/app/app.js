
/* global document, window, io */

$(document).ready(initialize);

var app_id = "8f303a51";
var app_key = "aff06d00c9a604466f6f1cd0e42927c7";
var apiBase = "http://api.yummly.com/v1/api";
var authentication = "_app_id=" + app_id + "&_app_key=" + app_key;
var recipes = [];
var matches;
var shoppingList = [];

function initialize(){
  $(document).foundation();
  $('#searchButton').on('click',clickSearch);
  $('#searchMatches').on('click','li',clickRecipe);
  $('#openLinksButton').on('click',clickOpenLinks);
  $('#chosenRecipes').on('click','.alert',clickDeleteChosenRecipe);
  $('#groceryList').on('click','.alert', clickDeleteIngredient);
}

function clickSearch(){
  matches = [];
  $('#searchMatches').empty();
  var searchTerm = getValue('#searchTerm');
  searchTerm = searchTerm.replace(/ /g, '+');
  var url = apiBase + "/recipes?" + authentication + "&q=" + searchTerm;
  $.ajax({type: "GET", url: url, dataType: "jsonp", success: function (data) {
      for(var i = 0 ; i < data.matches.length; i++){
        var sz = "90";
        var pic;
        if(data.matches[i].imageUrlsBySize){
          pic = data.matches[i].imageUrlsBySize[sz];
        }else{
          pic = '/images/item-placeholder.png';
        }
        var $li = $('<li data_id = ' + data.matches[i].id + '>' + '<img src=' + pic + '>' + data.matches[i].recipeName + '</li>');
        $('#searchMatches').append($li);
      }
      matches = data.matches;
      // $('#searchAd').append(data.attribution.html);
    }
  });
}

function clickRecipe(){
  $('#list').show().removeClass('hidden');
  $('#choose').show().removeClass('hidden');
 // push ingredients to shopping list from matches array local
  var id = $(this).attr('data_id');
  var recipeResponse = _.find(matches, function(item){
    return item.id == id;
  });
  var clickedRecipe = {};
  clickedRecipe.ingredients = recipeResponse.ingredients;
  clickedRecipe.name = recipeResponse.recipeName;

  var url = apiBase + "/recipe/" + id + "?" + authentication;
  $.ajax({type: "GET", url: url, dataType: "jsonp", success: function (data) {
      clickedRecipe.id = data.id;
      clickedRecipe.link = data.source.sourceRecipeUrl;
      clickedRecipe.measuredIngredients = data.ingredientLines;
      recipes.push(clickedRecipe);
      var $clickedRecipe = $('<li>');
      $clickedRecipe.attr('data-id',clickedRecipe.id);
      var sz = "90";
      $clickedRecipe.append('<img src=' + recipeResponse.imageUrlsBySize[sz] + '>' + '<a href=' + clickedRecipe.link + ' target="_blank">' + clickedRecipe.name + '</a>');
 // add delete button for each item you put in
      var $delete = $('<input type="button" value="x" class="button tiny radius alert" >');
      $clickedRecipe.append($delete);
      $('#chosenRecipes').append($clickedRecipe);
      // $('#chosenAd').append(data.attribution.html);
      $('#searchMatches').empty();
      $('#searchTerm').focus();
      $('#openLinksButton').show().removeClass('hidden');
      clickPrint();
    }
  });
}

function clickDeleteChosenRecipe(){
  var id = $(this).closest('li').attr('data-id');
  // remove from html
  $(this).closest('li').remove();
  // remove from recipes array
  _.remove(recipes, function(r){
    return r.id == id;
  });
  clickPrint();
  if(recipes.length === 0){
    $('#openLinksButton').hide().addClass('hidden');
    $('#list').hide().addClass('hidden');
    $('#choose').hide().addClass('hidden');
    $('#searchTerm').focus();
  }
}

function clickPrint(){
  //how to fix the unsalted butter getting picked up by both unsalted butter and salt bug?

  var list = [];
  $('#groceryList').empty();
  _.forEach(recipes, function(r){
    // go through every recipe
      // go trhough every indreg
        // if it is already in list add regexed amount
        // else add it to list with ingred and amount
    _.forEach(r.ingredients, function(ingred){
      var found = false;
      var re = new RegExp(' ' + ingred, 'g');
      var measuredIngred;
      _.forEach(list, function(item){
        if(ingred == item.ingredient){
          _.forEach(r.measuredIngredients, function(mIngred){
            if(mIngred.indexOf(' ' + ingred) != -1){
              measuredIngred = mIngred.replace(re,'')
              item.amounts.push(measuredIngred);
              found = true;
            }
          });
        }
      });
      if(!found){
        item = {};
        item.ingredient = ingred;
        item.amounts = [];
        _.forEach(r.measuredIngredients, function(mIngred){
          if(mIngred.indexOf(' ' + ingred) != -1){
            measuredIngred = mIngred.replace(re,'');
            item.amounts.push(measuredIngred);
          }
        });
        list.push(item);
      }
    });
  });
  _.forEach(list, function(item){
      var $li = $('<li>');
      var $ingredient = $('<div>');
      $ingredient.text(item.ingredient);
      $ingredient.addClass('match');
      var $amounts = $('<div>');
      _.forEach(item.amounts, function(a){
        var $amount = $('<div>');
        $amount.addClass('amount');
        $amount.text(a);
        $amounts.append($amount);
      });

      var $delete = $('<input type="button" value="x" class="button tiny radius alert" >');
      $li.append($ingredient, $amounts, $delete);
      $('#groceryList').append($li);
  });
}

function clickOpenLinks(){
  _.forEach(recipes, function(r){
    window.open(r.link,'_blank');
  });
}

function clickDeleteIngredient(){
  // remove from html
  $(this).closest('li').remove();
}
///////////////////////////////////////////////////////////////////////////
