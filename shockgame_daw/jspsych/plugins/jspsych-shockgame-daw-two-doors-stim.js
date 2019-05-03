/**
* jspsych-shockgame-daw-two-doors-stim
* Wouter Kool & Stephanie Campbell
*
* plugin for displaying a practice phase for the moral version of the Daw model-based/model-free 2-step task
*
**/

(function($) {
	jsPsych["shockgame-daw-two-doors-stim"] = (function() {

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
				trials[i].choices = params.choices || ["F","J"];
				trials[i].ps = params.ps;
								
				// timing parameters
				trials[i].feedback_time = params.feedback_time || 500;
				trials[i].ITI = params.ITI || 500;
				trials[i].points_time = params.points_time || 1000;
				trials[i].points_loop_time = params.points_loop_time || 200;
				trials[i].score_time = params.score_time || 1000;
			}
			return trials;
			
		};

		
		plugin.trial = function(display_element, trial) {
			
			trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
			
			// 2 is green door; 1 is brown door.
			// green door usually leads to yellow room.
			var state_name;
			var state_color;

			doors = shuffle([1,2]);

			stim_choice = -1;
			
			// store responses
			var setTimeoutHandlers = [];
			
			var keyboardListener = new Object;	
			
			var show_points = 0;
			
			var position = '';
			var pos = -1;

			var match = 0;

						
			// function to end trial when it is time
			var end_trial = function() {
				
				kill_listeners();
				kill_timers();
								
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
				
				if (String.fromCharCode(info.key)==trial.choices[0]) { // left response
					position = 'left';
					pos = 0;
					other_position = 'right';
					other_pos = 1;
					stim_choice = doors[0];
				} else {
					position = 'right';
					pos = 1;
					other_position = 'left';
					other_pos = 0;
					stim_choice = doors[1];
				}

				if (Math.random() > 0.3){
					match = 1;
				} else {
					match = 0;
				}	

				display_stimuli(2);

				var handle_feedback = setTimeout(function() {
					display_stimuli(3);
					var handle_score = setTimeout(function() {
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

					
				if (stage==1) { // choice stage
					
					display_element.html('');
					$('.jspsych-display-element').css('background-image', 'url("img/start_room.png")');				

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
						
					$('#jspsych-shockgame-daw-bottom-stim-left').css('background-image', 'url(img/start_stim_'+doors[0]+'.png)');
					$('#jspsych-shockgame-daw-bottom-stim-right').css('background-image', 'url(img/start_stim_'+doors[1]+'.png)');
										
				}
					
				if (stage==2) { // feedback

				    $('#jspsych-shockgame-daw-bottom-stim-'+position).addClass('jspsych-shockgame-daw-bottom-stim-border');
				    $('#jspsych-shockgame-daw-bottom-stim-'+position).css('background-image', 'url(img/start_stim_'+doors[pos]+'_pressed.png)');
				    $('#jspsych-shockgame-daw-bottom-stim-'+other_position).css('background-image', 'url(img/start_stim_'+doors[other_pos]+'_deact.png)');
				
				}
					
				if (stage==3) { // reward

					display_element.html('');

					if (stim_choice == 1){ // brown door 

						if (match == 1){ 
							$('.jspsych-display-element').css('background-image', 'url("img/green_room.png")');	
						} else {
							$('.jspsych-display-element').css('background-image', 'url("img/yellow_room.png")');	
						}			
		
					} else { // green door 
						
						if (match == 1){ 
							$('.jspsych-display-element').css('background-image', 'url("img/yellow_room.png")');	
						} else {
							$('.jspsych-display-element').css('background-image', 'url("img/green_room.png")');	
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
