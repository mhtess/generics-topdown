Object.prototype.getKeyByValue =function( value ) {
    for( var prop in this ) {
        if( this.hasOwnProperty( prop ) ) {
             if( this[ prop ] === value )
                 return prop;
        }
    }
}

function mark(el, otherEls) {
    el.style.border=='' ? 
    $('#'+el.id).css({"border":'2px solid red',
                    'background-color': 'white',
                    'opacity': '1'}) : 
    $('#'+el.id).css({"border":'',
                    'background-color': 'white',
                    'opacity': '0.5'})

//el.style.border = "2px solid red": el.style.border='';

    // var tableCells = ['table0','table1','table2','table3'];
    // tableCells.splice(tableCells.indexOf(el),1)
    otherEls.map(function(cell){$('#'+cell).css({"border":'',
      'background-color': 'white','opacity': '0.5'})})

}

function make_slides(f) {
  var slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
      $("#total-num").html(exp.numTrials);  
     }
  });

  slides.practice_ip_instructions = slide({
    name : "practice_ip_instructions",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.ip_instructions = slide({
    name : "ip_instructions",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.practice_tc_instructions = slide({
    name : "practice_tc_instructions",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.tc_instructions = slide({
    name : "tc_instructions",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.intermediate_motivation = slide({
    name : "intermediate_motivation",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });


  slides.truth_conditions = slide({
    name: "truth_conditions",


    present :  exp.stims,//exp.stims[0],

    present_handle : function(stim) {

      this.startTime = Date.now();
      this.stim = stim;

      // this.stim.proptype = _.sample(["part", "color"])
      console.log(this.stim.proptype)
      this.stim.colorTag = colors[this.stim.color]

      var colorPart;

      $(".err").hide();
      $("input[name=radio_button]").prop('checked', false); 


      // stim.prototype can be color, color part, or part
      // if its color, set the color to be that color
      // if its color-part,
      // --> sample an appropriate body part
      // --> sample a color
      this.stim.proptype == 'color' ?
          null :
          this.stim.colorTag = "#FFFFFF"

      if (this.stim.proptype == 'color-part') {
           colorPart = _.sample(animalColorParts[this.stim.kind]);
           this.stim.colorPart = colorPart[0];
           this.stim.colorPartLabel = colorPart[1];
           this.stim.colorPartColor = _.sample(colors);
      } else {
           this.stim.colorPart = null
          this.stim.colorPartLabel = "col1" //just to set it equal to something
          if (this.stim.proptype == "color") {
            this.stim.colorPartColor = this.stim.color
           } else {
            this.stim.colorPartColor = "#FFFFFF"
            this.stim.color = "#FFFFFF"
          } // no distinguishing color)
      }

      this.stim.colorpartword = colors.getKeyByValue(this.stim.colorPartColor)

      this.stim.np = this.stim.determiner == 'generic' ? 
         utils.upperCaseFirst(this.stim.category) :
         utils.upperCaseFirst(this.stim.determiner) + " " + this.stim.category

      // debugger;
      this.stim.feature = this.stim.proptype == 'part' ? this.stim.propertyName : 
                           this.stim.proptype == 'color-part' ? this.stim.colorpartword +" "+ this.stim.colorPart:
                            this.stim.proptype == 'color' ? this.stim.color:
                      "[[feature error]]"

      this.stim.originStory = generateOrigins[this.stim.origins](this.stim.np, this.stim.feature, this.stim.proptype)
      this.stim.eventStory = eventOutcomes[this.stim.eventOutcome]



       this.utterance = this.stim.proptype == 'part' ? this.stim.np + " have " + this.stim.propertyName +".":
                        this.stim.proptype == 'color' ? this.stim.np + " are " + this.stim.color +".":
                        this.stim.proptype == 'color-part' ? this.stim.np + " have " + this.stim.colorpartword +" "+ this.stim.colorPart + ".":
                       "error"

      $(".prompt").html("These are " + this.stim.category + ".");

      var scale = 0.5;
      var cells = ['svg0','svg1','svg2','svg3','svg4','svg5','svg6','svg7', 'svg8', 'svg9'];

      cells.map(function(cell){$('#'+cell).empty()});

      this.genusOptions = {
        "col1":{"mean":this.stim.color},
        "col2":{"mean":this.stim.color},
        "col3":{"mean":this.stim.color},
        "col4":{"mean":this.stim.color},
        "col5":{"mean":this.stim.color},
        "tar1":0, // never has a tail
        "tar2":0, // never has a crest
        "prop1":{"mean":this.stim.prop1size}, // mean size, unif(0, 0.5, 1)
        "prop2":{"mean":this.stim.prop2size},
        "var":0.001, //overall variance (overwritten by any specified variances),
        // "drawOnly":["tar1","tar2"]
      };

      this.negGenusOptions = {
        "col1":{"mean":"#FFFFFF"},
        "col2":{"mean":"#FFFFFF"},
        "col3":{"mean":"#FFFFFF"},
        "col4":{"mean":"#FFFFFF"},
        "col5":{"mean":"#FFFFFF"},
        "tar1":0, // never has a tail
        "tar2":0, // never has a crest
        "prop1":{"mean":this.stim.prop1size}, // mean size, unif(0, 0.5, 1)
        "prop2":{"mean":this.stim.prop2size},
        "var":0.001, //overall variance (overwritten by any specified variances)
      };

      var negGenus = new Ecosystem.Genus(this.stim.kind, this.negGenusOptions)

      this.stim.proptype == "color" ? 
        this.genusOptions[this.stim.colorPartLabel].mean = this.stim.colorPartColor :
        null
      // console.log(this.stim.colorPartLabel)
      // console.log(this.stim.colorPartColor)

      this.stim.proptype == 'part' ? this.genusOptions[this.stim.property] = 1 : null
      
      var genus = new Ecosystem.Genus(this.stim.kind, this.genusOptions)

      var animalsWithProperties = Math.round(this.stim.prevalence*6)
      var properties = _.shuffle(utils.fillArray(true,animalsWithProperties).concat(
                                 utils.fillArray(false,6-animalsWithProperties)))

      if (this.stim.origins == "intrinsic") {
        cells.map(function(x){genus.draw(x, {}, scale)})
      } else {
        cells.map(function(x){negGenus.draw(x, {}, scale)})
      }

      $('#radio1').parent().hide();
      $('#radio2').parent().hide();

      this.flag = 0
      // $('#table_of_3').hide();
      $("#door").hide()


    },
    button : function() {

      if (this.flag == 0) {
        // after showing 6 dobles, show origins.
       ['svg0','svg1','svg2','svg3','svg4','svg5','svg6','svg7', 'svg8', 'svg9'].map(function(cell){$('#'+cell).empty()});
        // $('#table_of_6').hide();

        $("#door").show()

        $(".prompt").html(this.stim.originStory);


        // console.log(this.stim.proptype)

        var genus = new Ecosystem.Genus(this.stim.kind, this.genusOptions)
        var negGenus = new Ecosystem.Genus(this.stim.kind, this.negGenusOptions)

        this.genusOptionsDrawOnly = _.clone(this.genusOptions);
        this.genusOptionsDrawOnly.drawOnly = [this.stim.property];
        var justPropertyDraw = new Ecosystem.Genus(this.stim.kind, this.genusOptionsDrawOnly);

        // $('#table_of_3').show();
        // debugger;
        if (this.stim.origins == "intrinsic") {
          if (this.stim.kind=="fish") {
              genus.draw("svg0", {}, 0.15)
          } else if (this.stim.kind=="bird") {
             $("#tdsvg0").css("background", "url(stims_raw/egg.png)")
              $("#tdsvg0").css("background-size", "40%")
              $("#tdsvg0").css("background-repeat", "no-repeat")
              $("#tdsvg0").css("background-position", "50% 60%")
          } else {
              $("#tdsvg0").css("background", "url(stims_raw/larva.jpg)")
              $("#tdsvg0").css("background-size", "40%")
              $("#tdsvg0").css("background-repeat", "no-repeat")
              $("#tdsvg0").css("background-position", "50% 60%")
          }
          // var h = $("#svg1").css("height")

          genus.draw("svg1", {}, 0.3)
          genus.draw("svg2", {}, 0.4)
          genus.draw("svg3", {}, 0.45)
          genus.draw("svg4", {}, 0.6)
          // genus.draw("svg2", {}, 0.6)
        } else { 
          negGenus.draw("svg0", {}, 0.5)
          negGenus.draw("svg1", {}, 0.5)

          $("#svg0").css('border', '1px solid black')
          $("#svg0").css('border-right', 'none')
          $("#svg1").css('border', '1px solid black')
          $("#svg1").css('border-left', 'none')

          if (this.stim.proptype == "color") {
            // put splotch of paint into table
            var paper = new Raphael(document.getElementById('svg7'), 250, 250);
            var fillColor = this.stim.colorPartColor;
            var group_a = paper.set(); 
            var path_a = paper.path("M1066 1953 c-9 -9 -7 -48 3 -58 5 -6 12 -37 16 -70 6 -53 4 -63 -14 -79 -26 -24 -36 -16 -50 38 -12 49 -32 62 -81 51 -27 -6 -30 -4 -30 18 0 25 -22 52 -33 40 -12 -11 -7 -40 8 -53 19 -16 19 -54 0 -70 -12 -10 -25 -7 -72 17 -46 23 -60 36 -69 63 -13 38 -24 45 -59 36 -19 -5 -24 -12 -23 -39 1 -44 5 -48 34 -35 22 10 28 9 40 -7 8 -10 14 -34 14 -52 0 -19 9 -46 20 -61 10 -15 20 -40 22 -57 3 -26 0 -30 -32 -35 -54 -10 -98 -37 -128 -80 -17 -24 -38 -40 -56 -44 -25 -5 -28 -9 -24 -38 4 -25 -1 -41 -21 -65 -14 -18 -30 -33 -34 -33 -5 0 -37 29 -71 65 -62 65 -63 65 -118 65 -46 0 -62 5 -86 25 -37 31 -71 36 -86 12 -17 -28 17 -47 83 -47 42 0 66 -6 96 -25 22 -13 50 -25 62 -25 28 0 56 -30 83 -86 35 -75 22 -134 -29 -134 -33 0 -48 -14 -53 -50 -5 -37 -28 -30 -43 13 -12 36 -12 37 10 37 44 0 66 40 45 81 -23 43 -106 8 -93 -39 3 -14 -4 -17 -44 -17 -48 0 -48 0 -51 -36 -3 -30 2 -41 28 -63 35 -29 48 -31 85 -14 24 11 29 8 63 -25 33 -33 35 -37 15 -37 -12 0 -25 5 -28 10 -3 6 -19 10 -35 10 -38 0 -57 -31 -34 -54 20 -20 38 -20 69 0 23 15 28 15 58 0 25 -11 42 -13 64 -7 37 11 53 -1 53 -39 0 -34 -35 -69 -52 -52 -16 16 -61 15 -76 0 -20 -20 -14 -56 13 -74 23 -15 27 -15 50 0 14 9 25 25 25 35 0 23 47 46 65 31 20 -17 38 -106 31 -152 -7 -43 -43 -120 -86 -183 -15 -22 -30 -50 -34 -63 -4 -12 -25 -34 -47 -48 -42 -26 -49 -41 -22 -51 11 -4 24 3 40 23 14 16 36 42 49 58 13 15 24 38 24 51 0 21 47 96 70 110 6 4 29 -12 52 -35 40 -40 41 -43 29 -73 -7 -18 -12 -47 -12 -64 1 -26 -2 -33 -17 -33 -10 0 -27 9 -37 20 -24 27 -38 15 -21 -18 18 -35 4 -135 -25 -175 -74 -102 -85 -138 -46 -161 15 -9 23 -6 43 17 22 25 24 35 18 79 -7 49 -6 50 39 91 34 32 47 52 52 82 3 22 10 47 14 55 11 22 71 50 107 50 46 0 68 -22 80 -82 12 -59 3 -93 -27 -101 -15 -4 -18 -14 -17 -44 1 -21 -2 -47 -6 -58 -4 -11 2 -3 14 18 11 20 25 37 30 37 6 0 10 14 10 31 0 42 96 133 143 136 18 1 46 3 62 5 26 3 30 -1 33 -24 3 -28 -35 -112 -74 -163 -39 -52 -40 -80 -6 -115 17 -16 35 -30 41 -30 22 0 40 33 46 87 12 112 17 131 40 163 46 62 121 100 140 70 10 -16 -13 -48 -37 -52 -12 -2 -29 -15 -37 -30 -13 -22 -13 -29 -2 -42 21 -25 68 -20 87 9 15 23 16 44 2 120 -5 32 30 31 43 -2 27 -68 40 -95 44 -91 3 3 -2 19 -11 37 -21 42 -11 107 18 117 11 3 24 2 28 -3 17 -16 73 -128 84 -167 11 -39 36 -62 36 -34 0 8 -16 55 -35 104 -19 49 -35 97 -35 106 0 35 76 52 100 23 16 -19 40 -19 66 0 19 13 24 11 54 -21 26 -26 31 -37 22 -46 -16 -16 -15 -53 2 -68 20 -15 56 -9 70 12 11 18 -1 145 -26 280 -6 37 -9 70 -5 74 3 3 24 -8 47 -26 27 -21 40 -27 40 -17 0 8 -20 25 -45 38 -49 26 -60 59 -26 80 11 8 16 19 13 32 -3 10 1 22 7 27 19 11 86 -5 116 -28 31 -25 65 -15 65 18 0 28 -27 38 -90 33 -70 -7 -85 6 -65 55 10 22 21 32 36 32 14 0 19 -5 16 -14 -8 -20 16 -49 38 -45 50 10 38 69 -14 69 -35 0 -51 17 -51 52 0 21 6 31 26 38 32 12 134 13 153 1 18 -11 41 -3 41 14 0 19 -35 28 -59 16 -24 -13 -161 -15 -161 -2 0 13 35 23 86 25 24 1 49 7 56 14 9 9 0 12 -44 12 -83 0 -125 22 -149 76 -25 56 -22 75 14 87 40 13 53 -2 38 -43 -12 -37 -2 -63 30 -80 28 -15 69 11 69 45 0 32 15 40 78 40 48 0 57 3 84 34 36 41 32 73 -15 114 -18 15 -51 46 -74 68 -23 21 -47 39 -53 39 -18 0 -52 -41 -46 -57 15 -38 17 -63 7 -82 -13 -24 -87 -65 -101 -56 -20 13 -9 45 25 71 36 27 43 51 25 85 -13 24 -61 49 -94 49 -36 0 -38 12 -10 56 l25 39 -34 -37 c-39 -44 -75 -49 -114 -18 -14 11 -31 20 -38 20 -7 0 -15 9 -18 20 -3 11 -10 20 -17 20 -7 0 -14 -9 -17 -20 -3 -11 -14 -20 -24 -20 -35 0 -109 24 -109 35 0 23 -60 131 -87 157 -63 60 -119 37 -115 -47 2 -54 -18 -77 -62 -73 -45 4 -56 35 -56 155 0 90 -2 104 -19 112 -10 6 -21 7 -25 4z")
            path_a.attr({fill: fillColor,stroke: 'none','stroke-width':'1','stroke-opacity':'1',parent: 'group_a'}).transform("").data('id', 'path_c'); 
            var box = path_a.getBBox();    
            var margin = Math.max( box.width, box.height ) * 0.1;  //  because white space always looks nice ;-)
            paper.setViewBox(box.x - margin, box.y - margin, box.width + margin * 2, box.height + margin * 2);   
            group_a.attr({'fill': fillColor,'stroke': 'none','name': 'group_a'});
            group_a.push(path_a);
          } else {
             justPropertyDraw.draw("svg5", {}, 0.5)
             justPropertyDraw.draw("svg6", {}, 0.5)
          }
          // $("#tdsvg2").css("background", "url(stims_raw/doors.png)")
          // var h = $("#svg1").css("height")
          // $("#tdsvg2").css("background-size", "80%")
          // $("#tdsvg2").css("background-repeat", "no-repeat")
          genus.draw("svg3", {}, 0.5)
          genus.draw("svg4", {}, 0.5)

          $("#svg3").css('border', '1px solid black')
          $("#svg3").css('border-right', 'none')
          $("#svg4").css('border', '1px solid black')
          $("#svg4").css('border-left', 'none')

        }

        this.flag = 1
      } else if (this.flag==1) {

        $("#svg0").css('border', 'none')
        $("#svg1").css('border', 'none')
        $("#svg3").css('border', 'none')
        $("#svg4").css('border', 'none')

        $("#tdsvg2").css("background", "none")
        $("#tdsvg0").css("background", "none")
        // $('#table_of_3').hide();
        // $('#table_of_6').show();
        var cells = ['svg0','svg1','svg2','svg3','svg4','svg5','svg6','svg7', 'svg8', 'svg9']
        $(".prompt").html(this.stim.eventStory);
        cells.map(function(cell){$('#'+cell).empty()});
        var genus = new Ecosystem.Genus(this.stim.kind, this.genusOptions);
        var negGenus = new Ecosystem.Genus(this.stim.kind, this.negGenusOptions)

        if (this.stim.eventOutcome=="maintained") {
          cells.map(function(x){genus.draw(x, {}, 0.5)});
        } else {
          cells.map(function(x){negGenus.draw(x, {}, 0.5)});
        };
      
        this.flag = 2

      } else if (this.flag==2) { 

        $(".prompt").html("Do you agree or disagree that:<br><strong>" + this.utterance + "</strong>");

        $('#radio1').parent().show();
        $('#radio2').parent().show();
        this.flag = 3

      } else if (this.flag==3) { 
        
        if ($("input[name=radio_button]:checked").val()==undefined) {
          $(".err").show();
        } else {
          this.rt = (Date.now() - this.startTime)/1000;
          this.log_responses();

          /* use _stream.apply(this); if and only if there is
          "present" data. (and only *after* responses are logged) */
          _stream.apply(this);
        }

      }


    },

    log_responses : function() {

     // this.stim.proptype == 'part' ? 
     //    this.stim.colorsave = 'white' : 
     //    this.stim.proptype == 'color' ? 
     //      this.stim.colorsave = this.stim.color :
     //      this.stim.proptype == 'color-part' ?
     //      this.stim.colorsave = this.stim.colorpartword : 
     //        "NA"

     this.stim.propsave = this.stim.proptype == 'part' ? 
                            this.stim.propertyName : 
        this.stim.proptype == 'color' ? 
                             this.stim.color :
          this.stim.proptype == 'color-part' ?
                           this.stim.colorPart : 
            "NA"


      exp.data_trials.push({
        "trial_type" : "truth_conditions",
        "response" : $("input[name=radio_button]:checked").val(),
        "rt":this.rt,
        "origins":this.stim.origins,
        "event_outcome": this.stim.eventOutcome,
        "stim_prevalence": this.stim.prevalence,
        "stim_word": this.stim.determiner,
        "stim_proptype":this.stim.proptype,
        "stim_kind": this.stim.kind,
        "stim_name": this.stim.category,
        // "stim_color": this.stim.colorsave,
        "stim_property":this.stim.propsave
      });
    }//,

    // end : function() {
    //   this.present = exp.stims1.shift();
    //   //exp.stims.shift();
    // }

  });

  slides.practice_tc = slide({
    name: "practice_tc",
    present :  _.shuffle(["apples","bananas", "boat", "house"]),
    present_handle : function(stim) {

      this.startTime = Date.now();
      this.stim = stim;
      $(".err").hide();
      $("input[name=radio_button]").prop('checked', false); 
      var practiceUtterances={
        "apples":"These apples are green.",
        "bananas":"This is a picture of bananas.",
        "boat":"This boat is brown.",
        "house":"This house has a blue roof."
      };
      var practiceSolutions={
        "apples":0,
        "bananas":1,
        "boat":1,
        "house":0
      };
      this.solution = practiceSolutions[this.stim];
      this.utterance = practiceUtterances[this.stim];
      $("#practiceUtterance").html(this.utterance);
      $("#practiceImg").attr("src","stims_raw/"+this.stim+".png");
    },
    button : function() {
      if ($("input[name=radio_button]:checked").val()==undefined) {
        $(".err").show();
      } else {
        this.rt = (Date.now() - this.startTime)/1000;
        this.log_responses();
        _stream.apply(this);
      }
    },
    log_responses : function() {

      exp.catch_trials.push({
        "trial_type" : "practice",
        "response" : $("input[name=radio_button]:checked").val(),
        "correctResponse": this.solution,
        "rt":this.rt,
        "stim_type": this.stim
      });
    }
  });

  slides.practice_ip = slide({
    name: "practice_ip",
    present :  _.shuffle([{"item":"apples",
          "utterance":"There are 4 apples.",
          "alternatives":["apples","apples2","bananas","boat"]},
        {"item":"bananas",
        "utterance":"There are 3 bananas.",
          "alternatives":["apples","bananas5","bananas","house-greyRoof"]},
        {"item":"boat",
        "utterance":"This boat is brown.",
            "alternatives":["boat-red","boat","apples2","house"]},
        {"item":"house","utterance":"This house has a white roof.",
            "alternatives":["house-greyRoof","boat-red","bananas5","house"]}]),


    present_handle : function(stim) {

      ['table0p','table1p','table2p','table3p'].map(function(cell){
          $('#'+cell).css({"border":'',
                    'background-color': 'white',
                    'opacity': '1'})})


      this.startTime = Date.now();
      this.stim = stim;
      this.stim.kind = this.stim.item;
      this.stim.utterance = this.stim.utterance;
      this.stimorder = _.shuffle(this.stim.alternatives);
      $(".err").hide();

      $(".practiceUtterance").html(this.stim.utterance);

      _.zip(['svg0p','svg1p','svg2p','svg3p'],this.stimorder).map(function(cell){
        $('#'+cell[0]).attr("src","stims_raw/"+cell[1]+".png")
      });
        
    },

    button : function() {

      var responses = ['table0p','table1p','table2p','table3p'].map(
        function(cell){return $('#'+cell).css("opacity") == '1' ? 1 : 0})

      if (responses.reduce(function(a, b){return a + b;})!=1) {
        $(".err").show();
      } else {
        this.rt = (Date.now() - this.startTime)/1000;
        this.log_responses();

        _stream.apply(this);
      }

    },

  log_responses : function() {

      var prevObj = this.prevalenceCells
      var responses = _.zip(['table0p','table1p','table2p','table3p'],
        this.stimorder).map(
        function(cell){return ($('#'+cell[0]).css("opacity") == '1' ? cell[1] : null)})

      exp.catch_trials.push({
        "trial_type" : "implied_prevalence",
        "response" : responses.join(''),
        "correct": responses.join('')==this.stim.kind ? 1 : 0,
        "rt":this.rt,
        "category": this.stim.item,
        "utterance": this.stim.utterance
      });
    }


  });

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        problems: $("#problems").val(),
        fairprice: $("#fairprice").val(),
        comments : $("#comments").val()
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {

      exp.data= {
          "trials" : exp.data_trials,
          "catch_trials" : exp.catch_trials,
          "system" : exp.system,
          "condition" : exp.condition,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {

  repeatWorker = false;
  (function(){
      var ut_id = "mht-generics-20160601";
      if (UTWorkerLimitReached(ut_id)) {
        $('.slide').empty();
        repeatWorker = true;
        alert("You have already completed the maximum number of HITs allowed by this requester. Please click 'Return HIT' to avoid any impact on your approval rating.");
      }
  })();


  // var prev_levels = ["0","0","0.33","0.33","0.66","0.66","1","1"];
  var prev_levels = ["1","1","1","1","1","1","1","1"];

  exp.trials = [];
  exp.catch_trials = [];
  // exp.condition = _.sample(["truth_conditions", "implied_prevalence"]); //can randomize between subject conditions here
  // exp.condition = "predictive_prevalence"
  exp.condition = "truth_conditions"

  exp.practice = "practice_tc";
  exp.practiceinstructions = "practice_tc_instructions";
  exp.instructions = "tc_instructions";

//  exp.stimtype = _.shuffle(["bare","danger","irrelevant"]);
//  exp.stimtype = ["bare","danger/distinct","nondistinctive"]; //because there is list1, list2, list3
  var determiners = _.map(utils.fillArray("generic",8), function(x){return {determiner: x}})

  var stimproptypes = [{proptype: "color"},{proptype: "part"}];


  var conditions = [
    {
      origins: "intrinsic",
      eventOutcome: "maintained"
    },
    {
      origins: "intrinsic",
      eventOutcome: "lost"
    },
    {
      origins: "extrinsic",
      eventOutcome: "maintained"
    },
    {
      origins: "extrinsic",
      eventOutcome: "lost"
    }
  ]

  // intrinsic with both part and color; extrinsic both part and color
 conditions = _.map(_.zip(conditions, _.flatten([_.shuffle(stimproptypes), _.shuffle(stimproptypes)])),
    function(c){return _.extend(c[0], c[1])})

  var prevlevObj = [{"prevalence":0}, {"prevalence":0},
                        // {"prevalence":0.33},{"prevalence":0.33},
                        // {"prevalence":0.66},{"prevalence":0.66},
                        {"prevalence":1},{"prevalence":1}];

  var propertyObj = [{"kind":"fish","property":"tar1","propertyName":"fangs"},
                  {"kind":"fish","property":"tar2","propertyName":"whiskers"},
                    // {"kind":"flower","property":"tar1","propertyName":"thorns"},{"kind":"flower","property":"tar2","propertyName":"spots"},
                    {"kind":"bug","property":"tar1","propertyName":"antennae"},
                    {"kind":"bug","property":"tar2","propertyName":"wings"},
                    {"kind":"bird","property":"tar1","propertyName":"tails"},
                    {"kind":"bird","property":"tar2","propertyName":"crests"}];


  var ntrials = 4

  exp.numTrials = ntrials//animalNames.length;

  var shuffledStims = _.shuffle(animalNames);



  exp.stims = _.map(_.zip(
      _.shuffle(prevlevObj).slice(0,ntrials),
      _.shuffle(propertyObj).slice(0,ntrials),
      _.shuffle(_.map(_.keys(colors), function(c){return {color: c}})).slice(0,ntrials),
      shuffledStims.slice(0,ntrials), 
      determiners.slice(0,ntrials),
      _.shuffle(propertySizes).slice(0,ntrials),
      // _.shuffle(stimproptypes),
      _.shuffle(conditions)
      ), function(lst){return _.extend(lst[0], lst[1], lst[2], lst[3], lst[4], lst[5], lst[6])})

  // console.log(exp.stims)

  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:

   // exp.structure=["i0",
   //                 exp.practiceinstructions,
   //                 exp.practice,
   //                 exp.instructions, 
   //                 exp.condition,  
   //                 "intermediate_motivation", 
   //                 exp.condition, 
   //                 "intermediate_motivation", 
   //                 exp.condition, 
   //                 "intermediate_motivation", 
   //                 exp.condition, 
   //                 'subj_info', 
   //                 'thanks'];
  exp.structure = ["i0","tc_instructions",'truth_conditions',"subj_info","thanks"];

  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  exp.go(); //show first slide
}