$(document).ready(function() {
	$("#mazeControlsSubmit").click(function(e) {
		var opts = {
			container: "mazeContainer"
		};
		$.each($("#mazeControls > form").serializeArray(),function(i,v) {
			opts[v.name] = v.value;
		});
		var mg = new MAZE_GENERATOR(opts);
		mg.generate();
		mg.render();
		return false;
	});
});

