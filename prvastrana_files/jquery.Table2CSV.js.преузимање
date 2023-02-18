﻿﻿/**
 * 	version 1.9
 * 
 *******************************************************************
 *	Table2CSV([invisibleClassAttributes])	- exports HTML table to CSV (comma-separated) file
 *	@invisibleClassAttributes				- classNames of inivisible items
 *
 *	Generates content for matching table that will be stored in CSV file
 *	Function retrieves all table sections (thead, tbodies and tfoot),
 *	all rows (TR) and cells (TD, TH), excluding invisble items.
 *	Invisible items are matched in two ways:
 *		- if element's style attribute contains `display: none;`
 *		- if element's class attribute matches one of the function parameters
 *	
 *	Optional parameter `invisibleClassAttributes` is either an array of class names
 *		e.g.	$(jqExpression).Table2CSV(["className1",...,"classNameN"])
 *
 *	or a string containimg comma-separated list of class names
 *		e.g.	$(jqExpression).Table2CSV("className1,...,classNameN") 
 *
 *******************************************************************
 *	Table2CSV_save(saveUri[, invisibleClassAttributes]) - save tabular data to CSV file trought CGI script that outputs file
 *	@saveUri - CGI script that creates application/vnd.ms-excel file
 *	@invisibleClassAttributes - classNames of inivisible items
 *
 *******************************************************************
 *	Table2CSV_prepare(saveUri[, invisibleClassAttributes[, arrNotExportableClasses]]) - initialize tables that could be exported to CSV file
 *	@saveUri - CGI script that creates application/vnd.ms-excel file
 *	@invisibleClassAttributes - classNames of inivisible items
 *	@arrNotExportableClasses - classNames of non-exportable tables
 *
 *******************************************************************
 */

var EXPORT_ICON = "res/export.png";
var TEXT_SAVE_DATA = "Извези податке";

var FIELD_DELIMITER = "\t";
var LINE_DELIMITER = "\r\n";

var QUOTE_VALUES = true;
var ENCODE_VALUES = false;

var TEXT_WARNING_WAIT = "Извоз података је у току.<br />Молим сачекајте...";
var ID_WARNING = "_table_export_warning_";

