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
		this.percent_minus_in_hp_bar = Math.ceil(ENEMY_HP * (HERO_ATTACK / this.hp));
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
		ENEMY_HP = SET_ENEMY_HP;
		Enemy.isdead = true;
		this.hit();
		this.el.classList.add('death');
		hpEnemyBar.firstChild.textContent = '';
		hpEnemyBar.lastChild.setAttribute('style', '');
		hpEnemyBar.setAttribute('style', 'border: 0px');
		clearTimeout(Enemy.stopAttack);
		setTimeout(nextEnemy, 3000)
	}
	enemyHpVisualization () {
		if(this.hp > 0){
		hpEnemyBar.firstChild.textContent = `${this.hp}`;
		hpEnemyBar.lastChild.setAttribute('style', `width: ${ENEMY_HP}px;`);
		}else{
			this.death();
		}
	}
	action = () => {
		if (!Hero.isdead) {
			this.hit();
			this.hp -= HERO_ATTACK;
			ENEMY_HP -= this.percent_minus_in_hp_bar;
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
		this.heroHpVisualization((-1 * ENEMY_ATTACK));
		hpHeroBar.lastChild.dataset.heroHp = this.hp;
		if (this.hp <= 0) {
			hpHeroBar.firstChild.textContent = '';
			hpHeroBar.style.border = '0px';
			this.death();
		}
	}
	death () {
		if(BEST_SCORE < this.click_count){
			localStorage.setItem('best_try', `${JSON.stringify(this.click_count)}`);
		}
		Hero.isdead = true;
		clearTimeout(Enemy.stopAttack);
		setTimeout(endGameWindow, 1000);
	}

	heroHpVisualization (translate = 0) {
		this.hp = hero.hp + translate <= HERO_HP ? this.hp + translate : HERO_HP;
		translate = (HERO_HP - this.hp);
		hpHeroBar.lastChild.setAttribute('style', `transform: translateY(${translate}px);`);
		hpHeroBar.firstChild.textContent = `${this.hp}`;
	  }

	 increaseAttack (el){
		 const lvlUpBox = document.querySelector('.lvlUp');
		if (el.value === 'true') {
			HERO_ATTACK += 20;
			ENEMY_ATTACK += 15;
			ENEMY_MIN_HP += 200;
			ENEMY_MAX_HP += 300;
			// console.log('HERO_ATTACK = ' + HERO_ATTACK +'\n' + 'ENEMY_ATTACK =' + ENEMY_ATTACK);
			enemy.percent_minus_in_hp_bar = Math.ceil(ENEMY_HP * (HERO_ATTACK / this.hp));
			lvlUpBox.remove();
			CreateLvlUpBox.isCreated = false;
			Clicks_FOR_LVLUP += 100;
		}else{
			lvlUpBox.remove();
			CreateLvlUpBox.isCreated = false;
		}
	}

	action = () => {
		if (!Hero.isdead) {
			this.click_count += 1;
			clickCount.lastChild.textContent = this.click_count;
			this.el.classList.toggle('hero__attack');
			this.sound.play();
			setTimeout(()=> {this.el.classList.toggle('hero__attack')}, 300);
			if(this.click_count > Clicks_FOR_LVLUP && !CreateLvlUpBox.isCreated){
			CreateLvlUpBox();
			CreateLvlUpBox.isCreated = true;
			}
		}
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

function CreateLvlUpBox() {
	const body = document.body;
	const lvlUpBox = document.createElement('div');
	const btn1 = document.createElement('button');
	const btn2 = document.createElement('button');
	lvlUpBox.classList.add('lvlUp');
	btn1.classList.add('yes_lvlup');
	btn2.classList.add('no_lvlup');
	btn1.classList.add('button');
	btn2.classList.add('button');
	btn1.setAttribute('value', 'true');
	btn2.setAttribute('value', 'false');
	btn1.textContent = 'yes';
	btn2.textContent = 'no';
	lvlUpBox.textContent = 'Increase attack?';
	lvlUpBox.append(btn1, btn2);
	body.append(lvlUpBox);
}
CreateLvlUpBox.isCreated = false;

function setBodyBackgroundImg (){
	const imgForBody = Math.floor(Math.random() * backImg.length);
	bodyEl.setAttribute('style', `background-image: url(${backImg[imgForBody]});`);
}

function nextEnemy (){
	if(hero.hp > 0) {
	setBodyBackgroundImg();
	enemy.hp = (Math.floor(Math.random() * (ENEMY_MAX_HP - ENEMY_MIN_HP) + ENEMY_MIN_HP));
	enemy.percent_minus_in_hp_bar = Math.ceil(ENEMY_HP * (HERO_ATTACK / enemy.hp));
	enemy.enemyHpVisualization();
	enemy.el.classList.toggle('death');
	hpEnemyBar.setAttribute('style', '');
	Enemy.stopAttack = setTimeout(enemy.attack, 2000);
	Enemy.isdead = false;
	}
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
	let position = parseInt(flask.getAttribute('data-position'))
	if (!Hero.isdead && position > -480) {
		position -= 160;
		const heal = 50;
		clearTimeout(regenFlask);
		flask.setAttribute('style', `transform: translateY(${position}px)`);
		hero.heroHpVisualization(heal);
		flask.dataset.position = position;
		setTimeout(regenBottleHealing, 3000);
	}
  }

 function init(){
	if (localStorage.getItem('is_new_game') === 'false') {
		const best_score = document.querySelector('.best__score').lastChild;
		const heroLocal = JSON.parse(localStorage.getItem('hero'));
		const enemyHp = JSON.parse(localStorage.getItem('enemyhp'));
		const isMute = JSON.parse(localStorage.getItem('mute'));
		const bestTry = JSON.parse(localStorage.getItem('best_try'));
		const regenCount = JSON.parse(localStorage.getItem('regen_bottle_count'));
		const position = localStorage.getItem('bottle');

		HERO_ATTACK = JSON.parse(localStorage.getItem('hero_attack'));
		ENEMY_ATTACK = JSON.parse(localStorage.getItem('enemy_attack'));
		ENEMY_MIN_HP = JSON.parse(localStorage.getItem('enemy_min_hp'));
		ENEMY_MAX_HP = JSON.parse(localStorage.getItem('enemy_max_hp'));
		Clicks_FOR_LVLUP = JSON.parse(localStorage.getItem('clicks_for_lvlup'));
		CreateLvlUpBox.isCreated = JSON.parse(localStorage.getItem('lvlup_box_iscreated'));
		
		MUTE_ALL = isMute;
		muteAllSound();
	
		if (best_score.textContent < bestTry) {
			best_score.lastChild.textContent = bestTry || 0;
		}
		
		hero.hp = heroLocal.hp;
		hero.click_count = heroLocal.click_count;
		clickCount.lastChild.textContent = hero.click_count;
		hero.heroHpVisualization();
		
		regenBottleHealing.count = regenCount;
		flask.setAttribute('style', `transform: translateY(${position}px)`);
		
		enemy.hp = enemyHp;
		enemy.enemyHpVisualization();
	}else{
		BEST_SCORE = localStorage.getItem('best_try') || 0;
		best_score.textContent = BEST_SCORE;
		MUTE_ALL = JSON.parse(localStorage.getItem('mute'));
		muteAllSound();
	}
 }


 function endGameWindow(){
	clearData();
	const body = document.querySelector('body');
	body.setAttribute('style', 'background-image: none;');
	body.innerHTML= `	<div class="container">
	<div class="menu">
		<div class="menu__btn">
			<a class = "button" href="./index.html">Menu</a>
		</div>
	</div>
	<details style = "text-align: center; font-size: 18px;">
		<summary>Your score</summary>
				${hero.click_count}
	</details>
</div>`
	localStorage.setItem('is_new_game', 'true');
 }


function storeData(){
	const best_try = localStorage.getItem('best_try') || 0;
	const bottleData = flask.getAttribute('data-position');
	const hero__hpBar = hpHeroBar.lastChild.getAttribute('data-hero-hp');
	localStorage.clear();
	localStorage.setItem('is_new_game', 'false');
	localStorage.setItem('best_try', best_try);
	localStorage.setItem('enemyhp', JSON.stringify(enemy.hp));
	localStorage.setItem('hero', JSON.stringify(hero));
	localStorage.setItem('hero_bar_data', hero__hpBar);
	localStorage.setItem('mute', JSON.stringify(!MUTE_ALL));
	localStorage.setItem('regen_bottle_count', JSON.stringify(regenBottleHealing.count));
	localStorage.setItem('bottle', bottleData);
	localStorage.setItem('hero_attack',JSON.stringify(HERO_ATTACK));
	localStorage.setItem('enemy_attack',JSON.stringify(ENEMY_ATTACK));
	localStorage.setItem('enemy_min_hp',JSON.stringify(ENEMY_MIN_HP));
	localStorage.setItem('enemy_max_hp',JSON.stringify(ENEMY_MAX_HP));
	localStorage.setItem('clicks_for_lvlup',JSON.stringify(Clicks_FOR_LVLUP));
	localStorage.setItem('lvlup_box_iscreated',JSON.stringify(CreateLvlUpBox.isCreated));
}

function clearData(){
	const best_try = localStorage.getItem('best_try');
	localStorage.clear();
	localStorage.setItem('best_try', `${best_try}`);
	localStorage.setItem('mute', JSON.stringify(!MUTE_ALL));
}


const HERO_HP = 225;
const SET_ENEMY_HP = 300;
let ENEMY_MIN_HP = 300;
let ENEMY_MAX_HP = 400;
let HERO_ATTACK = 20;
let ENEMY_ATTACK = 20;
let ENEMY_HP = 300;
let BEST_SCORE = 0;
let MUTE_ALL = true;
let Clicks_FOR_LVLUP = 50;
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
const best_score = document.querySelector('.best__score').lastChild;
	  best_score.textContent = BEST_SCORE;
	

	init();

document.addEventListener('click', (e) => {
	if(e.target.className.includes('button')){
		hero.increaseAttack(e.target);
	}else if (e.target.className === 'exitBtn'){
		storeData();
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