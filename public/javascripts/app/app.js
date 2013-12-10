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
  $('#printButton').on('click',clickPrint);
}

function clickSearch(){
  matches = [];
  $('#searchMatches').empty();
  var searchTerm = getValue('#searchTerm');
  searchTerm = searchTerm.replace(/ /g, '+');
  var url = apiBase + "/recipes?" + authentication + "&q=" + searchTerm;
  console.log(url);
  $.ajax({type: "GET", url: url, dataType: "jsonp", success: function (data) {
      console.log(data);
      for(var i = 0 ; i < data.matches.length; i++){
        var $li = $('<li data_id = ' + data.matches[i].id + '>' + data.matches[i].recipeName + '</li>');
        $('#searchMatches').append($li);
      }
      matches = data.matches;
      // $('#searchAd').append(data.attribution.html);
    }
  });
}

function clickRecipe(){
  var id = $(this).attr('data_id');
 // push ingredients to shopping list from matches array local
  var recipeResponse = _.find(matches, function(item){
    return item.id == id;
  });
  var clickedRecipe = {};
  clickedRecipe.ingredients = recipeResponse.ingredients;
  clickedRecipe.name = recipeResponse.recipeName;

// http://api.yummly.com/v1/api/recipe/recipe-id?_app_id=YOUR_ID&_app_key=YOUR_APP_KEY
  var url = apiBase + "/recipe/" + id + "?" + authentication;
  // console.log(url);
  $.ajax({type: "GET", url: url, dataType: "jsonp", success: function (data) {
      console.log(data);
      clickedRecipe.link = data.source.sourceRecipeUrl;
      clickedRecipe.measuredIngredients = data.ingredientLines;
      console.log(clickedRecipe);
      recipes.push(clickedRecipe);
      var $clickedRecipe = $('<li>' + '<a href=' + clickedRecipe.link + ' target="_blank">' + clickedRecipe.name + '</a>' + '</li>');
      $('#chosenRecipes').append($clickedRecipe);
      // $('#chosenAd').append(data.attribution.html);
      $('#searchMatches').empty();
      $('#searchTerm').focus();
      $('#printButton').show().removeClass('hidden');
    }
  });
}

function clickPrint(){
  _.forEach(recipes, function(r){
    console.log("Opening link to: " + r.name);
    window.open(r.link,'_blank');
    // location.focus();
  });
  window.open('/groceryList','_blank')



}

///////////////////////////////////////////////////////////////////////////
