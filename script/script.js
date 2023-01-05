'use strict'

class Enemy {
	static stopAttack = null;
	static isdead = false;
	constructor(el, name){
		this.el = el;
		this.name = name;
		this.hp = Math.floor(Math.random() * (ENEMY_MAX_HP - ENEMY_MIN_HP) + ENEMY_MIN_HP);
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
	enemyHpVisualization () {
		hpEnemyBar.firstChild.textContent = `${this.hp}`;
		hpEnemyBar.lastChild.setAttribute('style', `width: ${this.hp}px;`);
	}
	action = () => {
		this.hit();
		this.hp -= HERO_ATTACK;
		if (this.hp <= 0 && !Enemy.isdead) {
			this.death();	
		}
		if(this.hp <= 0){
			hpEnemyBar.lastChild.setAttribute('style', `width: ${this.hp}px;`);
		}else{
			this.enemyHpVisualization();
		}
	}
}

class Hero {
	constructor(el, name){
		this.el = el;
		this.name = name;
		this.hp = HERO_HP;
		this.sound = new Audio('./sound/swordSound.mp3');
		this.sound.volume = 0.1;
		this.click_count = 0;
	}
	hit = () => {
		this.hp -= ENEMY_ATTACK;
		const hp = HERO_HP - this.hp;
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
		clickCount.lastChild.textContent = this.click_count;
		this.el.classList.toggle('hero__attack');
		this.sound.play();
		setTimeout(()=> {this.el.classList.toggle('hero__attack')}, 300);
	}
}

function setBodyBackgroundImg (){
	const imgForBody = Math.floor(Math.random() * backImg.length);
	bodyEl.setAttribute('style', `background-image: url(${backImg[imgForBody]});`);
}

function nextEnemy (){
	if(hero.hp > 0) {
	setBodyBackgroundImg();
	enemy.hp = (Math.floor(Math.random() * (ENEMY_MAX_HP - ENEMY_MIN_HP) + ENEMY_MIN_HP));
	Enemy.stopAttack = setTimeout(enemy.attack, 2000);
	hpEnemyBar.setAttribute('style', '');
	enemy.enemyHpVisualization();
	enemy.el.classList.toggle('death');
	Enemy.isdead = false;
	}
}

function CreateEnemy(characterClassName = 'character__enemySpritesheet') {
	const el = document.querySelector('.' + characterClassName);
	const enemy = new Enemy(el, characterClassName);

	Enemy.stopAttack = setTimeout(enemy.attack, 3000);
	enemy.enemyHpVisualization();
	ObserverForClick.subscribe(enemy.action);
	return enemy;
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

const HERO_HP = 225;
const HERO_ATTACK = 20;
const ENEMY_ATTACK = 20;
const ENEMY_MIN_HP = 200;
const ENEMY_MAX_HP = 400;
const backImg = [
	'./sprite/dungeon/1Dun.webp',
	'./sprite/dungeon/2Dun.webp',
	'./sprite/dungeon/3Dun.webp',
	'./sprite/dungeon/4Dun.webp',
	'./sprite/dungeon/5Dun.webp',
];
const bodyEl = document.querySelector('body');
const clickCount = document.querySelector('.click__count');
const hpEnemyBar = document.querySelector('.character_hpBar');
const hpHeroBar = document.querySelector('.hero__hpBar');
const muteBtn = document.querySelector('.muteAll');
const ObserverForClick = new Observer();
const hero = CreateHero();
const enemy = CreateEnemy();
const loopSound = new Audio('./sound/loopSound.mp3');
	  loopSound.play();
	  loopSound.volume = 0.4;
	  loopSound.loop = true;

document.addEventListener('click', (e) => {
	if (e.target.className === 'muteAll') {
		muteAllSound();
		e.target.blur();
	}else if (!Enemy.isdead){
		ObserverForClick.broadcast();
	}
});

window.addEventListener('keyup', (e) => {
	if (e.code === 'Enter' && !Enemy.isdead) {
		ObserverForClick.broadcast();
	}
})


