/* global document, window, io */

$(document).ready(initialize);

var app_id = "8f303a51";
var app_key = "aff06d00c9a604466f6f1cd0e42927c7";
var apiBase = "http://api.yummly.com/v1/api/recipes?";
var authentication = "_app_id=" + app_id + "&_app_key=" + app_key;

function initialize(){
  $(document).foundation();
  $('#searchButton').on('click',clickSearch);
}

function clickSearch(){
  var searchTerm = getValue('#searchTerm');
  searchTerm = searchTerm.replace(/ /g, '+');
  url = apiBase + authentication + "&q=" + searchTerm;
  console.log(url);
  $.ajax({type: "GET", url: url, dataType: "jsonp", success: function (data) {
      console.log(data);
      for(var i = 0 ; i < data.matches.length; i++){
        var $li = $('<li>' + data.matches[i].recipeName + '</li>');
        $('#recipes').append($li);
      }
    }
  });

}

///////////////////////////////////////////////////////////////////////////
