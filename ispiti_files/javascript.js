/**********************************************************************/
// jump handler for combo box navigation
function jump(obj)
{
	var val = obj.options[obj.selectedIndex].value;
	if(val == "")
		return false;

	document.location = val;
}
// jump handler for combo box navigation
// LOADs page in another windows
function jump2(obj, targ)
{
	targ.location = obj.options[obj.selectedIndex].value;
}

function addEvent(elm, evType, fn)
{
	if (elm.addEventListener)
	{
		elm.addEventListener(evType, fn, false);
		return true;
	}
	else if (elm.attachEvent)
	{
		var r = elm.attachEvent('on' + evType, fn);
		return r;
	}
	else
	{
		elm['on' + evType] = fn;
		// return ?
	}
}

/**********************************************************************/
function isMSIE()
{
	return ((navigator.userAgent.indexOf('Trident') != -1 || navigator.userAgent.indexOf('MSIE') != -1) ? true : false);
}

function isMSIE11()
{
	return !!(navigator.userAgent.match(/Trident/) && navigator.userAgent.match(/rv[ :]11/));
}

/**********************************************************************/
/**
 * `enableShowHide` - enables object to be visible/hidden on user's action
 *
 * `id` (String) - object that action has to be applied on
 * `caption` (String) - caption of switch link
 * `bVisible` (boolean) - if object is/is not visible by default
 **/
function enableShowHide(id, caption, bVisible)
{
	with(document)
	{
		var obj = getElementById(id);
		if(!obj)
			return;
		
		var cntId = "cont-"+id;
		var cnt = createElement("table");
			cnt.id = cntId;
			cnt.style.width = "100%";
		var capt = createElement("caption");
			capt.style.width = "100%";
		var captLnkId = "switch-"+id;
		var captLnk = createElement("a");
			captLnk.id = captLnkId;
			captLnk.appendChild(createTextNode(caption));
			captLnk.style.paddingLeft = "5px";
			capt.style.paddingLeft = "0px";
			capt.style.paddingRight = "0px";
			captLnk.href = "javascript: show('"+id+"', "+(bVisible ? false : true)+");";
		capt.appendChild(captLnk);
		cnt.appendChild(capt);
		
		var bd = createElement("tbody");
		var r = createElement("tr");
		var d = createElement("td");
			d.style.padding = 0;
		var obj2 = obj.cloneNode(true);
		d.appendChild(obj2);
		r.appendChild(d);
		bd.appendChild(r);
		cnt.appendChild(bd);
		
		obj.parentNode.replaceChild(cnt, obj);
		
		if(!bVisible)
			show(id, false);
	}
}
/**
 * `show` - shows/hides object
 *
 * `id` (String) - object's ID
 * `bShow` (boolean) - if object is visible(true) or hidden(false)
 **/
function show(id, bShow)
{
	with(document)
	{
		var cntId = "cont-"+id;
		var cnt = getElementById(cntId);
		if(cnt == null)
			return;
		
		var captLnkId = "switch-"+id;
		var captLnk = getElementById(captLnkId);
		if(captLnk == null)
			return;
		captLnk.href = "javascript: show('"+id+"', "+(bShow ? false : true)+")";
		
		var obj = getElementById(id);
		if(!obj)
			return;
		obj.style.display = bShow ? "" : "none";
	}
}
/**********************************************************************/
function confirmRedirect(message, url)
{
	if(confirm(message)) location.href = url;
}

function validateStudentIndex(val)
{
	if (val == '')
		return(true);
	else
	{
		return(new RegExp(GlobalJSConfig.indexRegexp).test(val));
	}
}

/**********************************************************************/
function toggleVisibility(elementId, linkId, openText, closeText)
{
	var el = document.getElementById(elementId);
	var link = linkId && openText && closeText
		? document.getElementById(linkId) : undefined;

	if (el)
	{
		if (el.style.display == 'none')
		{
			el.style.display = '';

			if (link)
				link.innerHTML = isMSIE() ? decodeURIComponent(escape(closeText)) : closeText;
		}
		else
		{
			el.style.display = 'none';

			if (link)
				link.innerHTML = isMSIE() ? decodeURIComponent(escape(openText)) : openText;
		}
	}
}

/**********************************************************************/
function toggleVisibilityClassName(checkBox, className)
{
	var elements = document.getElementsByClassName(className);

	var prikaz = checkBox.checked;

	for (var i = 0; i < elements.length; i++) 
		elements[i].style.display = prikaz ? 'table-cell' : 'none';
}

/**********************************************************************/
function isDigit(chr)
{
	return(chr && chr >= '0' && chr <= '9');
}

function isCopyFromWord(str)
{
	return(str.indexOf('<xml>') != -1 || str.indexOf('&lt;xml&gt;') != -1);
}

