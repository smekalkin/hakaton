// аудио в игре

var audio = {};

(function () {
	var audioBg, audioDropBoy, audioDropGirl, audioEnd;

	// инициализация
	audio.init = function(){
		audioBg = $('audio#audio-bg')[0];
		audioDropBoy = $('audio#audio-drop-boy')[0];
		audioDropGirl = $('audio#audio-drop-girl')[0];
		audioEnd = $('audio#audio-end')[0];
		
		audio.start();
	};

	// старт игры
	audio.start = function() {
		audioBg.play();
	};
	
	// кидаем парня
	audio.DropBoy = function(){
		audioDropBoy.play();
	};
	
	// кидаем девушку
	audio.DropGirl = function(){
		audioDropGirl.play();
	};
	
	// конец игры
	audio.end = function(){
		audioBg.pause();
		audioEnd.play();
	};
	
})();

