
window.MAZE_GENERATOR = function(options) {
	var defaults = {
	};
	this.options = $.extend(true,defaults,options);
	this.options.width = parseInt(this.options.width);
	this.options.height = parseInt(this.options.height);
	this.initialize();
}

MAZE_GENERATOR.prototype = {
	initialize: function() {
	},
	generate: function() {
		this.data = new Array(this.options.height);
		for (var i = 0; i < this.options.height; i++)
			this.data[i] = new Array(this.options.width);
		this.genReq(Math.floor(Math.random()*this.options.height),Math.floor(Math.random()*this.options.width),0);
	},
	genReq: function(h,w,level) {
		this.data[h][w] = 1;

		var dirs = [];
		var ar = [0,1,2,3];
		while (ar.length > 0) {
			var r = Math.floor(Math.random()*ar.length);
			dirs[dirs.length] = ar[r];
			ar.splice(r,1);
		}

		for (var dir_i = 0; dir_i < dirs.length-1; dir_i++) {
			dir = dirs[dir_i];
			var nw=w,nh=h,cnt=0;
			if (dir == 0) nw++;
			else if (dir == 1) nh++;
			else if (dir == 2) nw--;
			else if (dir == 3) nh--;
			if (nw >= this.options.width || nh >= this.options.height || nw < 0 || nh < 0 || this.data[nh][nw]) continue;
			if (nw+1<this.options.width && this.data[nh][nw+1]) cnt++;
			if (nw>0 && this.data[nh][nw-1]) cnt++;
			if (nh+1<this.options.height && this.data[nh+1][nw]) cnt++;
			if (nh>0 && this.data[nh-1][nw]) cnt++;

			if (this.options.solidWalls) {
				if (nh>0 && nw+1<this.options.width && this.data[nh-1][nw+1] && !this.data[nh-1][nw] && !this.data[nh][nw+1]) continue;
				if (nh+1<this.options.height && nw+1<this.options.width && this.data[nh+1][nw+1] && !this.data[nh+1][nw] && !this.data[nh][nw+1]) continue;
				if (nh+1<this.options.height && nw>0 && this.data[nh+1][nw-1] && !this.data[nh+1][nw] && !this.data[nh][nw-1]) continue;
				if (nh>0 && nw>0 && this.data[nh-1][nw-1] && !this.data[nh-1][nw] && !this.data[nh][nw-1]) continue;
			}

			if (cnt <= 1) this.genReq(nh,nw,level+1);
		}
	},
	renderDiv: function() {
		sq = 15;
		this.container = $("#" + this.options.container);
		if (!this.container || this.container.length == 0) return this.error("Container element " + this.options.container + " does not exist");
		this.container.empty();
		this.box = $("<div class='mazeBox'></div>").width(this.options.width*sq).height(this.options.height*sq).appendTo(this.container);
		for (var i = 0; i < this.options.height; i++)
			for (var j = 0; j < this.options.width; j++)
				if (this.data[i][j])
					$("<div class='sq'></div>").css({left:j*sq+"px",top:i*sq+"px",width:sq+"px",height:sq+"px"}).appendTo(this.box);
	},
	renderText: function() {
		this.container = $("#" + this.options.container);
		if (!this.container || this.container.length == 0) return this.error("Container element " + this.options.container + " does not exist");
		this.container.empty();
		this.box = $("<div class='mazeTextBox'></div>").appendTo(this.container);

		var str = "";
		for (var i = 0; i < this.options.height; i++) {
			for (var j = 0; j < this.options.width; j++)
				str += (this.data[i][j]?"&#9632;":"&nbsp;");
			str += "<br>";
		}
		this.box.append(str);
	},
	render: function() {
		if (this.options.drawType == "div")
			this.renderDiv();
		else if (this.options.drawType == "text")
			this.renderText();
	},
	error: function(message) {
		alert(message);
		this.destroy();
	},
	destroy: function() {
		if (this.container)
			this.container.empty().unbind(".MAZE_GENERATOR");
	}
}