/**********************************************************************/
function strToDate(str)
{
	var parts = str.split('.');
	var date;

	if (parts.length == 3
		|| (parts.length == 4 && parts[3] == ''))
	{
		var day = parts[0] * 1;
		var month = parts[1] * 1;
		var year = parts[2] * 1;

		// Basic checks. TODO: Add better day checking
		if (!isNaN(day) && !isNaN(month) && !isNaN(year)
			&& day >= 1 && day <= 31
			&& month >= 1 && month <= 12)
			date = new Date(year, month - 1, day);
		else
			date = null;
	}
	else
		date = null;

	return(date);
}

function parseDate(str, threeLetterMonth, nameCase)
{
	var monthNames =
	[
	 	["", "", "", "", "", "", "", "", "", "", "", ""],
		["јануар", "фебруар", "март", "април", "мај", "јун", "јул", "август", "септембар", "октобар", "новембар", "децембар"],
		["јануара", "фебруара", "марта", "априла", "маја", "јуна", "јула", "августа", "септембра", "октобра", "новембра", "децембра"],
		["јануару", "фебруару", "марту", "априлу", "мају", "јуну", "јулу", "августу", "септембру", "октобру", "новембру", "децембру"],
		["јануар", "фебруар", "март", "април", "мај", "јун", "јул", "август", "септембар", "октобар", "новембар", "децембар"],
		["јануаре", "фебруаре", "марте", "априлу", "мају", "јуну", "јулу", "августе", "септембре", "октобре", "новембре", "децембре"],
		["јануаром", "фебруаром", "мартом", "априлом", "мајем", "јуном", "јулом", "августом", "септембром", "октобром", "новембром", "децембром"],
		["јануару", "фебруару", "марту", "априлу", "мају", "јуну", "јулу", "августу", "септембру", "октобру", "новембру", "децембру"]
	];
	var parts = str.split(' ');
	var date;

	if (parts.length == 3 && parts[0].substring(parts[0].length - 1) == "." && parts[2].substring(parts[2].length - 1) == ".")
	{
		var day = parts[0].substring(0, parts[0].length - 1) * 1;
		var month = null;
		for (var i = 0; i < monthNames[nameCase].length; i++)
		{
			var monthName = threeLetterMonth ? monthNames[nameCase][i].substring(0, 3) : monthNames[nameCase][i];
			if (monthName === parts[1])
				month = i + 1;			
		}

		var year = parts[2].substring(0, parts[2].length - 1 ) * 1;

		// Basic checks. TODO: Add better day checking
		if (!isNaN(day) && month != null && !isNaN(year)
			&& day >= 1 && day <= 31
			&& month >= 1 && month <= 12)
			date = new Date(year, month - 1, day);
		else
			date = null;
	}
	else
		date = null;

	return(date);
}

function dateToStr(date)
{
	var str;

	if (date)
	{
		var d = date.getDate();
		var m = date.getMonth() + 1;
		var y = date.getFullYear();

		str = d + "." + m + "." + y + ".";
	}
	else
		str = "";
	
	return(str);
}

/**********************************************************************/
var LBO_LEN = 11;
var JMBG_LEN = 13;

function isLBOInValidFormat(lbo)
{
	var numDigits;

	// Check if all characters are digits
	for(numDigits = 0; numDigits < lbo.length; numDigits++)
		if (!isDigit(lbo[numDigits]))
			break;

	return(numDigits == LBO_LEN);
}

/*
 * Returns a string describing invalid parts of the LBO
 * or null if the LBO is valid.
 */
function getLBOInvalidParts(lbo)
{
	var ret = '';

	if (!lbo)
		ret += "Није наведен ЛБО.";
	else if (!isLBOInValidFormat(lbo))
		ret += "ЛБО мора имати " + LBO_LEN + " цифара.";

	return(ret.length > 0 ? ret : null);
}

/*
 * Same as getLBOInvalidParts, but argument is input element containing the
 * string to be passed to getLBOInvalidParts.
 */
function getLBOInvalidPartsEl(lboEl)
{
	return(getLBOInvalidParts(lboEl ? lboEl.value : null));
}

/*
 * Same as getLBOInvalidPartsEl, but arguments are the form and the name of the
 * required input element.
 */
function getLBOInvalidPartsName(form, lboName)
{
	return(getLBOInvalidPartsEl(form[lboName]));
}

function isJMBGInValidFormat(jmbg)
{
	var numDigits;

	// Check if all characters are digits
	for(numDigits = 0; numDigits < jmbg.length; numDigits++)
		if (!isDigit(jmbg[numDigits]))
			break;

	return(numDigits == JMBG_LEN);
}

/*
 * Returns whether JMBG has valid checksum. Assumes JMBG has correct format.
 */
