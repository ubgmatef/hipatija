jQuery.extend({
	log: function(text){
		if(typeof(text) == "object")
			text = text.toString();
		if(window.console)	window.console.debug(text);
		else 				jQuery.debug(text);
	},

	debug: function(obj){
		var text = "";

		if(typeof(obj) == "string")
			text = obj;
		else if(typeof(obj) == "object")
			for(var p in obj)
				text += p + ": " + obj[p] + "\n";
		else
			text = "Undefined\n";

		jQuery("#_debug_", document.body).remove();
		
		var t = jQuery("<table id='_debug_' border='1'>\
			<tr><td><button id='_dbg_close_' type='button'>Close</button></td></tr>\
			<tr><td><pre id='_dbg_text_'></pre></td></tr>\
		</table>")[0];
		
		jQuery("#_dbg_close_", t).click(function(e){
			jQuery("#_debug_", document.body).remove();
		});

		jQuery("#_dbg_text_", t).append(text);
		jQuery(document.body).append(t);

		jQuery("tr:eq(0) td", t).css({
			backgroundColor: "#c0c0c0"
		});
		jQuery("tr:eq(1) td", t).css({
			padding: 2
		});
		
		jQuery("#_dbg_close_", t).css({
			fontSize: 10
		});
		
		jQuery(t).css({
			fontSize: 10,
			backgroundColor: "#ffffff",
			position: "absolute", left: 150, width: 850, top: document.body.scrollTop + 50,
			border: "2px solid"
		});
	}
	
});

