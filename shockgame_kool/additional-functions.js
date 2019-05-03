/*-------------------------Instructions Text-------------------------*/

var instructions_1a_text = function(){
    var instructions = [			
	"<div align=center><b>Please read all following instructions very carefully.</b</div>",
	"<div align=center>In this game, there are <b>four doors</b> and <b>two rooms</b>. Two doors lead to one room, and two doors lead to the other room. On each trial, two doors will appear and you will have to choose one of the two.<br><br>You will choose the door that appears on the left by pressing the <b>'F'</b> key and the door on the right by pressing the <b>'J'</b> key.<br><br><b>Note:</b> Please make sure to use a computer with a functional keyboard for this game.<br><br>These are the 4 possible doors you will see:<br><br><img style='margin:0px auto;display:block;height:142px' src='img/example_doors.png'/></div>", 
	"<div align=center>Once you select a door, you will see it open into a room with a single button. You must activate the button you find by pressing the <b>SPACE</b> key.<br><br>Each button inflicts shocks of varying intensities to the other person. The four different intensities of shock used in this task are <b>no, low, medium, and high shock.</b><br><br>Below, there are two example buttons we will use for practice. Remember, there is <b>only one button per room</b>.<br><img style='margin:0px auto;display:block;height:150px' src='img/example_buttons.png'/></div>",
	"<div align=center>Once you press the button, you will see the intensity of the shock that the button delivered to the person in the room. The severity of the shock will be represented by the number of lightning bolts shown. In the case that no shock is delivered, you will see an empty circle.<br><br>In addition, you will also be shown the facial reaction of the person in the room.<br><br><img style='margin:0px auto;display:block;height:600px' src='img/example_shocks.png'/></div>",
	"<div align=center>For all the buttons, the four intensities of pain inflicted will always be: no, low, medium, and high shock. However, note that for a particular button, the degree will vary slightly throughout the game. So, if you wish to minimize the shock delivered, you will have to focus and find the button with the lowest shock at each point in time.</div>",
	"<div align=center>Now, it's your turn to practice activating a sample button a few times by pressing the <b>SPACE</b> key. To begin, press the next button.</div>"
    ];
    return instructions
};

var instructions_1b_text = function(){
    var instructions = ["<div align=center>You may have noticed that this button exerted shocks that started out with low intensity, and then increased in intensity over time.<br><br>Each of the buttons will exert shocks that slowly change across trials. To see this, you are going to try <b>activating a second sample button</b> a few times by pressing the <b>SPACE</b> key. </div>"];
    return instructions
};

var instructions_1c_text = function(){
    var instructions = [
	"<div align=center>Great! Now you know how to activate buttons and have learned how buttons deliver varying degree of shock that change over the course of the game.</div>",
	"<div align=center>Next, you will learn how to <b>choose a door</b> from the two doors presented at each trial. As a reminder, you can choose the left door by pressing the <b>'F'</b> key and the right door by pressing the <b>'J'</b> key.<br><br>For these next few practice trials, once you select a door, it will open to either a green room or a yellow room. For now, since you are just learning to open doors, the button and the face will <b>NOT</b> appear.<br><br><img style='margin:0px auto;display:block;height:300px' src='img/example_rooms.png'/><br><br></div>",
	"<div align=center>Let's practice entering the rooms!<br><br>First, try to pick the doors that will get you to the <b>green room</b>:<br><br><img style='margin:0px auto;display:block;height:500px' src='img/green_room.png'/></div>"
    ];
    return instructions
};

var instructions_1d_text = function(){
    var instructions = ["<div align=center>Very good!<br><br>Now, try to pick the doors that will get you to the <b>yellow room</b>:<br><br><br><img style='margin:0px auto;display:block;height:500px' src='img/yellow_room.png'/></div>"];
    return instructions
};

var instructions_1e_text = function(){
    var instructions = [
	"<div align=center>You've learned that the blue door and red door open to the <b>yellow room</b>, while the brown door and green door open to the <b>green room</b>.<br><br><img style='margin:0px auto;display:block;height:400px' src='img/example_outcome.png'/>Now that you know how to choose doors and activate buttons, you are ready for the final step of this practice phase. You will put together everything you've learned so far to practice the game in its <b>full form</b>.</div>", 
        "<div align=center>In this experiment, imagine you are working with another person. Unfortunately, this person is connected to a shock-generating machine, which exerts varying degrees of painful shocks depending on the button used to activate the machine.<br><br>You can't control the fact that the other person will be shocked by the machine, but if you would like to minimize the intensity of the painful shocks on any given trial, you can learn a sequences of actions to select the door that leads to a room with a button that delivers the minimum amount of shocks.</div>",
	"<div align=center><b>Hint #1:</b><br>Remember which buttons correspond to each level of shock. How good a room is (in terms of shock delivered) changes slowly, so a button with low shock now will probably have low shock in the near future.<br><br><b>Hint #2:</b><br>Each button delivers independently varying intensities of shock. Just because one button has a high shock level, does not mean another has a low shock level.<br><br><b>Hint #3:</b><br>The door you choose is important because often the button in one room is better than the button in another room. You can find lower shocks by finding the door that takes you to the right room.</div>",
	"<div align=center>Our advice is to think carefully about your strategy, but also to trust your instincts.<br><br>First, you will do <b>15 practice trials</b>. These don't count, and they have no time limit in order to help you learn. </div>"
    ];
    return instructions
};

