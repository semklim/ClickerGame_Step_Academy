var first = 1;  //номерная часть имени первой картинки
var last  = 6;     //номер последней картинки
var num   = 1;      //итератор

var maskFileName = ['', '.png'];//маска имени картинки
var dir = 'sprite/GoblinMove';   //директория, в которой лежат картинки

var canvas = document.getElementById("sprite"); //выберем наш канвас
canvas.width  = last * 230; //задаем ширину, в зависимости от количества
canvas.height = 190;
var width = 0;  //переменная, в которую будем записывать сдвиг
var context = canvas.getContext("2d"); //получаем контекст

function draw() {
	var img = document.createElement('img'); /* каждый раз при вызове этой функции мы создаем новый обьект-изображение */
	img.onload = function () {
			  	//когда изображение загрузится рисуем им на канвасе
			  	context.drawImage(img, width, 0);
			  	width += 230; 
//при этом каждый раз сдвигаем на ширину изображения, чтобы рисовать справа от предыдущего рисунка, а не на нем
			  	if (num != last) {
//проверяем достигли ли мы последнего рисунка
			  		num++; //увиличуем итератор
			  		draw(); //и запускаем функцию вновь
			  	} 		  	
	}
	img.src = dir + '/' + num + maskFileName[1]; //собираем имя файла картинки для загрузки
}

draw(); //вызываем функцию впервые


canvas.onclick = function () {
    window.location = context.canvas.toDataURL('image/png');
};