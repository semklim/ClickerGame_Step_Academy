'use strict'

class Unit {
	static stopAttack =null;
	constructor(el, name, scream) {
		this.el = el;
		this.hp = 100;
		this.name = name;
		this.scream = scream;
	}
	scream() {
		console.log(this.scream);
	}
	attack = () => {
		this.el.classList.toggle('attack');
		Unit.stopAttack = setTimeout(this.attack, 1000);
	}
	hit = () => {
		setTimeout(()=>this.el.classList.toggle('hit'), 200);
		this.el.classList.toggle('hit');
	}
	death = () => {
		this.hit();
		this.el.classList.add('death');
		clearTimeout(Unit.stopAttack);
	}
	action = () => {
		if (this.hp > 0) {
			this.hit();
			this.hp -= 20;
			console.log(this.hp);
		} else {
			this.death();
		}
	}
};

const allNPC = {};
const myObserver = new Observer();

function createEl() {
	let el = document.querySelector('.character__enemySpritesheet');
	let npcName = el.classList[0];

	allNPC[npcName] = new Unit(el, npcName, 'aiii');
	setTimeout(allNPC[npcName].attack, 5000);
	myObserver.subscribe(allNPC[npcName].action);
}

createEl();
document.addEventListener('click', (e) => {
	myObserver.broadcast();
});