function isValidJMBGChecksum(jmbg)
{
	/* From http://sr.wikipedia.org/wiki/%D0%88%D0%B5%D0%B4%D0%B8%D0%BD%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%B8_%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%BD%D0%B8_%D0%B1%D1%80%D0%BE%D1%98_%D0%B3%D1%80%D0%B0%D1%92%D0%B0%D0%BD%D0%B0:
	 *
	 * Контролна цифра се израчунава формулом где ДДММГГГРРБББК = АБВГДЂЕЖЗИЈКЛ
	 * 
	 * Л = 11 - (( 7*(А+Е) + 6*(Б+Ж) + 5*(В+З) + 4*(Г+И) + 3*(Д+Ј) + 2*(Ђ+К) ) / 11)
	 * 
	 * ако је контролна цифра између 1 и 9, остаје иста (Л = К)
	 * ако је контролна цифра већа од 9, постаје нула (Л = 0)
	 */
	var a = jmbg[0] - '0', b = jmbg[1] - '0', v = jmbg[2] - '0';
	var g = jmbg[3] - '0', d = jmbg[4] - '0', dj = jmbg[5] - '0';
	var e = jmbg[6] - '0', zh = jmbg[7] - '0', z = jmbg[8] - '0';
	var i = jmbg[9] - '0', j = jmbg[10] - '0', k = jmbg[11] - '0';

	if (z == 6 && (zh == 6 || zh == 0))
		return(true);
	
	var l = 11 - ((7 * (a + e) + 6 * (b + zh) + 5 * (v + z)
				+ 4 * (g + i) + 3 * (d + j) + 2 * (dj + k))
				% 11);

	return((jmbg[12] - '0')
		== (l > 9 ? 0 : l));        
}

function birthDateFromJMBG(jmbg)
{
	var date;

	if (isJMBGInValidFormat(jmbg) && isValidJMBGChecksum(jmbg))
	{
		var d = parseInt(jmbg.substr(0, 2) * 1); // Mnozenje sa 1 da se 08 i 09 ne bi smatrali za nevalidan oktalni broj i vratili 0
		var m = parseInt(jmbg.substr(2, 2) * 1);
		var y = parseInt(jmbg.substr(4, 3) * 1);

		y += y < 500 ? 2000 : 1000;

		date = new Date(y, m - 1, d);
	}
	else
		date = null;

	return(date);
}

function isMaleFromJMBG(jmbg)
{
	var male;

	if (isJMBGInValidFormat(jmbg) && isValidJMBGChecksum(jmbg))
		male = parseInt(jmbg.substring(9, 12)) < 500;
	else
		; // Leave undefined

	return(male);
}

/*
 * Returns a string describing invalid parts of the JMBG or null if the JMBG is valid.
 * All arguments are strings. Gender must be 'm' or 'мушки' for male or 'z' or 'женски' for female.
 */
function getJMBGInvalidParts(birthDate, gender, jmbg)
{
	var ret = '';

	if (!birthDate)
		ret += "Није наведен датум рођења.";
	else if (!jmbg)
		ret += "Није наведен ЈМБГ.";
	else if (!isJMBGInValidFormat(jmbg))
		ret += "ЈМБГ мора имати " + JMBG_LEN + " цифара.";
	else
	{
		var genderCode = jmbg.substring(9, 12) * 1;

		if (gender == 'мушки')
			gender = 'm';
		else if (gender == 'женски')
			gender = 'z';

		// Check gender
		if (!gender || gender != (genderCode < 500 ? 'm' : 'z'))
			ret += "Не слаже се пол. ";

		var date = strToDate(birthDate);

		var dayJMBG = jmbg.substr(0, 2) * 1;
		var monthJMBG = jmbg.substr(2, 2) * 1;
		var yearJMBG = jmbg.substr(4, 3) * 1;

		yearJMBG += yearJMBG < 500 ? 2000 : 1000;

		if (!date
			|| date.getDate() != dayJMBG
			|| date.getMonth() + 1 != monthJMBG
			|| date.getFullYear() != yearJMBG)
			ret += "Не слаже се датум рођења. ";

		if (!isValidJMBGChecksum(jmbg))
			ret += "Не слаже се контролна сума.";
		
		if (ret.length > 0) 
			ret = "ЈМБГ није исправан: " + ret;
	}

	return(ret.length > 0 ? ret : null);
}

/*
 * Same as getJMBGInvalidParts, but arguments are input elements containing the
 * strings to be passed to getJMBGInvalidParts.
 */
function getJMBGInvalidPartsEl(birthDateEl, genderEl, jmbgEl)
{
	return(getJMBGInvalidParts(birthDateEl ? birthDateEl.value : null,
		genderEl ? genderEl.value : null,
		jmbgEl ? jmbgEl.value : null));
}

/*
 * Same as getJMBGInvalidPartsEl, but arguments are the form and the names of the
 * required input elements.
 */
