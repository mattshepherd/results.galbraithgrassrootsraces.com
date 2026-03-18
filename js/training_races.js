$( document ).ready(function() {
  $.ajaxSetup({ cache: false });
  getRaceData();
});

function getRaceData(){
  $.ajax({
    url: "api/training_races",
    success: function( data ) {
      outputRaces(data);
    },
      timeout: 60000, //60 seconds timeout
      error: function(jqXHR, status, errorThrown){   //the status returned will be "timeout" 
        $("#recent-race-list").html('<li>Error loading training races.</li>');
    } 
  });

}

function outputRaces(raceData){
  if(raceData.races.length > 0){
    var raceHTMLItems = [];
    var i;
    for (i = 0; i < raceData.races.length; i++) {
      var race = raceData.races[i];
      raceHTMLItems.push('<li><a href="results.html?training=1&race=' + race.id + '">' + race.race_date + ' - ' + checkForNullAndEscape(race.race_name) + '</a></li>');
    }
    $("#recent-race-list").html(raceHTMLItems.join(""));
  }else{
    //no recent races
    $("#recent-race-list").html('<li>No recent training races.</li>');
  }
}

function checkForNullAndEscape(value){
  if(value == null){
    return "";
  }else{
    return $("<div>").text(value).html();
  }
}