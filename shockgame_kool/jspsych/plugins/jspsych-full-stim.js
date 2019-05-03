/**
* jspsych-full-stim
*
* Stephanie Campbell
*
* Plugin for moral door-and-button version of the Kool 2-step task.
*
**/

(function($) {
  	jsPsych["full-stim"] = (function() {
	    var plugin = {};
	      
	    var displayColor = '#0738db';
	    var borderColor = '#197bff';
	    var textColor = '#b8fff6';
	    
	    plugin.create = function(params) {
	      	params = jsPsych.pluginAPI.enforceArray(params, ['stimuli', 'choices']);  	
		
	      	var trials = new Array(params.nrtrials);
	      	for (var i = 0; i < trials.length; i++) {
				trials[i] = {};
				trials[i].practice = params.practice || 0;
				trials[i].rews = params.rews;
				trials[i].subid = params.subid;
				trials[i].face = params.face;
			    trials[i].color = params.color;
			    trials[i].index = i;
			    trials[i].num_trials = params.nrtrials;

				// timing parameters
				trials[i].feedback_time = params.feedback_time || 500;
				trials[i].ITI = params.ITI || 1000;
				trials[i].timeout_time = params.timeout_time || 1500;
				trials[i].timing_response = params.timing_response || 2000; 
				trials[i].score_time = params.score_time || 1500;
				trials[i].level2_time = params.level2_time || 1000;
				trials[i].totalscore_time = params.totalscore_time || 2000;		
	      	}
	      	return trials;			
	    };
			
	    // if any trial variables are functions
	    // evaluate function and replace it with the output of the function
	    plugin.trial = function(display_element, trial) {
	      	trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
							
			progress = jsPsych.progress();

			var stimsperstate = [[1,2], [3,4]];
			var state1 = Math.ceil(Math.random()*2);
			var stims = shuffle(stimsperstate[state1-1]);			

			var part = -1;
			var choice1 = -1;
			var state2 = -1;						
			var points = 0;
			var state = 0;	
			var timeouts = 0;
			var color = trial.color[0];
			var face = trial.face[0];

			if (trial.practice == 0) {
			  	var state_names = ["white","purple","red"];
				var state_colors = [[255,255,255], [24,123,48], [253,198,137]];  
			} else {
				var state_names = ["white","green","yellow"];
				var state_colors = [[255,255,255], [24,123,48], [253,198,137]];
			}
				
			// store responses
			var setTimeoutHandlers = [];
			var keyboardListener = new Object;	
				
			var response = new Array(2);
			for (var i = 0; i < 2; i++) {	
				response[i] = {rt: -1, key: -1};
			}

			var both_choices = [["F","J"],["space"]];
			var choices = new Array;
				
			// function to end trial when it is time
			var end_trial = function() {		
				kill_listeners();
				kill_timers();
		  
				// gather the data to store for the trial	
				var trial_data = {
					"subid": trial.subid,
					"timeouts": timeouts,
					"choice1": choice1,
					"practice": trial.practice, 
					"state1": state1, 
					"state2": state2,
					"stim_left": stims[0], 
					"stim_right": stims[1],
					"rt_1": response[0].rt, 
					"rt_2": response[1].rt, 
					"rews1": trial.rews[0], 
					"rews2": trial.rews[1],
					"color": color,
					"face": face
				};		
				//console.log(trial_data);
				jsPsych.data.write(trial_data);
		        //save_data(trial_data,"shock_game_data");
			  
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
												
				if (state==0) {
				  	if (String.fromCharCode(response[part].key)==choices[0]) { // left response
					    choice1 = stims[0];
				  	} else { // right response
					    choice1 = stims[1];			
				  	}		    
			        
			        if ((choice1==1)||(choice1==3)) { // brown + green doors -> green/purple room
			            if (color == 1) {
			              	state2 = 1;
			            } else {
			              	state2 = 2;
			            }
				  	} else { // blue + red doors -> yellow/red room
				    	if (color == 1) {
			              	state2 = 2;
			            } else {
			              	state2 = 1;
			            }
				 	}					
				  	state = state2;
								
					var handle_feedback = setTimeout(function() { 
					    display_element.html('');
						next_part();		
					}, trial.feedback_time);
					setTimeoutHandlers.push(handle_feedback);
								
				} else {		
				  	points = trial.rews[state-1]; /* TODO!!!!!! */

				  	display_stimuli(2);

					var handle_feedback = setTimeout(function() {
						display_stimuli(3);
						end_trial();
					}, trial.feedback_time);
					setTimeoutHandlers.push(handle_feedback);
				}							
	      	};	  
		  
	      	var display_stimuli = function(stage){		
				kill_timers();
				kill_listeners();
					
				state_name = state_names[state];
				//state_color = state_colors[state];

				// timeout stage
				if (stage==-1) {

				  	display_element.html('');
				  	$('.jspsych-display-element').css('background-image', 'url("img/white_room.png")');

				  	display_element.append($('<div>', {
			            html: ('<b>Remember: </b>You only have <b>2 seconds</b> to make your selection!'),
			            id: 'jspsych-top-rewards-text',
			        }));
			           
			        $('.jspsych-display-element').css('background-image', 'url("img/3_'+face+'.png")');
				}
		
				// display doors or button stage
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
				  	} else { // display one button
				    	display_element.append($('<div>', {
				      		style: 'background-image: url(img/'+state_name+'_stim.png)',
				      		id: 'jspsych-bottom-stim',
				   	 	}));
				  	}		

				}

				// choice stage
				if (stage==2) {

				  	if (state == 0) {
				    	if (String.fromCharCode(response[part].key)==choices[0]) { // choose left door
				      		$('#jspsych-bottom-stim-left').addClass('jspsych-bottom-stim-border');
				      		$('#jspsych-bottom-stim-left').css('background-image', 'url(img/door_'+stims[0]+'_deact.png)');
				    	} else { // choose right door
				      		$('#jspsych-bottom-stim-right').addClass('jspsych-bottom-stim-border');
				      		$('#jspsych-bottom-stim-right').css('background-image', 'url(img/door_'+stims[1]+'_deact.png)');
				    	}
				  	} else { // press button
			            $('#jspsych-bottom-stim').addClass('jspsych-bottom-stim-border2');
				    	$('#jspsych-bottom-stim').css('background-image', 'url(img/'+state_name+'_stim_deact.png)');
				  	}

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
				    
			        //display_element.append($('<div>', {style: 'clear:both'}));
			        $('.jspsych-display-element').css('background-image', 'url("img/'+shock+'_'+face+'.png")');
				}

	      	}
				
	      	var start_response_listener = function(){
				if (part == 0) {
				  	choices = both_choices[0]; //F,J
				} else {
				  	choices = both_choices[1]; //space
				}
				if(JSON.stringify(choices) != JSON.stringify(["none"])) {
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
				if(typeof keyboardListener !== 'undefined'){
					jsPsych.pluginAPI.cancelAllKeyboardResponses();	
				}
			}
				
	      	var next_part = function(){	
				part++;
					
				kill_timers();
				kill_listeners();
							
				display_stimuli(1);	
				start_response_listener();
				
				if (trial.timing_response > 0) { //timeout
				  	var handle_response = setTimeout(function() {
				    	kill_listeners();
				    	display_stimuli(-1);
			            timeouts++;

				    	var handle_timeout = setTimeout(function() {
				      		end_trial();
				    	}, trial.timeout_time);
				    	setTimeoutHandlers.push(handle_timeout);

				  	}, trial.timing_response);
				  	setTimeoutHandlers.push(handle_response);
				}
		
		    }
		    next_part();
		    /*if ((trial.index+1)!=trial.num_trials){
	      		next_part();
	      	} else {
				display_element.html('');
				next_part();
			}*/
				
	    };
	    return plugin;

	
  	})();
})(jQuery);
