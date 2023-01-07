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
		Enemy.isdead = true;
		this.hit();
		this.el.classList.add('death');
		hpEnemyBar.firstChild.textContent = '';
		hpEnemyBar.setAttribute('style', 'border: 0px');
		clearTimeout(Enemy.stopAttack);
		setTimeout(nextEnemy, 3000)
	}
	enemyHpVisualization () {
		hpEnemyBar.firstChild.textContent = `${this.hp}`;
		hpEnemyBar.lastChild.setAttribute('style', `width: ${this.hp}px;`);
	}
	action = () => {
		if (!Hero.isdead) {
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
}

class Hero {
	static isdead = false;
	constructor(el, name){
		this.el = el;
		this.name = name;
		this.hp = HERO_HP;
		this.sound = new Audio('./sound/swordSound.mp3');
		this.sound.volume = 0.1;
		this.click_count = 0;
	}
	hit = () => {
		const attack = -1 * ENEMY_ATTACK;
		this.heroHpVisualization(attack);
		if (this.hp <= 0) {
			hpHeroBar.firstChild.textContent = '';
			hpHeroBar.style.border = '0px';
			this.death();
		}
	}
	death () {
		Hero.isdead = true;
		clearTimeout(Enemy.stopAttack);
	}

	heroHpVisualization (translate) {
		this.hp = hero.hp + translate <= HERO_HP ? this.hp + translate : HERO_HP;
		translate = (HERO_HP - this.hp);
		hpHeroBar.lastChild.setAttribute('style', `transform: translateY(${translate}px);`);
		hpHeroBar.firstChild.textContent = `${this.hp}`;
	  }

	action = () => {
		if (!Hero.isdead) {
			this.click_count += 1;
			clickCount.lastChild.textContent = this.click_count;
			this.el.classList.toggle('hero__attack');
			this.sound.play();
			setTimeout(()=> {this.el.classList.toggle('hero__attack')}, 300);
		}
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
	enemy.enemyHpVisualization();
	enemy.el.classList.toggle('death');
	hpEnemyBar.setAttribute('style', '');
	Enemy.stopAttack = setTimeout(enemy.attack, 2000);
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
	if(!MUTE_ALL){
		muteBtn.setAttribute('style', "background-image: url('./sprite/muted_icon/no-sound.png');");
		enemy.sound.muted = true;
		hero.sound.muted = true;
		loopSound.muted = true;
		MUTE_ALL = true;
	}else{
		muteBtn.removeAttribute('style');
		enemy.sound.muted = false;
		hero.sound.muted = false;
		loopSound.muted = false;
		MUTE_ALL = false;
	}
}

function regenBottleHealing(){
	let position = parseInt(flask.getAttribute('data-position'));

	if(position < 0 && regenBottleHealing.count <= 3){
		position = (position + 160) <= 0 ? position + 160 : 0;

		flask.setAttribute('style', `transform: translateY(${position}px)`);
		flask.dataset.position = position;
		regenBottleHealing.count += 1;
		setTimeout(regenBottleHealing, 3000);
	}
  }
  regenBottleHealing.count = 0;

  function healingHeroBottle() {
	if (!Hero.isdead) {
		const position = parseInt(flask.getAttribute('data-position')) - 160;
		const heal = 50;

		clearTimeout(regenFlask);
		flask.setAttribute('style', `transform: translateY(${position}px)`);
		hero.heroHpVisualization(heal);
		flask.dataset.position = position;
		setTimeout(regenBottleHealing, 3000);
	}
  }

const HERO_HP = 225;
const HERO_ATTACK = 20;
const ENEMY_ATTACK = 20;
const ENEMY_MIN_HP = 200;
const ENEMY_MAX_HP = 400;
let MUTE_ALL = false;
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
const flask = document.querySelector('.flaskaOfHeal__bottle');
const regenFlask = null;
const ObserverForClick = new Observer();
const hero = CreateHero();
const enemy = CreateEnemy();
const loopSound = new Audio('./sound/loopSound.mp3');
	  loopSound.play();
	  loopSound.volume = 0.4;
	  loopSound.loop = true;

document.addEventListener('click', (e) => {
	if (e.target.className === 'button'){
		localStorage.clear();
		localStorage.setItem('enemyhp', JSON.stringify(enemy.hp));
		localStorage.setItem('hero', JSON.stringify(hero));
		localStorage.setItem('mute', JSON.stringify(!MUTE_ALL));
	}else if (e.target.className === 'flaskaOfHeal') {
		healingHeroBottle();
	}else{
		if (e.target.className === 'muteAll') {
			muteAllSound();
			e.target.blur();
		}else if (!Enemy.isdead){
			ObserverForClick.broadcast();
		}
	}
});

window.addEventListener('keyup', (e) => {
	if (e.code === 'KeyH') {
		healingHeroBottle();
	}
	if (e.code === 'Space' && !Enemy.isdead) {
		ObserverForClick.broadcast();
	}
	if (e.code === 'KeyM') {
		muteAllSound();
	}
});