var margin = {top: 20, right: 20, bottom: 30, left: 40};

var star = "100,10 40,198 190,78 10,78 160,198"

var width = window.innerWidth - margin.left - margin.right;
var height = window.innerHeight - margin.top - margin.bottom;

var windowCenterWidth = width/2
var windowCenterHeight = height/2
// inizializzo una variabile contatore del click del mouse 
var mouseCliccato=0

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)    
    .attr("height", height + margin.top + margin.bottom)   
    .append("g")                                                                                      

//Questa function disegna le 10 stelline
function inizializeStars(data){
    var firstConfig = data[0]["position"]
    var id = 0

    firstConfig.forEach(function(pos){
        svg
        .append("polygon")
        .attr("id","star" + id) 
        .attr("points", star)
        .attr("transform", "translate ( "+ pos.x +" , " + pos.y +  ") scale(0.3)")
        .datum(data)
        .style("fill", randomColor)
        .on("click", function (data){
            // con event.target.id posso selezionare la singola stellina con l'id 
            var cliccato = event.target.id
            mouseCliccato = mouseCliccato + 1
            translateAndRotateStars(data,mouseCliccato,cliccato)
        })
        id = id + 1;
    })    
}

//Questa function ruota la stellina selezionata di 360 gradi e sposta tutte le altre 
function translateAndRotateStars(data, mouseCliccato,cliccato){

    var valore=mouseCliccato % 5
    var newConfig = data[valore]["position"] 
    var oldConfig

    if (valore==0){
        oldConfig = data[4]["position"]
    }
    else { 
        oldConfig = data[valore - 1]["position"]
    }
    
    for(i = 0; i < 10; i++){
        var id = "star" +i
        if(id == cliccato ){
            var stella = d3.select("#star"+i)
            stella.transition()
            .duration(1000)
            //uso uan rotazione di 300 gradi perchè con 360 gradi non si muove la stellina
           // .attr("transform", " translate( "+ oldConfig[i]["x"]+","+oldConfig[i]["y"]+" ) ,rotate(300), scale(0.3)" )
            //con questa trasformazione gira di 360 ma non nella posizione giusta
            .attrTween("transform",rotTween )
          
        }
        else {
            var stella = d3.select("#star"+i)
            stella.transition()
           .duration(1000)
           .attr("transform","translate( "+ newConfig[i]["x"]+","+newConfig[i]["y"]+" ) scale(0.3)")
           
        }
    }
}

//Questa function assegna un colore diverso ad ogni stellina
function randomColor() {
    var hex = '0123456789ABC'.split('');
    var color = '#';
    for (i = 0; i <6; i++) {
        color = color + hex[Math.floor(Math.random() * 13)];
    }
    return color;
}

  // questa funzione mi consente di ruotare di 360 gradi ma non mi riporta la stellina al punto di partenza
  function rotTween() {
    var i = d3.interpolate(0, 360);
    return function(t) {
        return "translate(100,100) rotate(" + i(t) + ") scale(0.3)";
    };
}


d3.json("data/position.json")
    .then(function(data) {
        inizializeStars(data)
    })
    .catch(function(error) {
        console.log(error); // Some error handling here
    });

