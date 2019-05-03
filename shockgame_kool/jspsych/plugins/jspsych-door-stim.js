/**
* jspsych-door-stim
*
* Stephanie Campbell
*
* Plugin for moral door-and-button version of the Kool 2-step task
*
**/

(function($) {
  jsPsych["door-stim"] = (function() {
    var plugin = {};

    var score = 0;
		
    var displayColor = '#0738db';
    var borderColor = '#197bff';
    var textColor = '#b8fff6';
		
    plugin.create = function(params) {
      params = jsPsych.pluginAPI.enforceArray(params, ['stimuli', 'choices']);
			
      var trials = new Array(params.nrtrials);
      for (var i = 0; i < trials.length; i++) {		
	trials[i] = {};
	trials[i].choices = params.choices || [];
	trials[i].rews = params.rews;
	trials[i].face = params.face; 
			
	// timing parameters
	trials[i].feedback_time = params.feedback_time || 500;
	trials[i].room_time = params.feedback_time || 2000;
	trials[i].ITI = params.ITI || 1000;
      }
      return trials;
    };

    // if any trial variables are functions
    // evaluate function and replace it with the output of the function
    plugin.trial = function(display_element, trial) {
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
			
      // store responses
      var setTimeoutHandlers = [];
			
      var keyboardListener = new Object;	

      var part = 0;
      var state = 0;
      var state_names = ["white","green","yellow"];
      //var state_colors = [[255,255,255], [24,123,48], [253,198,137]];
			
      var stimsperstate = [[1,2],[3,4]];
      var state1 = Math.ceil(Math.random()*2);
      var stims = shuffle(stimsperstate[state1-1]);
			
      var response = new Array(2);
      for (var i = 0; i < 2; i++) {	
        response[i] = {rt: -1, key: -1};
      }
			
      // function to end trial when it is time
      var end_trial = function() {
	kill_listeners();
	kill_timers();
				
	var trial_data = {
	  "state2": state2,
	};			
	jsPsych.data.write(trial_data);
				
	var handle_totalscore = setTimeout(function() {
	  display_element.html('');
	  $('.jspsych-display-element').css('background-image', '');
	    
	  // move on to the next trial
	  var handle_ITI = setTimeout(function() {
	    jsPsych.finishTrial();
	  }, trial.ITI);
	  setTimeoutHandlers.push(handle_ITI);
	}, trial.totalscore_time);
	setTimeoutHandlers.push(handle_totalscore);			
      };

      // function to handle responses by the subject
      var after_response = function(info) {
	kill_listeners();
	kill_timers();
								
	// only record the first response
	if (response[part].key == -1){
	  response[part] = info;
	}
				
	display_stimuli(2);
				
	if (String.fromCharCode(response[part].key)==trial.choices[0]) { // left response
	  choice1 = stims[0];
	} else { // right response
	  choice1 = stims[1];						
	}
	if ((choice1==1)||(choice1==3)) { // brown + green doors -> green room
	  state2 = 1;
	} else { // blue + red doors -> yellow room
	  state2 = 2;
	}					
	state = state2;
				
	var handle_feedback = setTimeout(function() {
	  part = part + 1;
	  display_stimuli(1);
	  var handle_room = setTimeout(function(){
	    end_trial();
	  }, trial.room_time);
	  setTimeoutHandlers.push(handle_room);
	}, trial.feedback_time);
	setTimeoutHandlers.push(handle_feedback);				
      };
	
      var display_stimuli = function(stage){
	kill_timers();
	kill_listeners();
				
	state_name = state_names[state];
	//state_color = state_colors[state];

	// display doors  
	if (stage==1) {

	  display_element.html('');
	  $('.jspsych-display-element').css('background-image', 'url("img/'+state_name+'_room.png")');
	  display_element.append($('<div>', {id: 'jspsych-top-stim'}));
	  display_element.append($('<div>', {style: 'clear:both'}));					
					
	  if (state==0) { // display two doors
	    display_element.append($('<div>', {
	      style: 'background-image: url(img/door_'+stims[0]+'.png)',
	      id: 'jspsych-bottom-stim-left',
	    }));
	    display_element.append($('<div>', {id: 'jspsych-bottom-stim-middle'}));
	    display_element.append($('<div>', {
	      style: 'background-image: url(img/door_'+stims[1]+'.png)',
	      id: 'jspsych-bottom-stim-right',
	    }));
	  }				
        }

	// choose one door
	if (stage==2) { 

	  if (state == 0) {
	    if (String.fromCharCode(response[part].key)==trial.choices[0]) { // choose left door
	      $('#jspsych-bottom-stim-left').addClass('jspsych-bottom-stim-border');
	      $('#jspsych-bottom-stim-left').css('background-image', 'url(img/door_'+stims[0]+'_deact.png)');
	    } else { // choose right door
	      $('#jspsych-bottom-stim-right').addClass('jspsych-bottom-stim-border');
              $('#jspsych-bottom-stim-right').css('background-image', 'url(img/door_'+stims[1]+'_deact.png)');
	    }
	  }

        }
	  
      }
			
      var start_response_listener = function(){
	if(JSON.stringify(trial.choices) != JSON.stringify(["none"])) {
	  var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
	    callback_function: after_response,
	    valid_responses: trial.choices,
	    rt_method: 'date',
	    persist: false,
	    allow_held_key: false
	  });
        }
      }
			
      var kill_timers = function(){
	for (var i = 0; i < setTimeoutHandlers.length; i++) {
	  clearTimeout(setTimeoutHandlers[i]);
	}
      }
			
      var kill_listeners = function(){
	if(typeof keyboardListener !== 'undefined'){
	  //jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
          jsPsych.pluginAPI.cancelAllKeyboardResponses();
	}
      }
			
      var next_part = function(){	
	part = part + 1;
				
	kill_timers();
	kill_listeners();
				
	display_stimuli(1);
				
	start_response_listener();
				
      };			
      next_part();
			
    };
    return plugin;

  })();
})(jQuery);