jQuery.fn.extend({
	//--------------------------------------------------------------
	Table2CSV: function(arrInvisibleClasses){
		var filter = undefined;
		var rowspansInfo = new Object();
		// formatting filter for invisible elements
		if(arrInvisibleClasses != undefined){
			// string
			if (typeof(arrInvisibleClasses) == "string") {
				filter = arrInvisibleClasses;
			}
			// non-empty array
			else if (arrInvisibleClasses.length != undefined && arrInvisibleClasses.length > 0) {
				jQuery(arrInvisibleClasses).each(function(i){
					if (this.charAt(0) != ".")
						arrInvisibleClasses[i] = "." + this;
				});
				filter = arrInvisibleClasses.join(",");
			}
		}
		// filter is either string type or undefined
		
		var out = "";
		// foreach `table` element
		jQuery(this).each(function(i){
			// caption, if exists
			var caption = jQuery("caption", this)[0];
			if(caption){
				caption = jQuery(caption).text();
				if(caption != "")
					out += caption + LINE_DELIMITER;
			}
				
			// inside table - for all rows in sections
			jQuery("thead tr,tbody tr,tfoot tr", this).each(function(i){
				if (this.style.display != "none") {
					
					out += jQuery(this).CSVRow(filter, i, rowspansInfo);
					
				}
			});
		});
		return out;
	},
	
	//--------------------------------------------------------------
	Table2CSV_save: function(saveUri, arrInvisibleClasses){

		if(!saveUri)
			throw("Invalid URI argument");
		
		jQuery.Table2CSV_showWarning();
		
		var table = this[0];
		var filename = jQuery(table).attr("name");
		if(!(filename && filename != "")){
			filename = jQuery(table).attr("id");
			if (!(filename && filename != "")) {
				filename = "tabela";
			}
		}
		filename += ".csv";
		
		//--------------------------------------------------------------
		function _submitData(){
		
			var text = jQuery(table).Table2CSV(arrInvisibleClasses);
			saveUri += filename;
			var form = jQuery("<form method='post' action='"+saveUri+"' style='display: none;'>\
					<input type='hidden' name='contentType' value='text/csv' />\
					<input type='hidden' name='characterEncoding' value='UTF-16LE' />\
					<input type='hidden' name='writeBOM' value='1' />\
					<textarea name='data'>"+text+"</textarea>\
				</form>")[0];
			
			if(jQuery.browser.msie){
				jQuery(form).append("<input type='hidden' name='allowCaching' value='1' />");
			}
			
			jQuery(document.body).append(form);
			jQuery(form).submit();
			jQuery(form).remove();
			
			jQuery.Table2CSV_hideWarning();
		}
		//--------------------------------------------------------------
		
		setTimeout(_submitData, 100);
	},
	
	//--------------------------------------------------------------
	Table2CSV_prepare: function(saveUri, arrInvisibleClasses, arrNotExportableClasses){
		if(!saveUri)
			throw("Invalid URI argument");

		var filter = undefined;
		// formatting filter for invisible elements
		if(arrNotExportableClasses != undefined){
			// string
			if (typeof(arrNotExportableClasses) == "string") {
				filter = "." + arrNotExportableClasses;
			}
			// array
			else if (arrNotExportableClasses.length != undefined && arrNotExportableClasses.length > 0) {
				jQuery(arrNotExportableClasses).each(function(k, v){
					if (v.charAt(0) != ".")
						arrNotExportableClasses[k] = "." + v;
				});
				filter = arrNotExportableClasses.join(",");
			}
		}
		
		return this.each(function(i){
			var table = this;
			if(!jQuery(table).is(filter)){
				var exportMenu = jQuery("<table class='non-printable invisible' border='1'><tr><td>\
					<img src='"+EXPORT_ICON+"' alt='"+TEXT_SAVE_DATA+"' title='"+TEXT_SAVE_DATA+"' />\
				</td></tr></table>")[0];
				
				jQuery(exportMenu).css({
					position: "absolute", backgroundColor: "#ffffff", padding: 0, width: "1px", height: "1px"
				});
				
				jQuery("td", exportMenu).css({
					border: "1px dashed #cccccc", textAlign: "center", verticalAlign: "middle", padding: 0
				});
				
				jQuery("img", exportMenu).css({border: "none", cursor: "pointer", margin: "3px"});
				
				jQuery("img", exportMenu).click(function(e){
					jQuery(table).Table2CSV_save(saveUri, arrInvisibleClasses);
				});
				
				jQuery(exportMenu).fadeTo(1, 0.8);
				
				jQuery(document.body).append(exportMenu);
				
				jQuery(table).mouseover(function(e){
					jQuery(exportMenu).removeClass("invisible");
					var pos = jQuery(table).GetPositionT2CSV();
					var posMenu = jQuery(exportMenu).GetPositionT2CSV();
					jQuery(exportMenu).css({left: pos.left + pos.width - posMenu.width - 5, top: pos.top - 5});
					//return false;
				});

				jQuery(table).mouseout(function(e){
					jQuery(exportMenu).addClass("invisible");
					//return false;
				});
				
				jQuery(exportMenu).mouseover(function(e){
					jQuery(exportMenu).removeClass("invisible");
					return false;
				});

				jQuery(exportMenu).mouseout(function(e){
					jQuery(exportMenu).addClass("invisible");
					jQuery(exportMenu).hide();
					return false;
				});
				
			}
		});

	},

	//--------------------------------------------------------------
	CSVRow: function(filter, i, rowspansInfo){
		// processing single `tr` element
		if(this.length == 0)
			return "";
		
		var r = this[0];
		//check if row satisfies invisible filter
		if(filter != undefined && jQuery(r).is(filter))
			return "";

		var indexRegExp = /^\d{1,4}\/\d{1,4}$/;
		var csvR = "";

		var jHTML = 0;

		jQuery("*", r).each(function(j){
			// processing cells - ignore other elements
			if (this.tagName == "TD" || this.tagName == "TH") {
				// inside row
				// ignore cell if style set to `display: none` skip the cell
				var invisible = (this.style.display == "none" || !jQuery(this).is(':visible'));
				// ignore cell if element matching filter
				if(filter != undefined)
					invisible = invisible || jQuery(this).is(filter);

				if (!invisible) {

					// add separators for empty cells based on rowspan in previous rows
					// *** Ako se u donjem desnom uglu tabele nalaze celije koje imaju rowspan,
					// u poslednjem redu (tj. poslednjim redovima) nece biti dodate prazne celije
					// koje im odgovaraju jer u jQuery.each() dodavanjem praznih celija ispred
					// samo pomeramo celije koje imaju neki sadrzaj.
					// Ovo mozda moze biti od znacaja kada se generisani fajl cita programski)
					for (var jrs in rowspansInfo)
					{
						if (jHTML == jrs)
						{
							var jrsIRs = rowspansInfo[jrs];

							for (var ind in jrsIRs)
							{
								var jrsIR = jrsIRs[ind];

								var irs = jrsIR[0];
								var rs = jrsIR[1];
								var cs = jrsIR[2];

								if (i < irs + rs)
								{
									csvR += FIELD_DELIMITER;
									jHTML++;

									// add separators for empty cells based on colspan in previous rows (when cell has defined rowspan and colspan)
									for (var k = 0; k < cs - 1; k++)	// - 1, jer smo jedno prazno vec obradili u rowspan delu - neposredno iznad
									{
										csvR += FIELD_DELIMITER;
										jHTML++;
									}
								}
							}
						}
					}

					var colspan = parseInt(jQuery(this).attr("colspan"));
					var isNan = isNaN(colspan);
					if (isNan || (!isNan && colspan < 1)) 
						colspan = 1;

					var rowspan = parseInt(jQuery(this).attr("rowspan"));
					var isNanRowspan = isNaN(rowspan);
					if (isNanRowspan || (!isNanRowspan && rowspan < 1)) 
						rowspan = 1;

					if (rowspan != 1)
					{
						var rsIj = rowspansInfo[jHTML + ""];
						if (rsIj == undefined)
						{
							rowspansInfo[jHTML + ""] = new Array();
						}

						rowspansInfo[jHTML + ""].push([i, rowspan, colspan]);
					}

					var clone = jQuery(this).clone();
					jQuery("br", clone).replaceWith(" ");
					var value = jQuery(clone).text();
					
					// encode
					if(ENCODE_VALUES){
						value = value
							.replace(/&/g, "&amp;")
							.replace(/</g, "&lt;")
							.replace(/>/g, "&gt;")
						;
						
					}
	
					// replace quotes
					value = value.replace(/\"/g, "\"\"");

					// Stop Excel from converting index numbers to dates.
					// Unfortunately, this doesn't work for OpenOffice, but
					// apostrophe which works for OpenOffice doesn't work for
					// Excel.
					if (indexRegExp.test(value))
						value = " " + value;

					// ako su child nodes samo jedno ciji je display none - da ne izvozi
					// value u csv za ono sto smo sakrili na ekranu
					var children = clone.children();
					if (children.length == 1 && children.get(0).display == 'none')
					{
						value = "";
					}

					// quote content
					// quting is necesarry only if string contains comma characted
					// specification allows all fields to be quoted
					if(QUOTE_VALUES)
						value = '"' + value + '"';
					
					csvR += value;
					// add separators for empty cells
					for (var k = 0; k < colspan; k++)
					{
						csvR += FIELD_DELIMITER;
						jHTML++;
					}
				}
			}
		});
		// remove comma from the end of generated texts
		csvR = csvR.substr(0, csvR.length - 1);
		// prepare for next row
		if(csvR != "")
			csvR += LINE_DELIMITER;
		
		return csvR;
	},
	
	//--------------------------------------------------------------
	GetPositionT2CSV: function(){
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
	}
	
});


jQuery.extend({
	Table2CSV_showWarning: function(){
		// disable page during generating result
		var warning = jQuery("<div id='"+ID_WARNING+"'><table align='center'><tr><td>"+TEXT_WARNING_WAIT+"</td></tr></table></div>")[0];
		// uzima se pozicija prve tabele, jer je ona nekad sira od body
		var pos = jQuery(jQuery(document.body).children("table")[0]).GetPositionT2CSV();
		jQuery(warning).css({
			position: "absolute", top: 0, left: 0, width: pos.width, height: pos.height, display: "none",
			backgroundColor: "#cccccc"
		});
		jQuery("table", warning).css({fontSize: 24, fontWeight: "bold", border: "3px double", backgroundColor: "#ffffff", marginTop: 200});
		jQuery("table tr td", warning).css({padding: "30px 50px", textAlign: "center"});
		
		jQuery(warning).fadeTo(1, 0.8, function(){
			jQuery(document.body).append(warning);
			jQuery(warning).show();
		});
	},
	
	Table2CSV_hideWarning: function(){
		jQuery("#"+ID_WARNING).remove();
	}
});

