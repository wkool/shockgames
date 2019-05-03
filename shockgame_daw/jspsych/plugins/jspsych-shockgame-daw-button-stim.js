/**
* jspsych-shockgame-daw-stim
* Wouter Kool & Stephanie Campbell
*
* plugin for displaying a practice phase for the moral version of the Daw model-based/model-free 2-step task
*
**/

(function($) {
	jsPsych["shockgame-daw-button-stim"] = (function() {

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
				trials[i].p = params.p;
								
				// timing parameters
				trials[i].feedback_time = params.feedback_time || 500;
				trials[i].ITI = params.ITI || 500;
				trials[i].points_time = params.points_time || 1000;
				trials[i].state_name = params.state_name || 'green';
				trials[i].points_loop_time = params.points_loop_time || 200;
				trials[i].score_time = params.score_time || 1000;
				trials[i].face = params.face;
			}
			return trials;
			
		};
		
		plugin.trial = function(display_element, trial) {
			
			// if any trial variables are functions
			// this evaluates the function and replaces
			// it with the output of the function
			
			trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
			
			if (Math.random()<0.5) { // left response
				position = 'left';
				other_position = 'right';
				choices = 'F';
			} else {
				position = 'right';
				other_position = 'left';
				choices = 'J';
			}
			
			state_name = trial.state_name;
			if (state_name == 'purple') {
				var state_color = [0, 0, 0];
			}
			if (state_name == 'red') {
				var state_color = [0, 0, 0];
			}
			var state_color = [0, 0, 0];

			face = trial.face;
		    
			// store responses
			var setTimeoutHandlers = [];
			
			var keyboardListener = new Object;	
			
			var show_points = 0;
						
			// function to end trial when it is time
			var end_trial = function() {
				
				kill_listeners();
				kill_timers();
				
				//jsPsych.data.write(trial_data);
				
				var handle_points = setTimeout(function() {
					// clear the display
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
				
				console.log(trial.p)
				win = Math.random()<trial.p;
				console.log(win)
								
				display_stimuli(2);
				var handle_feedback = setTimeout(function() {
					display_stimuli(3);
					var handle_score = setTimeout(function() {
						if (win==1) {
							show_points = 1;
						}
						display_stimuli(3);
						var handle_points = setTimeout(function() {
							end_trial();
						}, trial.points_time);
						setTimeoutHandlers.push(handle_points);
					}, trial.score_time);
					setTimeoutHandlers.push(handle_score);
				}, trial.feedback_time);
				setTimeoutHandlers.push(handle_feedback);
			}								
		
			
			var display_stimuli = function(stage){
				
				kill_timers();
				kill_listeners();
				
				//state_name = state_names[state];
				//state_color = state_colors[state];
				
				
				if (stage==1) { // choice stage
				
					display_element.html('');

					$('.jspsych-display-element').css('background-image', 'url("img/'+state_name+'_room.png")');				

					display_element.append($('<div>', {
						id: 'jspsych-shockgame-daw-top-stim-left',
					}));								
					display_element.append($('<div>', {
						id: 'jspsych-shockgame-daw-top-stim-middle',
					}));
					display_element.append($('<div>', {
						id: 'jspsych-shockgame-daw-top-stim-right',
					}));
				
					display_element.append($('<div>', {
						style: 'clear:both',
					}));
				
					display_element.append($('<div>', {
						id: 'jspsych-shockgame-daw-bottom-stim-left',
					}));
					display_element.append($('<div>', {
						id: 'jspsych-shockgame-daw-bottom-stim-middle',
					}));
					display_element.append($('<div>', {
						id: 'jspsych-shockgame-daw-bottom-stim-right',
					}));
					
					$('#jspsych-shockgame-daw-bottom-stim-'+position).css('background-image', 'url(img/'+state_name+'_stim_1.png)');
					$('#jspsych-shockgame-daw-bottom-stim-'+other_position).css('background-image', 'url(img/'+state_name+'_stim_2_deact.png)');
									
				}
				
				if (stage==2) { // feedback

					$('#jspsych-shockgame-daw-bottom-stim-'+position).css('background-image', 'url(img/'+state_name+'_stim_1_pressed.png)');
					$('#jspsych-shockgame-daw-bottom-stim-'+position).addClass('jspsych-shockgame-daw-bottom-stim-border');
					$('#jspsych-shockgame-daw-bottom-stim-'+position).css('border-color', 'rgba('+state_color[0]+','+state_color[1]+','+state_color[2]+', 1)');
				}
				
				if (stage==3) { // reward
					display_element.html('');
					$('.jspsych-display-element').css('background-image', 'url("img/start_room.png")');
			    

					if (win==0){

						display_element.append($('<div>', {
							style: 'background-image: url(img/0_8.png)',
							id: 'jspsych-shockgame-daw-middle-stim-middle',
						}));
					    
					} else {

						display_element.append($('<div>', {
							style: 'background-image: url(img/3_8.png)',
							id: 'jspsych-shockgame-daw-middle-stim-middle',
						}));
					    
					}
			    
				}
			}
			
			var start_response_listener = function(){
				if(JSON.stringify(trial.choices) != JSON.stringify(["none"])) {
					var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
						callback_function: after_response,
						valid_responses: choices,
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
				// kill keyboard listeners
				if(typeof keyboardListener !== 'undefined'){
					jsPsych.pluginAPI.cancelAllKeyboardResponses();
					//jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
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
