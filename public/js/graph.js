// график для canvas
var graph = {};

(function () {
	
	graph.init = function(data1, data2) {
		RGraph.Clear(document.getElementById('myCanvas'));
		// The data for the Line chart. Multiple lines are specified as seperate arrays.
		//var data = [200,40,170,50,25,19,20];
		// Create the Line chart object. The arguments are the canvas ID and the data array.
		var line = new RGraph.Line("myCanvas", data1);

		// The way to specify multiple lines is by giving multiple arrays, like this:
		// var line = new RGraph.Line("myLine", [4,6,8], [8,4,6], [4,5,3]);

		// Configure the chart to appear as you wish.
		line.Set('chart.background.barcolor1', 'white');
		line.Set('chart.background.barcolor2', 'white');
		line.Set('chart.background.grid.color', 'rgba(238,238,238,1)');
		line.Set('chart.colors', ['#00F','#0f0']);
		line.Set('chart.linewidth', 1);
		//line.Set('chart.filled', true);
		line.Set('chart.fillstyle',1);
		line.Set('chart.hmargin', 5);
		line.Set('chart.labels', data2);
		line.Set('chart.gutter.left', 40);

		// Now call the .Draw() method to draw the chart.
		line.Draw();
		//RGraph.Effects.jQuery.Expand(line);//эффект появления
		//RGraph.Clear(document.getElementById('line_chart_id')); //<- удаляет график, что бы нарисовать новый
	}
	
})();

$(function() {
	graph.data1 = [100];
	graph.data2 = ['0'];

	graph.init(graph.data1, graph.data2);
});