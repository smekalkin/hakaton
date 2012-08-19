// работаем с перемещением элементов

var dragDrop = {};

(function () {
	
	dragDrop.init = function() {
		var counterGirlEl = $('div#counter-girl span'); // счетчик Ж
		var counterBoyEl = $('div#counter-boy span'); // счетчик М
		
		var i = 0;
		$('div.girl, div.boy').each(function(){
			$(this).draggable({
				revert : "invalid",
				start : function() {
					$(this).stop();
					if($(this).hasClass('girl')) {
						$(this).addClass('girl-act');
					}
					else {
						$(this).addClass('boy-act');
					}
				},
				stop : function() {
					if($(this).hasClass('girl')) {
						$(this).removeClass('girl-act');
					}
					else {
						$(this).removeClass('boy-act');
					}
					anim(this);
				}
			});
			
			// флаг запуска с правой стороны
			if(i%2) { var rightFlag = true; }
			else { var rightFlag = false; }
			
			anim(this, rightFlag);
				
			i++;
		});
		
		// упали
		$('div.door').droppable({
			drop : function(event, ui) {
				if($(ui.draggable).hasClass('girl')) {
					var counterEl = counterGirlEl;
					graph.data1.push(graph.data1[graph.data1.length - 1] + 100);
				}
				else {
					var counterEl = counterBoyEl;
					var newValueGraph = graph.data1[graph.data1.length - 1] - 100;
					if(newValueGraph < 0) {newValueGraph = 0;}
					graph.data1.push(newValueGraph);
				}
				
				$(counterEl).text(parseInt($(counterEl).text()) + 1);
				
				$(ui.draggable).fadeOut('fast', function(){
					$(this).remove();
				});
				
				// перерисовываем график с текущей меткой времени
				graph.data2.push(time.unix() - time.start + '');
				graph.init(graph.data1, graph.data2);
			},
			hoverClass : 'door-act'
		});
	}
	
	// анимация отдельного элемента
	var parentEl, parentW, parentH;
	function anim(el, rightFlag) {
		// ограничим область хождения человечков
		if(!parentEl) {parentEl = $(el).parent();}
		if(!parentW) {parentW = $(parentEl).width();}
		if(!parentH) {parentH = $(parentEl).height();}
		
		var left = Math.random() * (parentW - 100 - 100) + 100;
		var top = Math.random() * (parentH - 100 - 1) + 1;
		
		var elLeft = parseInt(el.style.left);

		if(!elLeft) { elLeft = 0; }
		
		if(rightFlag) {
			elLeft = parentW - $(el).width() - 1;
			el.style.left = elLeft + 'px';
		}

		// проверяем в какую сторону поворачивать
		if(elLeft <= left) {
			if($(el).hasClass('girl')) {
				$(el).removeClass('girl-left').addClass('girl-right');
			}
			else {
				$(el).removeClass('boy-left').addClass('boy-right');
			}
		}
		else {
			if($(el).hasClass('girl')) {
				$(el).removeClass('girl-right').addClass('girl-left');
			}
			else {
				$(el).removeClass('boy-right').addClass('boy-left');
			}
		}
		
		// рандом - ускорение
		var duration = Math.random() * (5000 - 1000) + 1000;
		
		$(el).animate({
			'left' : left,
			'top' : top
		}, {
			duration: duration,
			step : function(now, fx) {
				if((parseInt($(this).css('top')) + parseInt($(this).height())) >= parentH) {
					$(this).stop();
				}
				if((parseInt($(this).css('left')) + parseInt($(this).width())) >= parentW) {
					$(this).stop();
				}
			},
			complete : function() {
				anim(this);
			}
		});
	}
	
})();

$(function() {	
	dragDrop.init();
});


