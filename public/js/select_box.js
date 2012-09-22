
if(window.ESTAT==null) window.ESTAT = function() { }
if(ESTAT.UC==null) ESTAT.UC = function() { }

// options.onchange(value) - вызывается при закрытии селекта + выборе значения.

ESTAT.UC.SELECT_BOX = function(options) {
	var defaults = {
		width: "auto",
		height: "auto",
		boxWidth: "auto",
		boxHeight: "auto",
		boxPosition: "bl",
		openOnFocus: false,
		padding: "4px 10px",
		customDrawer: null,
		onchange: null,
		switchMode: false
	}
	this.options = $.extend(defaults,options,true);
	this.value = this.options.value;
	delete this.options.value;
	this.opened = false;
	this.redraw();
}

ESTAT.UC.SELECT_BOX.prototype = {
	redraw: function() {
		var sb = this;
		this.container = $("#" + this.options.container);

		if (this.options.customDrawer && $.isFunction(this.options.customDrawer)) {
			var el = this.options.customDrawer();
		}
		else {
			var el = $(
				"<span class='val' id='" + this.options.container + "_val'></span>" +
				"<span class='val-right' id='" + this.options.container + "_caret'><span class='caret'></span></span>"
			);
		}

		this.box = $("<div class='box'></div>");
		this.link = $("<a class='val-group' href='javascript:void(0);'></a>").append(el);
		this.el = $("<div class='select-box'></div>").append(this.link).append(this.box).appendTo(this.container);

		this.link.bind("click.SELECT_BOX",function(e) {
			if (sb.openedOnFocus) {
				sb.openedOnFocus = false;
				return true;
			}
			if (sb.options.switchMode && sb.opened)
				sb.close();
			else
				sb.open();
			return true;
		});
		this.link.bind("focusin.SELECT_BOX",function(e) {
			if (sb.options.openOnFocus)
				sb.open();
			sb.openedOnFocus = true;
			setTimeout(function() { sb.openedOnFocus = false },200);
			return false;
		});

		this.valContainer = this.container.find("#" + this.options.container + "_val");
		this.valCaret = this.container.find("#" + this.options.container + "_caret");
		if (this.valContainer.length > 0) {
			this.valContainer.height(this.options.height).css("padding",this.options.padding);
			if (this.options.width == "auto")
				this.valContainer.width(this.valContainer.width()); // чтобы при смене текста в контейнере не менялась его ширина
			else {
				var w = parseInt(this.valContainer.outerWidth(true)) - parseInt(this.valContainer.width());
				w = parseInt(this.options.width) - this.valCaret.outerWidth(true) - w;
				this.valContainer.width(w>0?w:0);
			}
		}
		if (this.valCaret.length > 0) {
			this.valCaret.height(this.options.height).css("padding",this.options.padding);
		}

		this.val(this.value);
	},
	open: function() {
		if (this.opened)
			this.close();
		this.opened = true;
		this.link.addClass("focus");
		var sb = this;
		var html = "";

		for (var i = 0; i < this.options.options.length; i++)
			html += "<a " + (this.value == this.options.options[i].value?" class='sel'":"") + " href='javascript:void(0);' data-value='" + this.options.options[i].value + "'>" + this.options.options[i].html + "</a>";
		this.box.empty().append(html);
		this.box.css("display","block").css({width:this.options.boxWidth,height:this.options.boxHeight});

		if (this.options.boxPosition == "bl")
			this.box.css({left:0,top:this.link.outerHeight(true)});
		else if (this.options.boxPosition == "br")
			this.box.css({right:0,top:this.link.outerHeight(true)});
		else if (this.options.boxPosition == "tl")
			this.box.css({left:0,top:-this.box.outerHeight(true)});
		else if (this.options.boxPosition == "tr")
			this.box.css({right:0,top:-this.box.outerHeight(true)});

		this.box.find("a").bind("mouseover.SELECT_BOX",function(e) {
			sb.box.find("a").removeClass("sel");
			$(this).addClass("sel");
		}).bind("click.SELECT_BOX",function(e) {
			sb.val($(this).attr("data-value"));
			return true;
		});
		$(document).bind("click.SELECT_BOX" + this.options.container,function(e) {
			if (!sb.clickedInside(e.target,sb.link))
				sb.close();
			return true;
		}).bind("keydown.SELECT_BOX" + this.options.container,function(e) {
			if (e.keyCode == 38 || e.keyCode == 40) {
				e.preventDefault();
				var a = sb.box.find("a.sel");
				var new_a = a;
				if (e.keyCode == 38)
					new_a = a.prev("a");
				else if (e.keyCode == 40)
					new_a = a.next("a");
				else return;
				if (new_a.length > 0) {
					a.removeClass("sel");
					sb.val(new_a.attr("data-value"));
					new_a.addClass("sel");
				}
			}
			else if (e.keyCode == 9) {
				sb.close();
				return true;
			}
			else if (e.keyCode == 13) {
				sb.close();
				e.preventDefault();
			}
		});
	},
	close: function() {
		this.opened = false;
		this.link.removeClass("focus");
		this.box.css("display","none");
		this.box.empty();
		$(document).unbind(".SELECT_BOX" + this.options.container);
	},
	val: function(v) {
		if (this.options.onchange && $.isFunction(this.options.onchange))
			this.options.onchange(v);
		if (v) {
			this.value = v;
			if (this.valContainer && this.valContainer.length > 0)
				this.valContainer.text(v.length>0?this.getOptionHTML(v):"&nbsp;");
		}
		return this.value;
	},
	getOptionHTML: function(value) {
		for (var i = 0; i < this.options.options.length; i++)
			if (this.options.options[i].value == value) return this.options.options[i].html;
		return undefined;
	},
	clickedInside: function(domElement,target) {
		var el = $(domElement);
		var t = $(target);
		while (!el.is(t) && !el.is("html") && el.parent())
			el = el.parent();
		return el.is(t);
	},
	destroy: function() {
	}
}
