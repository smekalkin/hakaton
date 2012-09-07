// работаем с перемещением элементов

var dragDrop = {};

(function () {
	var body;
	
	// игра
	dragDrop.game = function(level) {
		if(body) { $('body').html($(body).html()); }
		else { body = $('body').clone(); }
		
		dragDrop.level = level;
		
		$('div#select-level span').text(level);
		
		dragDrop.init();
		audio.init();
		time.on(true, 30);
		
		graph.data1 = [100];
		graph.data2 = ['0'];
		graph.init(graph.data1, graph.data2);
	}
	
	// инициализация драг-дроп
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
					audio.DropGirl();
				}
				else {
					var counterEl = counterBoyEl;
					var newValueGraph = graph.data1[graph.data1.length - 1] - 100;
					if(newValueGraph < 0) {newValueGraph = 0;}
					graph.data1.push(newValueGraph);
					audio.DropBoy();
				}
				
				$(counterEl).text(parseInt($(counterEl).text()) + 1);
				
				$(ui.draggable).fadeOut('fast', function(){
					$(this).remove();
					
					if(!$('div.girl').length) { time.result(); }
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
		var duration = Math.floor((Math.random() * (5000 - 1000) + 1000)/dragDrop.level);
		
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
	
	// ф-ция поддержки тач-устройств
	dragDrop.touch = function() {
		// Detect touch support
		$.support.touch = 'ontouchend' in document;
		// Ignore browsers without touch support
		if (!$.support.touch) {
		return;
		}
		var mouseProto = $.ui.mouse.prototype,
			_mouseInit = mouseProto._mouseInit,
			touchHandled;

		function simulateMouseEvent (event, simulatedType) { //use this function to simulate mouse event
		// Ignore multi-touch events
			if (event.originalEvent.touches.length > 1) {
			return;
			}
		event.preventDefault(); //use this to prevent scrolling during ui use

		var touch = event.originalEvent.changedTouches[0],
			simulatedEvent = document.createEvent('MouseEvents');
		// Initialize the simulated mouse event using the touch event's coordinates
		simulatedEvent.initMouseEvent(
			simulatedType,    // type
			true,             // bubbles                    
			true,             // cancelable                 
			window,           // view                       
			1,                // detail                     
			touch.screenX,    // screenX                    
			touch.screenY,    // screenY                    
			touch.clientX,    // clientX                    
			touch.clientY,    // clientY                    
			false,            // ctrlKey                    
			false,            // altKey                     
			false,            // shiftKey                   
			false,            // metaKey                    
			0,                // button                     
			null              // relatedTarget              
			);

		// Dispatch the simulated event to the target element
		event.target.dispatchEvent(simulatedEvent);
		}
		mouseProto._touchStart = function (event) {
		var self = this;
		// Ignore the event if another widget is already being handled
		if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
			return;
			}
		// Set the flag to prevent other widgets from inheriting the touch event
		touchHandled = true;
		// Track movement to determine if interaction was a click
		self._touchMoved = false;
		// Simulate the mouseover event
		simulateMouseEvent(event, 'mouseover');
		// Simulate the mousemove event
		simulateMouseEvent(event, 'mousemove');
		// Simulate the mousedown event
		simulateMouseEvent(event, 'mousedown');
		};

		mouseProto._touchMove = function (event) {
		// Ignore event if not handled
		if (!touchHandled) {
			return;
			}
		// Interaction was not a click
		this._touchMoved = true;
		// Simulate the mousemove event
		simulateMouseEvent(event, 'mousemove');
		};
		mouseProto._touchEnd = function (event) {
		// Ignore event if not handled
		if (!touchHandled) {
			return;
		}
		// Simulate the mouseup event
		simulateMouseEvent(event, 'mouseup');
		// Simulate the mouseout event
		simulateMouseEvent(event, 'mouseout');
		// If the touch interaction did not move, it should trigger a click
		if (!this._touchMoved) {
		// Simulate the click event
		simulateMouseEvent(event, 'click');
		}
		// Unset the flag to allow other widgets to inherit the touch event
		touchHandled = false;
		};
		mouseProto._mouseInit = function () {
		var self = this;
		// Delegate the touch handlers to the widget's element
		self.element
			.on('touchstart', $.proxy(self, '_touchStart'))
			.on('touchmove', $.proxy(self, '_touchMove'))
			.on('touchend', $.proxy(self, '_touchEnd'));

		// Call the original $.ui.mouse init method
		_mouseInit.call(self);
		};
	}
	
	// облегченная версия, уменьшение элементов, чтоб не тормозило
	dragDrop.lite = function() {
		if(isTouch()) {
			$('div.girl:gt(2)').add('div.boy:gt(2)').remove();
		}
	}
	
	// определяем тач-устройства
	function isTouch(){
		if( navigator.userAgent.indexOf("iPhone") != -1 ) {
			return true;
		}
		if(navigator.userAgent.indexOf("iPad") != -1 ) {
			return true;
		}

		var userag = navigator.userAgent.toLowerCase();
		var isAndroid = userag.indexOf("android") > -1; 
		if(isAndroid) {
			return true;
		}
		return false;
	}
	
})();

$(function() {
	dragDrop.lite();
	dragDrop.touch();
	dragDrop.game(1);
});


