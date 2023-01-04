'use strict'
console.time()
class Enemy {
	static stopAttack = null;
	static wait = false;
	constructor(el, name){
		this.el = el;
		this.name = name;
		this.hp = Math.floor(Math.random() * 200);
		this.smash = new Audio('./sound/smash.mp3');
	}
	attack = () => {
		this.el.classList.toggle('attack');
		setTimeout(() => this.el.classList.toggle('attack'), 1000);
		setTimeout(() => this.smash.play(), 400);
		setTimeout(	hero.hit, 400);
		Enemy.stopAttack = setTimeout(this.attack, 2000);
	}
	hit () {
		this.el.classList.toggle('hit');
		setTimeout(()=>this.el.classList.toggle('hit'), 200);
	}
	death () {
		hpEnemyBar.firstChild.textContent = '';
		Enemy.wait = true;
		this.hit();
		this.el.classList.add('death');
		clearTimeout(Enemy.stopAttack);
		setTimeout(nextEnemy, 3000)
	}
	action = () => {
		this.hit();
		this.hp -= 20;

		if (this.hp <= 0 && Enemy.wait === false) {
			this.death();	
		}

		if(this.hp <= 0){
			hpEnemyBar.lastChild.setAttribute('style', `width: ${this.hp}px;`);
		}else{
			hpEnemyBar.firstChild.textContent = `${this.hp}`;
			hpEnemyBar.lastChild.setAttribute('style', `width: ${this.hp}px;`);
		}
	}
}

class Hero {
	static stopAttack =null;
	constructor(el, name){
		this.el = el;
		this.name = name;
		this.hp = 150;
		this.sound = new Audio('./sound/swordSound.mp3');
	}
	hit = () => {
		this.hp -=20;
		const hp = 150 - this.hp;
		hpHeroBar.lastChild.setAttribute('style', `transform: translateY(${hp}px);`)
		hpHeroBar.firstChild.textContent = `${this.hp}`
		if (this.hp <= 0) {
			hpHeroBar.firstChild.textContent = '';
			this.death();
		}
	}
	death () {
		clearTimeout(Enemy.stopAttack);
	}
	action = () => {
		this.el.classList.toggle('hero__attack');
		this.sound.play();
		setTimeout(()=> {this.el.classList.toggle('hero__attack')}, 300);
	}
}

function nextEnemy (){
	if(hero.hp > 0) {
	enemy.hp = Math.floor(Math.random() * 200);
	Enemy.stopAttack = setTimeout(enemy.attack, 2000);
	hpEnemyBar.firstChild.textContent = `${enemy.hp}`;
	hpEnemyBar.lastChild.setAttribute('style', `width: ${enemy.hp}px;`);
	enemy.el.classList.toggle('death');
	Enemy.wait = false;
	}
}

function CreateEnemy(characterClassName = 'character__enemySpritesheet') {
	const el = document.querySelector('.' + characterClassName);
	const enemyNpc = new Enemy(el, characterClassName);

	Enemy.stopAttack = setTimeout(enemyNpc.attack, 3000);
	hpEnemyBar.firstChild.textContent = `${enemyNpc.hp}`;
	hpEnemyBar.lastChild.setAttribute('style', 'width: 200px;');
	ObserverForClick.subscribe(enemyNpc.action);
	return enemyNpc;
}

function CreateHero (heroClassName = 'hero__sprite'){
	const el = document.querySelector('.' + heroClassName);
	const hero = new Hero(el, heroClassName);
	hpHeroBar.firstChild.textContent = `${hero.hp}`
	ObserverForClick.subscribe(hero.action);
	return hero;
}

const hpEnemyBar = document.querySelector('.character_hpBar');
const hpHeroBar = document.querySelector('.hero__hpBar');
const ObserverForClick = new Observer();
const hero = CreateHero();
const enemy = CreateEnemy();


document.addEventListener('click', () => {
	ObserverForClick.broadcast();
});
console.timeEnd();