var instructions_2_text = function(){
    var instructions_2 = [
	"<div align=center>Ok, you've finished the practice trials. In the real game, you will find <b>new rooms with new buttons</b>, and a <b>new person</b> experiencing the shocks. The new rooms and buttons will now be red and purple (instead of green and yellow). However, the doors will be the same.<br><br>Remember, the amount of shock applied by each button may change slowly over time, so you need to concentrate and be flexible to keep track of which doors and buttons exert the lowest amount of shock right now.</div>",
    "<div align=center>The game lasts for <b>125 trials</b> and you will have <b>2 seconds</b> for each choice. If you don't choose a door or press the button each within 2 seconds, then the person will automatically receive the maximum shock. At the beginning, 2 seconds won't seem like very much time and you may find the task difficult. Over time, as you learn to play, you will find that 2 seconds is enough time to make good decisions.<br><br>This final section takes most people about <b>20 minutes</b>. Good luck!</div>"
    ];
    return instructions_2
}

var reminder_1_block_text = function(){
    var text = ["<div class='center-content'><br><br>Just as a reminder, pick the doors that get you to the green state.<br><br><img style='margin:0px auto;display:block;height:400px' src='img/green_room.png'/><br><br>Press any key to begin.</div>"];
    return text
};

var reminder_2_block_text = function(){
    var text = ["<div class='center-content'><br><br>Just as a reminder, pick the doors that get you to the yellow state.<br><br><img style='margin:0px auto;display:block;height:400px' src='img/yellow_room.png'/><br><br>Press any key to begin.</div>"];
    return text
};

	
/*------------------------- Distribution Functions -------------------------*/

function createMemberInNormalDistribution(mean,std_dev){
	return mean + (gaussRandom()*std_dev);
}
/*
* Returns random number in normal distribution centering on 0.
* ~95% of numbers returned should fall between -2 and 2
*/
function gaussRandom() {
	var u = 2*Math.random()-1;
	var v = 2*Math.random()-1;
	var r = u*u + v*v;
	/*if outside interval [0,1] start over*/
	if(r == 0 || r > 1) return gaussRandom();

	var c = Math.sqrt(-2*Math.log(r)/r);
	return u*c;
}

function shuffle(o){
	for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}

/*------------------------- Images -------------------------*/

var images = [
  
'img/door_1.png','img/door_2.png','img/door_3.png','img/door_4.png',
'img/door_1_deact.png','img/door_2_deact.png','img/door_3_deact.png','img/door_4_deact.png',

'img/white_room.png',
'img/red_room.png','img/red_stim.png','img/red_stim_deact.png',
'img/purple_room.png','img/purple_stim.png','img/purple_stim_deact.png',
'img/green_room.png','img/green_stim.png','img/green_stim_deact.png',
'img/yellow_room.png','img/yellow_stim.png','img/yellow_stim_deact.png',

'img/0_1.png','img/1_1.png','img/2_1.png','img/3_1.png',
'img/0_2.png','img/1_2.png','img/2_2.png','img/3_2.png',
'img/0_3.png','img/1_3.png','img/2_3.png','img/3_3.png',
'img/0_4.png','img/1_4.png','img/2_4.png','img/3_4.png',
'img/0_5.png','img/1_5.png','img/2_5.png','img/3_5.png',
'img/0_6.png','img/1_6.png','img/2_6.png','img/3_6.png',
'img/0_7.png','img/1_7.png','img/2_7.png','img/3_7.png',
'img/0_8.png','img/1_8.png','img/2_8.png','img/3_8.png',
	      
'img/shock_0.png','img/shock_1.png','img/shock_2.png','img/shock_3.png',

'img/example_buttons.png','img/example_rooms.png','img/example_doors.png',
'img/example_shocks.png', 'img/example_outcome.png'	      
	      
];

/*------------------------- Save Data -------------------------*/

function save_data(data, table_name){
 
  for (i = 0; i < data.length; i++) {
    delete data[i].internal_chunk_id;
    delete data[i].trial_index_global;
    delete data[i].trial_type;
  }
		
  $.ajax({
    type:'post',
    cache: false,
    url: 'savedata.php', 
    data: {
      table: table_name,
      json: JSON.stringify(data)
    },
    success: function(){
	console.log(data);	  
    }
  });

};

/*
$.post("/scripts/latest/save.php", {
    subid : subid,
    studyName: study,
    toWrite : data
});

var data = jsPsych.data.getDataAsCSV({
    practice: 1, //practice
})`
*/
