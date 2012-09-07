// время
var time = {};

(function () {
	var interval;
	
	// включить таймер
	// back - флаг обратного отсчета
	// startTime стартовое время в секундах
	time.on = function(back, startTime) {
		var sec = startTime%60;
		var min = ((startTime - sec)/60)%60;
		var hour = (startTime / 3600) - ((startTime / 3600) % 1);

		var cont = document.getElementById('select-time');
		var elem = document.createElement('div');
		
		if(min < 10) { var minHtml = '0' + min; }
		else { var minHtml = min; }
		
		if(sec < 10) { var secHtml = '0' + sec; }
		else { var secHtml = sec; }
		
		elem.innerHTML = hour + ':' + minHtml + ':' + secHtml;
		cont.appendChild(elem);

		interval = setInterval ( function() {
			if(back) {
				sec--;
				
				if(sec < 0) {
					sec = 59;
					min--;
				}
				
				if(min < 0) {
					min = 59;
					hour--;
				}
			} else {
				sec++;
				if(sec == 60) {
					sec = 0;
					min++;
				} else if(min == 60) {
					min = 0;
					hour++;
				}
			}

			if ( sec < 10 )  {
				brS = ':0'; // добавить перед секундами 0, если число не двузначное
			} else {brS = ':'} ;

			if ( min < 10 )  {
				brM = ':0'; // добавить перед минутами 0, если число не двузначное
			} else {brM = ':'} ;

			if(back) {
				if(!hour && !min && !sec) {
					clearInterval(interval);
					time.result();
				}
			}
			else if(hour == 2) { // остановить работу скрипта, если прошло 2 часа
				min = 0;
				sec = 0;

				clearInterval(interval);
			}

			elem.innerHTML = hour + brM + min + brS + sec;
		},1000 );
	}
	
	// время в unixtime
	time.unix = function(){
		return parseInt(new Date().getTime()/1000);
	}
	
	time.start = time.unix(); // время запуска
	
	// результаты игры по времени
	time.result = function() {
		clearInterval(interval);
		
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
		
		var inputEl = $(resultEl).find('input');
		
		var level = dragDrop.level;
		
		if(effectResult > 100/* && level < 3*/) {
			$(inputEl).val('Следующий уровень');
			level++;
		}
		else {
			$(inputEl).val('Сначала');
			level = 1;
		}
		
		resultEl.find('p').text(mes);
		
		resultEl.find('input').click(function() {
			dragDrop.game(level);
			
			return false;
		})
		
		$(resultEl).show().dialog({
			modal : true,
			width : 400
		}).prev().remove();
		
		audio.end();
	}
	
})();

