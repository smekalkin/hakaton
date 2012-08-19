// время
var time = {};

(function () {
	var timeGame = 30; // время игры в сек.
	
	// включить таймер
	time.on = function() {
		var sec = 0;
		var min = 0;
		var hour = 0;

		var cont = document.getElementById('select-time');
		var elem = document.createElement('div');
		elem.innerHTML = hour + ":0" + min + ":0" + sec;
		cont.appendChild(elem);

		var a = setInterval ( function() {
			sec++;

			if ( sec==60 ) {
				sec = 0;
				min++;

			} else if (min==60) {
				min = 0;
				hour++;
			}

			if ( sec < 10 )  {
				brS = ":0"; // добавить перед секундами 0, если число не двузначное
			} else {brS = ":"} ;

			if ( min < 10 )  {
				brM = ":0"; // добавить перед минутами 0, если число не двузначное
			} else {brM = ":"} ;

			if (hour == 2) { // остановить работу скрипта, если прошло 2 часа
				min = 0;
				sec = 0;

				clearInterval(a);
			}

			elem.innerHTML = hour + brM + min + brS + sec;
			
			if((time.unix() - time.start) == timeGame) { time.result(); }
		},1000 );
	}
	
	// время в unixtime
	time.unix = function(){
		return parseInt(new Date().getTime()/1000);
	}
	
	time.start = time.unix(); // время запуска
	
	// результаты игры по времени
	time.result = function() {
		var countGirl = parseInt($('div#counter-girl span').text()); // счетчик Ж
		var countBoy = parseInt($('div#counter-boy span').text()); // счетчик М
		
		var effectResult = (countGirl - countBoy) * 100 + 100;
		
		if(effectResult > 1000) {
			var mes = 'УРА!!! Прогеры написали Poogle, нашли инвесторов, и хакатон-пати продолжается!!!';
		}
		else if(effectResult > 100) {
			var mes = 'УРА!!! Поздравляем, вы подняли производительность программистов на ' + effectResult + ' строк в минуту';
		}
		else if(effectResult == 100) {
			var mes = 'Мало, мало, еще, еще надо! ';
		}
		else {
			var mes = 'О, нет, программеры ушли с хакатона в клуб';
		}
		
		var resultEl = $('div#select-result');
		resultEl.find('p').text(mes);
		
		resultEl.find('input').click(function() {
			window.location.reload();
			
			return false;
		})
		
		$(resultEl).show().dialog({
			modal : true,
			width : 400
		}).prev().remove();
	}
	
})();

$(function() {	
	time.on();
});

