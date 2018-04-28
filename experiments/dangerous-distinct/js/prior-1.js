function make_slides(f) {
  var slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.instructions = slide({
    name : "instructions",     
    start: function() {
      $(".err").hide();
      $("#total-num").html(exp.nTrials);  
     },
    button : function() {
        exp.go();
    }
  });

  slides.instructions2 = slide({
    name : "instructions2",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    },
  });

  slides.instructions3 = slide({
    name : "instructions3",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });



  slides.memory_check = slide({
    name : "memory_check",
    start: function() {

     this.tested_properties = [
       "yellow legs", 
       "blue ears",
       "purple shells",
       "silver fur",
       "pink teeth"
     ]
     this.catch_properties = [
       "red arms",
       "purple eyes",
       "copper fingers",
       "golden tongues",
       "orange hooves"
     ]

     this.check_properties = _.shuffle(_.flatten([this.tested_properties, this.catch_properties]))

     // clear the former content of a given <div id="memory_checkboxes"></div>
     document.getElementById('memory_checkboxes').innerHTML = '';

     for (i=0;i<this.check_properties.length;i++){
       // create the necessary elements
       var label= document.createElement("label");
       var description = document.createTextNode(this.check_properties[i]);
       var checkbox = document.createElement("input");

       checkbox.type = "checkbox";    // make the element a checkbox
       checkbox.name = "slct1";      // give it a name we can check on the server side
       checkbox.value = this.check_properties[i];         // make its value "pair"

       label.appendChild(checkbox);   // add the box to the element
       label.appendChild(description);// add the description to the element

       // add the label element to your div
       document.getElementById('memory_checkboxes').appendChild(label);
       document.getElementById('memory_checkboxes').appendChild(document.createElement("br"));

     }
   },
    button : function() {
      var checked_options = new Array();
      var unchecked_options = new Array();

      $.each($("input[name='slct1']:checked"), function() {
        checked_options.push($(this).val());
      });

      $.each($("input[name='slct1']:not(:checked)"), function() {
        unchecked_options.push($(this).val());
      });

      for (i=0;i<this.check_properties.length;i++){
        var p = this.check_properties[i];
        var tested_on = this.tested_properties.indexOf(p) > -1 ? 1 : 0;
        var response = checked_options.indexOf(p) > -1 ? 1 : 0;
        exp.catch_trials.push({
          condition: "memory_check",
          check_index: i,
          property: p,
          tested_on: tested_on,
          response: response,
          correct: (tested_on == response) ? 1 : 0
        })
      }

      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });





  slides.is_present = slide({
    name: "is_present",

   // present : _.shuffle(_.range(numTrials)),
    present : exp.stims,
    trialNum : 1, 
    //this gets run only at the beginning of the block
    present_handle : function(stim) {
      // debugger;
      $("#is_present_response").val('')
      this.startTime = Date.now();
      $(".err").hide();

      this.stim =  stim; // allstims should be randomized, or stim_num should be

      this.base_property = stim.color + " " + stim.part
      if  (stim.context == "dangerous") {
         this.property = "dangerous " + this.base_property + " that " + stim.dangerfrag.slice(0, -1)
      } else if (stim.context == "distinctive") {
        this.property = "distinctive " + this.base_property + " that no other species on the island has"
      } else {
        this.property = this.base_property
      }


     // this.determiner = exp.determiner[0] // exp.determiner between-subjects var
      var existential_question = 'On the island, there are 1,000 different species of animals. <br><br> How many different species of animals do you think <br><em>have '+ this.property +'</em>?' 

      $(".question0").html(existential_question);

      // this.n_sliders = 1;

      // this.init_sliders(this.n_sliders);
      // exp.sliderPost = -99;
      // $(".slider_number").html("---")

    },

    // init_sliders : function(n_sliders) {

    //   utils.make_slider("#single_slider0", this.make_slider_callback(0), "horizontal", 0.001);
    // },
    // make_slider_callback : function(i) {
    //   return function(event, ui) {
    //     exp.sliderPost = ui.value;
    //     $(".slider_number").html(Math.round(exp.sliderPost*1000))
    //   };
    // },

    button : function() {
      var response = parseInt($("#is_present_response").val())
      if (isNaN(response) || (response < 0) || (response > 1000)) {
      // if (exp.sliderPost == -99) {
        $(".err").show();
      } else {
        this.response = response;
        this.rt = Date.now() - this.startTime;
        this.log_responses();
        _stream.apply(this);
      }
    },

    log_responses : function() {       
      exp.data_trials.push({
        "trial_type" : "num_categories",
        "trial_num": this.trialNum,
        "response" : this.response,
        "total_num_categories": 1000,
        "rt":this.rt,
        "property": this.base_property,
        "full_property": this.property,
        "property_type": this.stim.context
      });
      this.trialNum++
    }
  });


  slides.projectibility = slide({
    name: "projectibility",

   // present : _.shuffle(_.range(numTrials)),
    present : exp.stims2,
    trialNum : 1, 
    //this gets run only at the beginning of the block
    present_handle : function(stim) {
      // debugger;
      // console.log('enter projectibility')
      $("#projectibility_response").val('')
      this.startTime = Date.now();
      $(".err").hide();

      this.stim = stim; // allstims should be randomized, or stim_num should be

      this.base_property = stim.color + " " + stim.part

      context_adj = stim.context == "bare" ? "" : stim.context

      if  (stim.context == "dangerous") {
         this.property = "dangerous " + this.base_property + " that " + stim.dangerfrag.slice(0, -1)
      } else if (stim.context == "distinctive") {
        this.property = "distinctive " + this.base_property + " that no other animal on the island has"
      } else {
        this.property = this.base_property
      }

    question0 = "There is an animal on the island called " + stim.category + "." +
    "<br><br>For the first time today, scientists saw a " +stim.exemplar+ ". It had <em>" + this.property + "</em>." +
    "<br><br><strong>What percentage of "+stim.category+"</strong> do you think have this same kind of <em> " +
     context_adj + " "  + this.base_property  + "</em>?"

      $(".question0").html(question0);

    },


    button : function() {
      var response = parseInt($("#projectibility_response").val())
      // console.log(response)
      if (isNaN(response) || (response < 0) || (response > 100)) {
      // if (exp.sliderPost == -99) {
        $(".err").show();
      } else {
        this.response = response;
        this.rt = Date.now() - this.startTime;
        this.log_responses();
        _stream.apply(this);
      }
    },

    log_responses : function() {       
      exp.data_trials.push({
        "trial_type" : "projectibility",
        "trial_num": this.trialNum,
        "response" : this.response,
        "total_num_categories": 100,
        "rt":this.rt,
        "property": this.base_property,
        "full_property": this.property,
        "property_type": this.stim.context
      });
      this.trialNum++
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
      var ut_id = "mht-dangerous-20180427";
      if (UTWorkerLimitReached(ut_id)) {
        $('.slide').empty();
        repeatWorker = true;
        alert("You have already completed the maximum number of HITs allowed by this requester. Please click 'Return HIT' to avoid any impact on your approval rating.");
      }
  })();


  exp.trials = [];
  exp.catch_trials = [];

  exp.nTrials = _.flatten(allstims).length;


  var contexts = ["bare","dangerous","distinctive"];


  var stims_with_context =
    allstims.map(function (x) {
      var context_assign = _.shuffle(contexts);
      // console.log(x[0].category)
      x[0].context = context_assign[0];
      x0 = _.where(creatureNames, {category: x[0].category})[0]
      x[0].exemplar = x0.exemplar

      // console.log(x[1].category)

     // x[0].prevalence = exp.prev_levels[0]
      x[1].context = context_assign[1];
      x1 = _.where(creatureNames, {category: x[1].category})[0]
      x[1].exemplar = x1.exemplar

      // console.log(x[2].category)

      x[2].context = context_assign[2];
      x2 = _.where(creatureNames, {category: x[2].category})[0]
      x[2].exemplar = x2.exemplar
      return x;
      });

  exp.stims = _.shuffle(_.flatten(stims_with_context)); // shuffle stims

  exp.stims2 = exp.stims.slice(0)
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
   exp.structure=[
   "i0",
   "instructions",
   "instructions3",
   "is_present",
   "instructions2",
   "projectibility",
   "memory_check",
   'subj_info', 
   'thanks'
   ];
 
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