/**
* jspsych-shockgame-daw-stim
* Wouter Kool & Stephanie cambell
*
* plugin for displaying a moral version of the Daw model-based/model-free 2-step task
*
**/

(function($) {
	jsPsych["shockgame-daw-stim"] = (function() {

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
				trials[i].practice = params.practice || 0;
				trials[i].ps = params.ps;
				trials[i].subid = params.subid;
				trials[i].index = i;
				trials[i].trialsperblock = params.trialsperblock;
				trials[i].nrblocks = params.nrblocks;
				
				// timing parameters
				trials[i].feedback_time = params.feedback_time || 500;
				trials[i].ITI = params.ITI || 500;
				trials[i].timeout_time = params.timeout_time || 1500;
				trials[i].timing_response = params.timing_response || 1500; // if -1, then wait for response forever
				trials[i].score_time = params.score_time || 1500;
				trials[i].totalscore_time = params.totalscore_time || 1000;
				trials[i].SOA = params.SOA || 500;
				trials[i].points_time = params.points_time || 200;
				trials[i].face = params.face;
			}
			return trials;
			
		};
		

		plugin.trial = function(display_element, trial) {
			
		    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

		    face = trial.face
			
			progress = jsPsych.progress();
			if (progress.current_trial_local == 0) {
				score = 0;
			}
			
			var state1stims = [1,2];
			var stims_s1 = shuffle(state1stims);
			var state2stims = [1,2];
			var stims_s2 = shuffle(state2stims);
			var stims = stims_s1;
			
			var part = -1;
			var choice1 = -1;
			var choice2 = -1;
			var state2 = -1;
			var win = 0;
		    
			var show_points = 0;
						
			var pause = 0;
			
			var state_names = ["start","purple","red"]; 
			var state_color = [0,0,0];

			var state = 0;
			
			var both_choices = [["F","J"],["F","J"]];
			var choices = new Array;

			// store responses
			var setTimeoutHandlers = [];
			
			var keyboardListener = new Object;	
			
			var response = new Array(2);
			for (var i = 0; i < 2; i++) {	
				response[i] = {rt: -1, key: -1};
			}
						
			// function to end trial when it is time
			var end_trial = function(){
				
				kill_listeners();
				kill_timers();
								
				// gather the data to store for the trial	
				var trial_data = {
					"subid": trial.subid,
					"stim_s1_left": stims_s1[0],
					"stim_s1_right": stims_s1[1],
					"rt_1": response[0].rt,
					"choice1": choice1,
					"response1": response[0].key,
					"stim_s2_left": stims_s2[0],
					"stim_s2_right": stims_s2[1],
					"rt_2": response[1].rt,
					"choice2": choice2,
					"response2": response[1].key,
					"win": win,
					"state2": state2,
					"score": score,
					"practice": trial.practice,
					"ps1a1": trial.ps[0][0],
					"ps1a2": trial.ps[0][1],
					"ps2a1": trial.ps[1][0],
					"ps2a2": trial.ps[1][1],
					//"face": trial.face
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
			var after_response = function(info){
				
				kill_listeners();
				kill_timers();
				
				if (pause == 0) {		
					if (response[part].key == -1){ // only record the first response
						response[part] = info;
					}
					display_stimuli(2); //feedback
				
					if (trial.timing_response>0) {
						var extra_time = trial.timing_response-response[part].rt;
					} else {
						var extra_time = 0;
					}

					if (state == 0) {
						if (String.fromCharCode(response[part].key)==choices[0]) { // left response
							choice1 = stims_s1[0];
						} else {
							choice1 = stims_s1[1];						
						}
						
						state2 = choice1+((Math.random()>0.7)*(choice1==1))-((Math.random()>0.7)*(choice1==2));
						stims = stims_s2;
						state = state2;
					
						var handle_feedback = setTimeout(function() {
							display_element.html('');
							next_part();
						}, trial.feedback_time+extra_time);
						setTimeoutHandlers.push(handle_feedback);
					
					} else {
						if (String.fromCharCode(response[part].key)==choices[0]) { // left response
							choice2 = stims_s2[0];
						} else {
							choice2 = stims_s2[1];						
						}
						
						win = Math.random()<trial.ps[state-1][choice2-1];
						score = score + win;
						
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
						}, trial.feedback_time+extra_time);
						setTimeoutHandlers.push(handle_feedback);
					}			
		
				}
				else {
					pause = 0;
					display_element.html('');
					var handle_pause = setTimeout(function() {
						next_part();
					}, trial.multiplier_time);
					setTimeoutHandlers.push(handle_pause);
				}
								
			};
			

			var display_stimuli = function(stage){
				
				kill_timers();
				kill_listeners();
				
				state_name = state_names[state];
				
				if (stage==-1) { // timeout	at first level
					display_element.html('');
					display_element.append($('<div>', {
            			html: ('<b>Remember: </b>You only have <b>2 seconds</b> to make your selection!'),
            			id: 'jspsych-top-rewards-text',
          			}));
          			display_element.append($('<div>', {style: 'clear:both'}));	 
          			$('.jspsych-display-element').css('background-image', 'url("img/3_'+face+'.png")');
				}
				
				if ((stage == 0.5) || (stage == 0.75)) { // scoreboard
					display_element.html('');
					$('.jspsych-display-element').css('background-image', 'url("img/'+state_name+'_room.png")');
				}
				
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
						
					$('#jspsych-shockgame-daw-bottom-stim-left').css('background-image', 'url(img/'+state_name+'_stim_'+stims[0]+'.png)');
					$('#jspsych-shockgame-daw-bottom-stim-right').css('background-image', 'url(img/'+state_name+'_stim_'+stims[1]+'.png)');
				}
				
				if (stage==2) { // feedback
					if (String.fromCharCode(response[part].key)==choices[0]) { // left response
						$('#jspsych-shockgame-daw-bottom-stim-right').css('background-image', 'url(img/'+state_name+'_stim_'+stims[1]+'_deact.png)');
						$('#jspsych-shockgame-daw-bottom-stim-left').addClass('jspsych-shockgame-daw-bottom-stim-border');
					        $('#jspsych-shockgame-daw-bottom-stim-left').css('border-color', 'rgba('+state_color[0]+','+state_color[1]+','+state_color[2]+', 1)');
					        $('#jspsych-shockgame-daw-bottom-stim-left').css('background-image', 'url(img/'+state_name+'_stim_'+stims[0]+'_pressed.png)');
					} else {
						$('#jspsych-shockgame-daw-bottom-stim-left').css('background-image', 'url(img/'+state_name+'_stim_'+stims[0]+'_deact.png)');
						$('#jspsych-shockgame-daw-bottom-stim-right').css('border-color', 'rgba('+state_color[0]+','+state_color[1]+','+state_color[2]+', 1)');
					        $('#jspsych-shockgame-daw-bottom-stim-right').addClass('jspsych-shockgame-daw-bottom-stim-border');
					        $('#jspsych-shockgame-daw-bottom-stim-right').css('background-image', 'url(img/'+state_name+'_stim_'+stims[1]+'_pressed.png)');

					}					
				}
				
				if (stage==3) { // reward
				    display_element.html('');

				    if (win==1) { //if win is false
				    	$('.jspsych-display-element').css('background-image', 'url("img/0_'+face+'.png")');
					} else {
						$('.jspsych-display-element').css('background-image', 'url("img/3_'+face+'.png")');
					}	
				}
	
			}
			
			
			var start_response_listener = function(){
				
				if (pause == 0) {
					if (part == 0) {
						choices = both_choices[0];
					} else {
						choices = both_choices[1];
					}
				} else {
					choices = ["space"];
				}
								
				if(JSON.stringify(choices) != JSON.stringify(["none"])) {
					var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
						callback_function: after_response,
						valid_responses: choices,
						rt_method: 'date',
						persist: false,
						allow_held_key: false,
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
				
				part = part + 1;
				
				kill_timers();
				kill_listeners();
				
				if (part == 0) {
					display_stimuli(0.5);	
					var SOA = trial.SOA;
				} else {
					var SOA = 0;
				}
					
				var handle_soa = setTimeout(function() {
					display_stimuli(1);
					start_response_listener();
							
					if (trial.timing_response>0) {	
						var handle_response = setTimeout(function() {
							kill_listeners();
							display_stimuli(-1);
							var handle_timeout = setTimeout(function() {
								end_trial();
							}, trial.timeout_time);
							setTimeoutHandlers.push(handle_timeout);
						}, trial.timing_response);
						setTimeoutHandlers.push(handle_response);
					}
				}, SOA);
				setTimeoutHandlers.push(handle_soa);
				
			}			
									
			if ((trial.practice==1)||(trial.index==0)||(trial.index%trial.trialsperblock != 0)){
				next_part();
			} else {
				pause = 1;
				display_element.html('');
				display_element.append($('<div>', {
					html: 'You completed block '+((trial.index)/trial.trialsperblock)+'/'+trial.nrblocks+'. You can take a break now.<br><br>Press space to continue.',
				}));
				start_response_listener();
			}
			
		};
		
		return plugin;
		
	})();
})(jQuery);