jQuery.fn.extend({
	// disable control
	disable: function(){
		return this.each(function(i){
			if(jQuery(this).is("input,select,button,textbox,option"))
				jQuery(this).attr("disabled", "disabled");
		});
	}, 

	// disable control
	enable: function(){
		return this.each(function(i){
			if(jQuery(this).is("input,select,button,textbox,option"))
				jQuery(this).removeAttr("disabled");
		});
	}, 


	drawList: function(params) {
		if (params == undefined)
			params = {styleEven: 'evenRow',
				styleOdd: 'oddRow',
				styleOver: 'highlightedRow',
				styleReset: 'resetRowCount',
				styleNoHighlightOver: 'noHighlightOver'
			};

		return this.each(function(i){
			if(this.tagName != "TABLE"){
				return;
			}
			jQuery("tbody", this).each(function(j){
				var r = 1; // resetable conter
				jQuery(this.rows).each(function(k){
					jQuery(this).removeClass(params.styleOdd + " " + params.styleEven + " " + params.styleOver);
					jQuery(this).addClass(r % 2 == 0 ? params.styleEven : params.styleOdd);

					// U IE ovo suvise sporo radi
					if (!jQuery.browser.msie && !jQuery(this).hasClass(params.styleNoHighlightOver))
					{
						jQuery(this).mouseover(function(e){
							jQuery(this).addClass(params.styleOver);
						});
						jQuery(this).mouseout(function(e){
							jQuery(this).removeClass(params.styleOver);
						});
					}

					if(jQuery(this).hasClass(params.styleReset))
						r = 1;
					else
						r++;
				});
			});
		});
	},
	
	// dodatna formatiranja `object-edit` tabela()
	formatObjectEdit: function(){
		return this.each(function(i, table){
			if(this.tagName != "TABLE"){
				return;
			}
			
			jQuery("tbody", table).each(function(j, tbody){
				var padRowTop = jQuery("<tr><td></td></tr>")[0];
				var padRowBottom = jQuery("<tr><td></td></tr>")[0];

				jQuery(">td,>th", padRowTop).css("height", 5);
				jQuery(">td,>th", padRowBottom).css("height", 5);

				jQuery(tbody).prepend(padRowTop);
				jQuery(tbody).append(padRowBottom);
			});
		});
	},

	getPosition: function(){
		var el = this[0];
		if(!el) return null;
		var pos = {width: 0, height: 0, left: 0, top: 0};
		// width
		if(el.offsetWidth) pos.width += el.offsetWidth;
		else if(el.width) pos.width += el.width;
		// height
		if(el.offsetHeight) pos.height += el.offsetHeight;
		else if(el.height) pos.height += el.height;
		// offset
		if(el.offsetParent) 
			while (el.offsetParent) {
				pos.left += el.offsetLeft;
				pos.top += el.offsetTop;
				el = el.offsetParent;
			}
		else {
			if(el.x) pos.left += el.x;
			if(el.y) pos.top += el.y;
		}	

		return pos;
	},
	
	maxZIndex: function(){
		var obj = this[0];
		if(!obj)
			return false;
		var max = parseInt(jQuery(obj).css("z-index"));
		var el = obj;
		if(isNaN(max))
			max = -1;
		jQuery("*", obj).each(function(i){
			var z = parseInt(jQuery(this).css("z-index"));
			if(!isNaN(z) && z > max){
				max = z;
				el = this;
			}
		});
		alert(max);
		return max;
	},

	// modifikacija koda sa stranice: https://gist.github.com/josheinstein/5092789
	// za kretanje strelicama gore i dole kroz kolone tabele za unos podataka
	enableCellNavigation: function (maxRows) {
		if (maxRows !== undefined)
			maxRows = parseInt(maxRows, 10);

		var arrow = { /* left: 37, */ up: 38, /* right: 39, */ down: 40 };

        // select all on focus
        this.find('input').keydown(function (e) {

            // shortcut for key other than arrow keys
            if ($.inArray(e.which, [/* arrow.left, */ arrow.up, /* arrow.right, */ arrow.down]) < 0) { return; }

            var input = e.target;
            var td = $(e.target).parents('td:first')

            var moveTo = null;

            // iz petlje se izlazi kada se fokusira odgovarajuce vidljivo i omoguceno polje
            // ili vise nema vidljivih i omogucenih polja iznad/ispod
            beskonacna:
            while(true)
            {
                var tr = td.parents('tr:first');
                var pos = td[0].cellIndex;

                var moveToRow = null;
                if (e.which == arrow.down) {
                	moveToRow = tr.nextAll('tr:not(.preskociStrelicama):visible:first');

                	// koja je po redu ovo visible vrsta u tabeli
                	var vidljivePreOve = tr.prevAll('tr:not(.preskociStrelicama):visible');
                	var brojVidljivih = vidljivePreOve != null ? vidljivePreOve.length : 0;
                	if (maxRows !== undefined && (brojVidljivih + 1) >= maxRows)
                		moveToRow = null;
                }
                else if (e.which == arrow.up) {
                	moveToRow = tr.prevAll('tr:not(.preskociStrelicama):visible:first');
                }

				if (moveToRow && moveToRow.length)
					moveTo = $(moveToRow[0].cells[pos]);

 				if (moveTo && moveTo.length) {
 					e.preventDefault();

 					var inputi = moveTo.find('input,textarea').filter(':visible:enabled');
 					if (inputi.length)
 					{
 						inputi.each(function (i, input) {

 							input.focus();
 							input.select();
 						});
 						break beskonacna;
 					}
 					else
 					{
 						if (e.which == arrow.down) {
 							tr = tr.nextAll('tr:not(.preskociStrelicama):visible:first');

 		                	// koja je po redu ovo visible vrsta u tabeli
 		                	var vidljivePreOve = tr.prevAll('tr:not(.preskociStrelicama):visible');
 		                	var brojVidljivih = vidljivePreOve != null ? vidljivePreOve.length : 0;
 		                	if (maxRows !== undefined && (brojVidljivih + 1) >= maxRows)
 		                		tr = null;
 						}
 						else if (e.which == arrow.up) {
 							tr = tr.prevAll('tr:not(.preskociStrelicama):visible:first');
 						}

 						if (tr && tr.length)
 							td = $(tr[0].cells[pos]);
 						else
 							break beskonacna;
 					}
 				}
				else
					break beskonacna;
            }
        });
    }
});
