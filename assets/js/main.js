var create = function(){
	//create the box with the image and name for the char object
	var item =$("<div>");
	item.attr("id", this.name);
	item.append($("<img>").attr("src",this.img).addClass("charImg"));
	item.addClass(this.class);
	item.append($("<h2>").addClass("charName").html(this.name))
	$(this.location).append(item);
}
var objDelete =  function(){
	//gets rid of the box with image and nae for char object;
	var loc = "#"+this.name;
	$(loc).remove();
}
var enemyArea = function(){
		
		this.location = "#enemyArea";
		this.create();
	};
var defenderArea = function(){
	this.location = "#defenderArea"
	this.create();
}
var attack = function(target){

}
function char(name, damage, img, sound){
	//object constructor
	this.name = name;
	this.damage = damage;
	this.attackIncrease =damage;
	this.img = "assets/images/"+img;
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
}
//list of all character
var charList = [["name1",5,"name1.jpg","namw1.wmv"],
	["name2",10,"name2.jpg","namw2.wmv"],
	["name3",15,"name3.jpg","namw3.wmv"],
	["name4",5,"name4.jpg","namw4.wmv"]];
var nameList =[];
var user;
	function charConstuct(list){
		//creates all the objects for the character
		for (var i = 0; i < list.length; i++) {
			window[list[i][0]] = new char(list[i][0],list[i][1],list[i][2],list[i][3]);
			nameList.push(list[i][0]);
		}
	};

	function userClick(){
		//must be called with a bind() for this to work
		//removes clicked character frm nameList and sets it user to True
		let index = nameList.indexOf(this.name);
		this.user = true;
		user = this;
		nameList.splice(index,1);
		//deletes other character boxs
		for (var i = 0; i < nameList.length; i++) {
			let item = window[nameList[i]];
			item.delete();
			item.enemyArea();
			$(item.id).on("click", function(){
				item.delete();
				item.defenderArea();
				let index = nameList.indexOf(item.name);
				nameList.splice(index, 1)
				for (var i = 0; i < nameList.length; i++) {
					let item = window[nameList[i]];
					$(item.id).unbind("click");
				}
			});
		}
	};
	
	charConstuct(charList);
	for (var i = 0; i < nameList.length; i++) {
		window[nameList[i]].create();
		$(window[nameList[i]].id).on("click",userClick.bind(window[nameList[i]]));
	};

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
