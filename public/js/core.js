$(document).ready(function() {
	$("#mazeControlsSubmit").click(function(e) {
		var opts = {
			container: "mazeContainer"
		};
		$.each($("#mazeControls > form").serializeArray(),function(i,v) {
			opts[v.name] = v.value;
		});
		var mg = new MAZE_GENERATOR(opts);
//		console.time("generate");
		mg.generate();
//		console.timeEnd("generate");
//		console.time("draw");
		mg.renderText();
//		console.timeEnd("draw");
		return false;
	});
});

