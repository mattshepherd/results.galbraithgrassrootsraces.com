$( document ).ready(function() {
  $.ajaxSetup({ cache: false });
  getRaceData($.urlParam("race"),$.urlParam("training"));
  getResultsData($.urlParam("race"));
});

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

function getRaceData(raceID,isTraining){
  var dataUrl = "api/races.json";
  if(isTraining == 1){
    dataUrl = "api/training_races.json"
  }
  $.ajax({
    url: dataUrl,
    success: function( data ) {
      outputRaceInfo(data,raceID);
    },
      timeout: 60000, //60 seconds timeout
      error: function(jqXHR, status, errorThrown){   //the status returned will be "timeout" 
        $("#race-title").html('<li>Problem downloading race info!</li>');
    } 
  });

}

function getResultsData(raceID){
  $.ajax({
    url: "api/results/"+raceID+".json",
    success: function( data ) {
      outputResults(data);
    },
      timeout: 60000, //60 seconds timeout
      error: function(jqXHR, status, errorThrown){   //the status returned will be "timeout" 
        $("#race-title").html('<li>Problem downloading results!</li>');
    } 
  });

}

function outputRaceInfo(raceData,raceID){
  if(raceData.races.length > 0){
    
    for (i = 0; i < raceData.races.length; i++) {
      var race = raceData.races[i];
      if(race.id == raceID){
        $("#race-title").html(checkForNullAndEscape(race.race_name));
        $("#race-date").html(checkForNullAndEscape(race.race_date));
        return;
      }
    }
  }
}

function outputResults(resultsData){
  if(resultsData.results.length > 0){
    var resultHTMLItems = [];
    var lastRaceDiv = -1;
    var i;
    for (i = 0; i < resultsData.results.length; i++) {
      var result = resultsData.results[i];
      if(lastRaceDiv != result.division.id){
          if(lastRaceDiv != -1){
            //close the previous division
            resultHTMLItems.push('</tbody>');
          }
          lastRaceDiv = result.division.id;
  	      resultHTMLItems.push('<tbody>\
          	                      <tr class="thead-dark">\
                  	                    <th scope="col" colspan="7">' + checkForNullAndEscape(result.division.name) + '</th>\
                                  	    </tr>\
                                	      <tr class="thead-light">\
                                	      <th scope="col">Rank</th>\
                                        <th scope="col" class="d-table-cell d-sm-none">Racer Info</th>\
                                		    <th scope="col" class="d-none d-sm-table-cell">Time</th>\
                                	      <th scope="col" class="d-none d-sm-table-cell">Racer</th>\
                                        <th scope="col" class="d-none d-sm-table-cell">Bib #</th>\
                                		    <th scope="col" class="d-none d-sm-table-cell">Team</th>\
                                	      <th scope="col" class="d-none d-sm-table-cell">License #</th>\
                                  </tr>');
      }
      
      
      
      resultHTMLItems.push('<tr>\
                      	      <th scope="row">' + checkForNullAndEscape(result.division_rank) + '</th>\
                              <td class="d-table-cell d-sm-none"><strong>' + checkForNullAndEscape(result.racer_name) + ' &#35;' + checkForNullAndEscape(result.racer_bib) + '</strong><br>' + checkForNullAndEscapeMobileTeam(result.racer_team_sponsor) + checkForNullAndEscapeTime(result.race_time) + '<br>License: ' + checkForNullAndEscape(result.racer_license) + '</td>\
                      		    <td class="d-none d-sm-table-cell">' + checkForNullAndEscapeTime(result.race_time) + '</td>\
                      	      <td class="d-none d-sm-table-cell">' + checkForNullAndEscape(result.racer_name) + '</td>\
                              <td class="d-none d-sm-table-cell">' + checkForNullAndEscape(result.racer_bib) + '</td>\
                      	      <td class="d-none d-sm-table-cell">' + checkForNullAndEscape(result.racer_team_sponsor) + '</td>\
                      	      <td class="d-none d-sm-table-cell">' + checkForNullAndEscape(result.racer_license) + '</td>\
                      	    </tr>');
    }
    //close the last division
    resultHTMLItems.push('</tbody>');
    $("#results-table").html(resultHTMLItems.join(""));
  }else{
    //no results yet
    $("#results-table").html('<tr><td style="border-top: 0px;"><ul><li>No race results yet.</li></ul></td></tr>');
  }
}

function checkForNullAndEscape(value){
  if(value == null){
    return "";
  }else{
    return $("<div>").text(value).html();
  }
}

function checkForNullAndEscapeTime(value){
  if(value == null){
    return "00:00:00.000";
  }else{
	value = moment.duration(value).format("d.HH:mm:ss", 2);;
	//value = value.slice(0,-1);
    return $("<div>").text(value).html();
  }
}

function checkForNullAndEscapeMobileTeam(value){
  if(value == null || value == ""){
    return "";
  }else{
    return $("<div>").text(value).html() + "<br>";
  }
}