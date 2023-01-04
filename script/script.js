'use strict'


class Enemy {
	static stopAttack = null;
	static isdead = false;
	constructor(el, name){
		this.el = el;
		this.name = name;
		this.hp = Math.floor(Math.random() * (401 - 200) + 200);
		this.sound = new Audio('./sound/smash.mp3');
		this.sound.volume = 0.2;
	}
	attack = () => {
		this.el.classList.toggle('attack');
		setTimeout(() => this.el.classList.toggle('attack'), 1000);
		setTimeout(() => this.sound.play(), 400);
		setTimeout(	hero.hit, 400);
		Enemy.stopAttack = setTimeout(this.attack, 2000);
	}
	hit () {
		this.el.classList.toggle('hit');
		setTimeout(()=>this.el.classList.toggle('hit'), 200);
	}
	death () {
		hpEnemyBar.firstChild.textContent = '';
		hpEnemyBar.setAttribute('style', 'border: 0px');
		Enemy.isdead = true;
		this.hit();
		this.el.classList.add('death');
		clearTimeout(Enemy.stopAttack);
		setTimeout(nextEnemy, 3000)
	}
	action = () => {
		this.hit();
		this.hp -= 20;

		if (this.hp <= 0 && !Enemy.isdead) {
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
		this.hp = 300;
		this.sound = new Audio('./sound/swordSound.mp3');
		this.sound.volume = 0.1;
		this.click_count = 0;
	}
	hit = () => {
		this.hp -= 20;
		const hp = 300 - this.hp;
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
		this.click_count += 1;
		clickCount.textContent = this.click_count;
		this.el.classList.toggle('hero__attack');
		this.sound.play();
		setTimeout(()=> {this.el.classList.toggle('hero__attack')}, 300);
	}
}

function setBodyBackgroundImg (){
	const imgForBody = Math.floor(Math.random() * backImg.length);
	bodyEl.setAttribute('style', `background-image: url(${backImg[imgForBody]});`);
	console.log(backImg[imgForBody]);
}

function nextEnemy (){
	if(hero.hp > 0) {
	setBodyBackgroundImg();
	enemy.hp = (Math.floor(Math.random() * (401 - 200) + 200));
	Enemy.stopAttack = setTimeout(enemy.attack, 2000);
	hpEnemyBar.setAttribute('style', '');
	hpEnemyBar.firstChild.textContent = `${enemy.hp}`;
	hpEnemyBar.lastChild.setAttribute('style', `width: ${enemy.hp}px;`);
	enemy.el.classList.toggle('death');
	Enemy.isdead = false;
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

function muteAllSound() {
	if(!muteAllSound.istrue){
		enemy.sound.muted = true;
		hero.sound.muted = true;
		loopSound.muted = true;
		muteAllSound.istrue = true;
	}else{
		enemy.sound.muted = false;
		hero.sound.muted = false;
		loopSound.muted = false;
		muteAllSound.istrue = false;
	}
}
muteAllSound.istrue = false;

const backImg = [
	'./sprite/dungeon/1Dun.webp',
	'./sprite/dungeon/2Dun.webp',
	'./sprite/dungeon/3Dun.webp',
	'./sprite/dungeon/4Dun.webp',
	'./sprite/dungeon/5Dun.webp',
];
const bodyEl = document.querySelector('body');
const loopSound = new Audio('./sound/loopSound.mp3');
	loopSound.play();
	loopSound.volume = 0.4;
	loopSound.loop = true;
const clickCount = document.querySelector('.click__count');
const hpEnemyBar = document.querySelector('.character_hpBar');
const hpHeroBar = document.querySelector('.hero__hpBar');
const muteBtn = document.querySelector('.muteAll');
const ObserverForClick = new Observer();
const hero = CreateHero();
const enemy = CreateEnemy();


document.addEventListener('click', (e) => {
	if (e.target.className === 'muteAll') {
		muteAllSound()
	}else{
		ObserverForClick.broadcast();
	}
});

window.addEventListener('keyup', (e) => {
	if (e.code === 'Enter' && !Enemy.isdead) {
		ObserverForClick.broadcast();
	}
})


