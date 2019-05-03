/**
* jspsych-button-stim
*
* Stephanie Campbell
*
* Plugin for Moral door-and-button version of the Kool 2-step task.
*
**/

(function($) {
  jsPsych["button-stim"] = (function() {
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
	trials[i].ITI = params.ITI || 500;
	trials[i].points_time = params.points_time || 1500;
	trials[i].state_name = params.state_name || 'green';
      }
      return trials;			
    };
		
    // if any trial variables are functions
    // evaluate function and replace it with the output of the function
    plugin.trial = function(display_element, trial) {
      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
						
      progress = jsPsych.progress();
      if (progress.current_trial_local == 0) {
	score = 0;
      }
			
      state_name = trial.state_name;
      //if (state_name == 'green') {var state_color = [24,123,48];}
      //if (state_name == 'yellow') {var state_color = [253,198,137];}
			
      // store responses
      var setTimeoutHandlers = [];		
      var keyboardListener = new Object;	
			
      // function to end trial when it is time
      var end_trial = function() {		
        kill_listeners();
        kill_timers();
								
        var handle_points = setTimeout(function() {
          display_element.html('');
          $('.jspsych-display-element').css('background-image', '');
	    
          // move on to the next trial
          var handle_ITI = setTimeout(function() {
            jsPsych.finishTrial();
	  }, trial.ITI);
	  setTimeoutHandlers.push(handle_ITI);
        }, trial.points_time);
        setTimeoutHandlers.push(handle_points);
      };

      // function to handle responses by the subject
      var after_response = function(info) {	
        kill_listeners();
        kill_timers();
								
        points = trial.rews;					

        // feedback
        display_stimuli(2); 
			    
        var handle_feedback = setTimeout(function() {
	  display_stimuli(3);
	  end_trial();
	}, trial.feedback_time);
	setTimeoutHandlers.push(handle_feedback);
      }								
	
      var display_stimuli = function(stage){
        kill_timers();
        kill_listeners();

        // display one button
        if (stage==1) { 

          display_element.html('');
          $('.jspsych-display-element').css('background-image', 'url("img/'+state_name+'_room.png")');	    
          display_element.append($('<div>', {id: 'jspsych-top-stim'}));						
	  display_element.append($('<div>', {style: 'clear:both'}));
	  display_element.append($('<div>', {
	    style: 'background-image: url(img/'+state_name+'_stim.png)',
	    id: 'jspsych-bottom-stim',
	  }));	

        }

	// choice stage	
	if (stage==2) {

          $('#jspsych-bottom-stim').addClass('jspsych-bottom-stim-border2');
	  //$('#jspsych-bottom-stim').css('border-color', 'rgba('+state_color[0]+','+state_color[1]+','+state_color[2]+', 1)');
	  $('#jspsych-bottom-stim').css('background-image', 'url(img/'+state_name+'_stim_deact.png)');

	}

	// feedback stage
	if (stage==3) {

	  display_element.html('');
	  $('.jspsych-display-element').css('background-image', 'url("img/white_room.png")');

	  if (points>2) {
            var shock = 3;
	  } else if (points>1) {
            var shock = 2;
	  } else if (points>0) {
	    var shock = 1;
	  } else {
	    var shock = 0;
	  }	    

	  $('.jspsych-display-element').css('background-image', 'url("img/'+shock+'_'+p_face+'.png")');
/*
          display_element.append($('<div>', {
	    style: 'background-image: url(img/'+shock+'_'+p_face+'.png)',
	    id: 'jspsych-top-stim',
	  }));
	  display_element.append($('<div>', {style: 'clear:both'}));
	  display_element.append($('<div>', {
	    style: 'background-image: url(img/shock_'+shock+'.png)',
	    id: 'jspsych-bottom-stim-middle',
	  }));
*/
	}	

      }
			
      var start_response_listener = function(){
	if(JSON.stringify(trial.choices) != JSON.stringify(["none"])){
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
	for (var i = 0; i < setTimeoutHandlers.length; i++){
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
	kill_timers();
	kill_listeners();
				
	display_stimuli(1);
							
	start_response_listener();
      }							
      next_part();
	    
    };		
    return plugin;
	
  })();
})(jQuery);