function getJMBGInvalidPartsName(form, birthDateName, genderName, jmbgName)
{
	return(getJMBGInvalidPartsEl(form[birthDateName], form[genderName], form[jmbgName]));
}

/*
 * Returns a string with whitespace trimmed from both sides of the string
 */
function trim(str)
{
	return(str.replace(/^\s+|\s+$/g, ''));
}

/*
 * Returns a string with whitespace trimmed from left side of the string
 */
function ltrim(str)
{
	return(str.replace(/^\s+/g, ''));
}

/*
 * Returns a string with whitespace trimmed from right side of the string
 */
function rtrim(str)
{
	return(str.replace(/\s+$/g, ''));
}

function parseCommaFloat(str, decimalDigits)
{
	var fl = parseFloat(str.replace(',', '.'));
	if(isNaN(fl))
		return fl;
	if(decimalDigits)
		fl = fl.toFixed(decimalDigits);
	return(fl);
}

function formatTwoDec(num)
{
	return parseFloat(Math.round(num * 100 + 0.000005) / 100)
		.toString().replace('.', ',');
}

/*
 * Returns whether the object contains a CSS class
 */
function hasCSSClass(obj, cls)
{
	return(new RegExp('\\b' + cls + '\\b').test(obj.className));
}

/*
 * Adds a CSS class to the object if it doesn't already have it
 */
function addCSSClass(obj, cls)
{
	if (!hasCSSClass(obj, cls))
		obj.className += obj.className ? (' ' + cls) : cls;
}

/*
 * Removes a CSS class from the object
 */
function removeCSSClass(obj, cls)
{
	obj.className = obj.className.replace(new RegExp(' *\\b' + cls + '\\b', 'g'), '');
}

/*
 * Toggles a state of a CSS class
 */
function toggleCSSClass(obj, cls)
{
	if (hasCSSClass(obj, cls))
		removeCSSClass(obj, cls);
	else
		addCSSClass(obj, cls);
}

/*
 * Makes sure that only one of cls1 or cls2 class is active for object. If cls1
 * was active, it is removed and cls2 is used. If cls2 was active, it is removed
 * and cls1 is used. If none or both were used, cls1 is used.
 */
function swapCSSClass(obj, cls1, cls2)
{
	var h1 = hasCSSClass(obj, cls1);
	var h2 = hasCSSClass(obj, cls2);

	if (h1 && h2)
		removeCSSClass(obj, cls2);
	else if (!h1 && !h2)
		addCSSClass(obj, cls1);
	else if (h1)
	{
		removeCSSClass(obj, cls1);
		addCSSClass(obj, cls2);
	}
	else // if (h2)
	{
		removeCSSClass(obj, cls2);
		addCSSClass(obj, cls1);
	}
}

// vraca naslov odabrane opcije ComboBox-a
function currentComboText(combo){
	var ret = null;
	if (combo.selectedIndex != -1)
		ret = combo.options[combo.selectedIndex].innerHTML;
	return ret;
}

// isprazni ComboBox, ako je sadrzao NULL vrednost, ostavlja je
function emptyComboBox(combo, containsNull){
	if(containsNull == undefined)
		containsNull = false;
	if(containsNull){
		jQuery("option:not(:first)", combo).remove();
		jQuery("optgroup", combo).remove();
	} else {
		jQuery(combo).empty();
	}
}

// Iskljucuje/ukljucuje opciju u combo box-u
function setDisabledComboOptionByValue(combo, value, disabled)
{
	var changed = false;

	for(var i = 0; i < combo.options.length; i++)
	{
		if (combo.options[i].value == value)
		{
			combo.options[i].disabled = disabled;
			changed = true;
			break;
		}
	}

	if (changed && disabled && combo.options[combo.selectedIndex].value == value)
	{
		for(var i = 0; i < combo.options.length; i++)
		{
			if (!combo.options[i].disabled)
			{
				combo.selectedIndex = i;
				break;
			}
		}
	}

	return(changed);
}

function setVisibleComboOptionByValue(combo, value, visible)
{
	var changed = false;

	for(var i = 0; i < combo.options.length; i++)
	{
		if (combo.options[i].value == value)
		{
			combo.options[i].style.display = visible ? '' : 'none';
			changed = true;
			break;
		}
	}

	if (changed && visible && combo.options[combo.selectedIndex].value == value)
	{
		for(var i = 0; i < combo.options.length; i++)
		{
			if (combo.options[i].style.display == '')
			{
				combo.selectedIndex = i;
				break;
			}
		}
	}

	return(changed);
}

// Creates a sleep/pause/delay function which busy-waits. For debugging only!
function busyWait(millis)
{
	var start = new Date();

	while(new Date() - start < millis)
		;
}

function escapeRegExp(str)
{
	return(str.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1'));
}
