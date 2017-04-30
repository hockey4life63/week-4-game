function defenderClick(){
	//sets defender and removes from list
	this.delete();
	this.defenderArea();
	defender = this;
	let index = nameList.indexOf(this.name);
	nameList.splice(index, 1);
	//removes other click listners
	for (var i = 0; i < nameList.length; i++) {
		let item = window[nameList[i]];
		$(item.id).unbind("click");
	};
	$("#fightButton").on("click", function(){
		user.attack(defender);
	});
};

function userClick(){
	//must be called with a bind() for this to work
	//removes clicked character frm nameList and sets it user to True
	$(this.id).unbind();
	let index = nameList.indexOf(this.name);
	this.user = true;
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
function gameWin(){
	defender.delete();

}
function gameLose(){
	user.delete();
}
function compKilled(target){
	target.delete();
	$("#fightButton").unbind("click")
	for (var i = 0; i < nameList.length; i++) {
		let item = window[nameList[i]];
		$(item.id).on("click", defenderClick.bind(item));
	}
}
function combatCheck(player, target){
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
	item.attr("id", this.name);
	item.append($("<img>").attr("src",this.img).addClass("charImg"));
	item.addClass(this.class+ " "+charClass);
	item.append($("<h2>").addClass("charName").html(this.name))
	item.append($("<h2>").addClass("health").html("Health:"))
		.append($("<div>").attr("id",this.name+"Health").html(this.health));
	item.append($("<h2>").addClass("attack").html("attack:"))
		.append($("<div>").attr("id",this.name+"Damage").html(this.damage));
	$(this.location).append(item);
}
var objDelete =  function(){
	//gets rid of the box with image and nae for char object;
	$(this.id).remove();
}
var enemyArea = function(){
		
		this.location = "#enemyArea";
		this.create();
		$(this.id).removeClass(this.class);
		this.class = "defenderChoice";
		$(this.id).addClass(this.class);
	};
var defenderArea = function(){
	this.location = "#defenderArea"
	this.create();
}
var attack = function(target){
	target.health -= this.damage;
	this.health -= target.damage;
	this.damage += this.attackIncrease;
	this.updateStats();
	target.updateStats();
	combatCheck(this, target);

}
var updateStats = function(){
	$(this.id+"Health").html(this.health);
	$(this.id+"Damage").html(this.damage);
}
function char(name, damage, img, sound, health){
	//object constructor
	this.name = name;
	this.damage = damage;
	this.attackIncrease =damage;
	this.health = health
	this.img = "assets/images/"+img;
	this.sound = "assets/sounds/"+sound;
	this.location = "#userArea";
	this.alive = true;
	this.user = false;
	this.class = "userChoice";
	this.id = "#"+name;
	this.create = create;
	this.delete = objDelete;
	this.attack = attack;
	this.enemyArea = enemyArea;
	this.defenderArea =defenderArea;
	this.updateStats = updateStats;
}
//list of all character
var charList = [
	["name1",5,"name1.jpg","namw1.wmv", 100],
	["name2",10,"name2.jpg","namw2.wmv", 110],
	["name3",15,"name3.jpg","namw3.wmv", 150],
	["name4",5,"name4.jpg","namw4.wmv",120]
	];
var nameList =[];
var user;
var defender;
var charClass = "charClass";
	function charConstuct(list){
		//creates all the objects for the character
		for (var i = 0; i < list.length; i++) {
			window[list[i][0]] = new char(list[i][0],list[i][1],list[i][2],list[i][3],list[i][4]);
			nameList.push(list[i][0]);
		}
		for (var i = 0; i < nameList.length; i++) {
			window[nameList[i]].create();
			$(window[nameList[i]].id).on("click",userClick.bind(window[nameList[i]]));
		};
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
