//list of all character all can win DONT CHANGE HEALTH OR ATTACK VALUES!!!!
var charList = [
	["korben",10,"korben-dallas.jpg","namw1.wmv", 120,"Korben Dallas"],
	["leeloo",20,"leeloo.jpg","namw2.wmv", 90, "Leeloo"],
	["ruby",15,"ruby-rhod.jpg","namw3.wmv", 150, "Ruby Rhod"],
	["zorg",5,"zorg.jpg","zorg.wav",160, "Zorg"]
	];
var nameList =[];
var user;
var defender;
var charClass = "charClass";
function charConstuct(list){
	//creates all the objects for the character
	for (var i = 0; i < list.length; i++) {
		window[list[i][0]] = new char(list[i][0],list[i][1],list[i][2],list[i][3],list[i][4],list[i][5]);
		nameList.push(list[i][0]);
	}
	//adds click listener
	for (var i = 0; i < nameList.length; i++) {
		window[nameList[i]].create();
		$(window[nameList[i]].id).on("click",userClick.bind(window[nameList[i]]));
	};
};
function defenderClick(){
	//sets defender and removes from list
	this.delete();
	this.defenderArea();
	//sets as the defender
	defender = this;
	//removes from namList
	let index = nameList.indexOf(this.name);
	nameList.splice(index, 1);
	//removes other click listners
	for (var i = 0; i < nameList.length; i++) {
		let item = window[nameList[i]];
		$(item.id).unbind("click");
	};
	// add fight button click listener
	$("#fightButton").on("click", function(){
		user.attack(defender);
	});
};

function userClick(){
	//must be called with a bind() for this to work
	//removes clicked character frm nameList and sets it user to True
	this.sound.play();
	$(this.id).unbind();
	let index = nameList.indexOf(this.name);
	user = this;
	nameList.splice(index,1);
	//deletes other character boxs
	for (var i = 0; i < nameList.length; i++) {
		let item = window[nameList[i]];
		item.delete();
		item.enemyArea();
		//move nect one clicked to defender and removes click listener from other 2
		$(item.id).on("click", defenderClick.bind(item));
	}
	};
function restartButton(){
	let button = $("<button>");
	button.html("Restart");
	button.attr("type", "button");
	button.attr("id", "restartButton");
	$("#attackArea").append(button);
	$("#restartButton").on("click", function(){
		charConstuct(charList);
		$("#gameLog").html("");
		$(this).unbind();
		$(this).remove();
	});
}

function gameWin(){
	$("#fightButton").unbind();
	defender.delete();
	user.delete();
	restartButton();
	$("#gameLog").html("You win press restart to play agian");
}
function gameLose(){
	$("#fightButton").unbind();
	user.delete();
	defender.delete();
	for (var i = 0; i < nameList.length; i++) {
		window[nameList[i]].delete();
	}
	nameList = [];
	restartButton();
	$("#gameLog").html("You lose better luck next time. press resrat to try agian")
}
function compKilled(target){
	//deletes defender when dies and re calls defenderClick on other remaining emenys
	target.delete();
	$("#gameLog").html($("#gameLog").html()+"<p>You Killed "+target.displayName+"</p>");
	$("#fightButton").unbind("click")
	for (var i = 0; i < nameList.length; i++) {
		let item = window[nameList[i]];
		$(item.id).on("click", defenderClick.bind(item));
	}
}
function combatCheck(player, target){
	//checks for win or loss
	if(player.health <= 0){
		gameLose();
	}
	else if(target.health <= 0){
		if(nameList.length === 0){
			gameWin();
			return
		}
		compKilled(target);
	}

}
var create = function(){
	//create the box with the image and name for the char object
	var item =$("<div>");
	//gives it id based on its name
	item.attr("id", this.name);
	//adds image with charImg class
	item.append($("<img>").attr("src",this.img).addClass("charImg"));
	//adds own class and general charClass
	item.addClass(this.class+ " "+charClass);
	//adds name
	item.append($("<h2>").addClass("charName").html(this.displayName))
	//add health info and ids to update it
	item.append($("<h2>").addClass("health").html("Health:")
		.append($("<div>").attr("id",this.name+"Health").html(this.health)));
	//adds attack info and ids to change it
	item.append($("<h2>").addClass("attack").html("attack:")
		.append($("<div>").attr("id",this.name+"Damage").html(this.damage)));
	$(this.location).append(item);
};
var objDelete =  function(){
	//gets rid of the box with image and nae for char object;
	$(this.id).remove();
};
var enemyArea = function(){
		this.location = "#enemyArea";
		this.create();
		$(this.id).removeClass(this.class);
		this.class = "enemyStyle";
		$(this.id).addClass(this.class);
	};
var defenderArea = function(){
	this.location = "#defenderArea"
	this.create();
	$(this.id).removeClass(this.class);
	this.class = "defenderChoice";
	$(this.id).addClass(this.class);
};
var attack = function(target){
	//applys damage
	$("#gameLog").html(
		"<p>You attacked "+target.displayName+" for "+this.damage+" damage</p>"
		);
	target.health -= this.damage;
	this.damage += this.attackIncrease;
	//checks if emeny died and returns
	if(target.health <= 0){
		combatCheck(this, target);
		this.updateStats();
		return
	}
	$("#gameLog").html(
		$("#gameLog").html()+"<p>"+target.displayName+" attacked you for "+target.damage+" dameage</p>"
		);
	//applys counter attack if enemy lives
	this.health -= target.damage;
	this.updateStats();
	target.updateStats();
	combatCheck(this, target);
};
var updateStats = function(){
	$(this.id+"Health").html(this.health);
	$(this.id+"Damage").html(this.damage);
};
function char(name, damage, img, sound, health, displayName){
	//object constructor
	this.name = name
	this.displayName =displayName;
	this.damage = damage;
	this.attackIncrease =damage;
	this.health = health
	this.img = "assets/images/"+img;
	this.sound = new Audio("assets/sounds/"+sound);
	this.location = "#userArea";
	this.class = "userChoice";
	this.id = "#"+name;
	this.create = create;
	this.delete = objDelete;
	this.attack = attack;
	this.enemyArea = enemyArea;
	this.defenderArea =defenderArea;
	this.updateStats = updateStats;
};
	charConstuct(charList);
	

/*
obj{
	name
	damage 
	attackIncrease
	img
	attack sound
	location
	alive bool
	user bool
	css class
	func creat html
		creats te html box and sets to correct location
	func delete html
		removes the html box from location
	func attack
		attacks as the user and increase attack
	func compAttack
		attacks as comp without increase
	
}
	game logic
	creat page with all 4 choices
	user chooses one and other three are set as comps
	user chooses enemy 
	attack applys attck damn to both and updates html
	if user reachs 0 they lose and ask to reset
	if comp dies delete it from game field allow user to select new enemy 
	repeat till user dies or wins
	ask to reset
	funcs needed
		creat game space/reset
		combat
		game lose
		game win
		
*/
