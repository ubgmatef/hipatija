var CSS_CLASS_ERROR = "error";

/** single field that holds data to be validated */
function ValField(name, type, desc, other)
{
	this.name = name;
	this.type = type;
	this.desc = desc;
	this.other = other;
}
/******************************************/
/** form validation
 * `elements` - an array of ValField objects
*/
function validateForm(formName, elements)
{
	var len = elements.length;

	var form = document.forms[formName];
	if (form == null) // invalid form
		return false;

	for (var i = 0; i < len; i++)
	{
		var el = form[elements[i].name];

		if (el.className)
			removeCSSClass(el, CSS_CLASS_ERROR);
	}

	// storing invalid field
	var invalid = new Array();
	for (var i = 0; i < len; i++)
		if (!validateField(form, elements[i]))
			invalid.push(elements[i]);

	var valid = true;
	if (invalid.length > 0)
	{
		valid = false;
		reportValidationError(form, invalid);
	}
	return valid;
}
/******************************************/
/** single field validation
 * `form` - Form object
 * `field` - ValField object
*/
function validateField(form, field)
{
	var el = form[field.name];
	// var el = jQuery(form).find("*[name=" + field.name + "]")[0]; // Ovo radi i kada ima jedan i kada ima vise elemenata sa istim imenom

	if (el == undefined)
		return false;

	var val = el.value;

	// Zbog disable-ovanih elemenata
	if (el.name == undefined)
		return true;

	var valid;
	var fieldType = field.type;
	
	if (fieldType == "non-null")
		valid = validateNonNull(val);
	else if (fieldType == "number-integer")
	{
		valid = validateNumberInteger(val);
	}
	else if (fieldType == "number-integer-non-negative")
	{
		valid = validateNumberIntegerNonNegative(val);
	}
	else if (fieldType == "number-integer-positive")
	{
		valid = validateNumberIntegerPositive(val);
	}
	else if (fieldType == "number-integer-negative")
	{
		valid = validateNumberIntegerNegative(val);
	}
	else if (fieldType == "number-decimal")
	{
		valid = validateNumberDecimal(val);
	}
	else if (fieldType == "number-decimal-non-negative")
	{
		valid = validateNumberDecimalNonNegative(val);
	}
	else if (fieldType == "number-decimal-positive")
	{
		valid = validateNumberDecimalPositive(val);
	}
	else if (fieldType == "number-decimal-negative")
	{
		valid = validateNumberDecimalNegative(val);
	}
	else if (fieldType == "text-area")
	{
		valid = validateTextAreaLength(field, val);
	}
	else if (fieldType == "text-ascii")
	{
		valid = validateAsciiText(val);
	}
	else if (fieldType == "integer-range")
	{
		valid = validateIntegerRange(field, val);
	}
	else if (fieldType == "decimal-range")
	{
		valid = validateDecimalRange(field, val);
	}
	else if (fieldType == "date")
		valid = validateDate(val);
	else if (fieldType == "time")
		valid = validateTime(val);
	else if (fieldType == "student-index")
		valid = validateStudentIndex(val);
	else if (fieldType == "custom")
	{
		if (field.other != undefined && field.other.validateFunction != undefined
			&& typeof(field.other.validateFunction) == "function")
		{
			delete field.other.errorMessage;
			valid = field.other.validateFunction(field, el);
		}
		else
			valid = false;
	}
	else if (fieldType == "password-strength")
		valid = validatePasswordStrength(val);
	else if (fieldType == "combo-has-options")
		valid = validateComboHasOptions(el);
	else if (fieldType == "combo-no-disabled-select")
		valid = validateComboNoDisabledSelect(el);
	else if (fieldType == "cyrilic-input")
		valid = validateCyrilicInput(val);
	else if (fieldType == "not-all-uppercase")
		valid = validateNotAllUppercase(val);
	else
		valid = false;

	if (!valid)
		addCSSClass(el, CSS_CLASS_ERROR);

	return valid;
}

/******************************************/
/** element type validation */
function validateNonNull(val)
{
	return (trim(val) != '');
}

function validateNumberInteger(val)
{
	// Mora se explicitno navesti da je regularna integer vrednost i
	// prazan string. Ako se to ne navede, javljace gresku cak i kada
	// je dozvoljeno da integer bude null a mi ostavimo polje prazno.
	if (val == '')
		return true;
	else
	{
		var re = /(^(-?\d+)$)/;
		return re.test(val);
	}
}

function validateNumberIntegerNonNegative(val)
{
	if (val == '')
		return true;
	else
	{
		var re = /(^(\d+)$)/;
		return re.test(val);
	}
}

function validateNumberIntegerPositive(val)
{
	if (val == '')
		return(true);
	else if (validateNumberInteger(val)){
		var n = parseInt(val);
		return (n > 0);
	} else {
		return false;
	}
}

function validateNumberIntegerNegative(val)
{
	if (val == '')
		return(true);
	else if (validateNumberInteger(val)){
		var n = parseInt(val);
		return (n < 0);
	} else {
		return false;
	}
}

function validateNumberDecimal(val)
{
	if (val == '')
		return true;
	else
	{
		var re = /^(-?\d+([,.]\d+)?)$/;
		return re.test(val);
	}
}

function validateNumberDecimalNonNegative(val)
{
	if (val == '')
		return true;
	else
	{
		var re = /^(\d+([,.]\d+)?)$/;
		return re.test(val);
	}
}

function validateNumberTwoDecimalNonNegative(val)
{
	if (val == '')
		return true;
	else
	{
		var re = /^(\d+([,.]\d{1,2})?)$/;
		return re.test(val);
	}
}

function validateNumberDecimalPositive(val)
{
	if (val == '')
		return(true);
	else if (validateNumberDecimal(val)){
		var d = parseCommaFloat(val);
		return (d > 0);
	} else {
		return false;
	}
}

function validateNumberDecimalNegative(val)
{
	if (val == '')
		return(true);
	else if (validateNumberDecimal(val)){
		var d = parseCommaFloat(val);
		return (d < 0);
	} else {
		return false;
	}
}

function validateTextAreaLength(field, val){
	// check if `maxlength` is defined
	if (field.other != undefined && field.other.maxlength != undefined && field.other.maxlength != ''){
		var maxlength = parseInt(field.other.maxlength);

		// serveru se prenosi EOL CR+LF duzine 2, a na klijentu je u js LF duzine 1, pa ga,
		// samo za potrebe provere duzine, menjamo sekvencom duzine 2 
		return(val.replace(/\n/g, "\r\n").length <= maxlength)
	}
	return(false);
}

function validateAsciiText(val){
	for (var i = 0; i < val.length; i++){
		var c = val.charCodeAt(i);
		if (c < 32 || c > 126)
			return false;
	}
	return true;
}

function validateIntegerRange(field, val){
	if (val == "")
		return true;
	// za neprazan string se automatski dodaje validacija za celobrojnu vrednost
	if (field.other == undefined)
		return false;
	if (field.other.min == undefined && field.other.max == undefined)
		return false;
	if (!validateNumberInteger(val)) // Postoji posebna validacija da je ovo polje integer
		return true;

	val = parseInt(val);
	var min, max;
	if (field.other.min != undefined && field.other.max != undefined){
		min = parseInt(field.other.min);
		max = parseInt(field.other.max);
		return(min <= val && val <= max);
	} else {
		if (field.other.min != undefined){
			min = parseInt(field.other.min);
			return(min <= val);
		} else {
			max = parseInt(field.other.max);
			return(val <= max);
		}
	}
}

function validateDecimalRange(field, val){
	if (val == "")
		return true;
	// za neprazan string se automatski dodaje validacija za float vrednost
	if (field.other == undefined)
		return false;
	if (field.other.min == undefined && field.other.max == undefined)
		return false;
	if (!validateNumberDecimal(val)) // Postoji posebna validacija da je ovo polje float
		return true;

	val = parseCommaFloat(val);
	var min, max;
	if (field.other.min != undefined && field.other.max != undefined){
		min = parseFloat(field.other.min);
		max = parseFloat(field.other.max);
		return(min <= val && val <= max);
	} else {
		if (field.other.min != undefined){
			min = parseFloat(field.other.min);
			return(min <= val);
		} else {
			max = parseFloat(field.other.max);
			return(val <= max);
		}
	}
}

function validateDate(val)
{
	if (val == '')
		return true;
	else
	{
		var re = /^((0?[1-9]|[12][0-9]|3[01])\.(0?[1-9]|10|11|12)\.(\d{4})\.?)$/i;
		return re.test(val);
	}
}

function validateTime(val)
{
	if (val == '')
		return true;
	else
	{
		var r = val.split(":");

		if (r.length != 2)
			return false;

		var re = /^[0-9]?[0-9]$/i;
		if (!re.test(r[0]) || !re.test(r[1]))
			return false;

		var hours = parseInt(r[0]);
		var minutes = parseInt(r[1]);
		
		if (isNaN(hours) || isNaN(minutes))
			return false;

		// Note: this has to be synchronized with TimeEdit.java
		return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
	}
}

var MIN_PASSWORD_LENGTH = 8;
var MAX_PASSWORD_LENGTH = 16;

function validatePasswordStrength(val)
{
	if (val.length < MIN_PASSWORD_LENGTH || val.length > MAX_PASSWORD_LENGTH)
		return false;

	var numUppercaseLetters = 0;
	var numLowercaseLetters = 0;
	var numDigits = 0;
	var numInvalid = 0;
	
	for (i = 0; i < val.length; i++)
	{
		c = val.charAt(i);

		if (c < '!' || c > '~')
			numInvalid++;
		else if (c >= 'A' && c <= 'Z')
			numUppercaseLetters++;	
		else if (c >= 'a' && c <= 'z')
			numLowercaseLetters++;
		else if (c >= '0' && c <= '9')
			numDigits++;
	}

	if (numUppercaseLetters == 0 || numLowercaseLetters == 0 || numDigits == 0 || numInvalid != 0)
		return false;
	
	return true;
}

function validateComboHasOptions(combo)
{
	return(combo
		&& (combo.disabled
			|| (combo.options && combo.options.length > 0)));
}

function validateComboNoDisabledSelect(combo)
{
	// Nije greska ako combo ne postoji, ceo je disable-ovan, nema opcije 
	// ili ako odabrana opcija nije disable-ovana
	return(!combo || combo.disabled || !combo.options || combo.options.length == 0
		|| !combo.options[combo.selectedIndex].disabled);
}

function validateCyrilicInput(val)
{
	if (val == '')
		return true;
	else
	{	
		var latin = /([\u0041-\u005A]|[\u0061-\u007A]|[\u00C0-\u00D6][\u00D8-\u00F6]|[\u00F8-\u024F])+/;
	
		return !latin.test(val);
	}
}

function isLetter(c)
{
	  return c.toLowerCase() != c.toUpperCase();
}

function validateNotAllUppercase(val)
{
	if (val == '')
		return true;

	var numLetters = 0;
	var numUppercaseLetters = 0;
	var valLength = val.length;
	for (i = 0; i < valLength; i++)
	{
		c = val.charAt(i);

		if (isLetter(c))
		{
			numLetters++;
			if (c == c.toUpperCase())
			{
				numUppercaseLetters++;
			}
		}
	}

	return(numLetters == 0 || numLetters != numUppercaseLetters);
	
}

// function validateStudentIndex(val) je u javascript.js

/******************************************/
/** Add validation error string */
function fokusirajElement(formName, elName){
	var el = jQuery("*[@name="+elName+"]:visible", "form[@name="+formName+"]").focus();
}

function addFormValidationErrorString(errStrings, form, el, typeMsg)
{
	var lnk = "<a href=\"javascript: ;\" onclick=\"fokusirajElement('"+form.name+"', '"+el.name+"'); return false;\" title=\"" + el.desc + "\">" + el.desc+"</a>";
	lnk += " (<span style='font-size: 11px;'>" + typeMsg + "</span>)";

	errStrings.push(lnk);
}

/** report validation error */
function reportValidationError(form, elements)
{
	var errStrings = new Array();

	for (var i = 0; i < elements.length; i++)
	{
		var typeMsg;
		switch(elements[i].type)
		{
		case "non-null":
			typeMsg = "Поље мора имати вредност";
			break;
		case "date":
			typeMsg = "Неисправан датум";
			break;
		case "time":
			typeMsg = "Неисправно време";
			break;
		case "number-decimal":
			typeMsg = "Неисправан број са зарезом";
			break;
		case "number-decimal-non-negative":
			typeMsg = "Неисправан ненегативан број са зарезом";
			break;
		case "number-decimal-positive":
			typeMsg = "Неисправан позитиван број са зарезом";
			break;
		case "number-decimal-negative":
			typeMsg = "Неисправан негативан број са зарезом";
			break;
		case "number-integer":
			typeMsg = "Неисправан цео број";
			break;
		case "number-integer-non-negative":
			typeMsg = "Неисправан ненегативан цео број";
			break;
		case "number-integer-positive":
			typeMsg = "Неисправан позитиван цео број";
			break;
		case "number-integer-negative":
			typeMsg = "Неисправан негативан цео број";
			break;
		case "text-area":
		{
			// serveru se prenosi EOL CR+LF duzine 2, a na klijentu je u js LF duzine 1, pa ga,
			// samo za potrebe provere duzine, menjamo sekvencom duzine 2
			var valLen = form[elements[i].name].value.replace(/\n/g, "\r\n").length;

			if (elements[i].other != undefined && elements[i].other.maxlength != undefined)
				typeMsg = "Поље садржи " + valLen + ", а може садржати највише " + elements[i].other.maxlength + " знакова";
			else
				typeMsg = "Поље садржи превелик број знакова (" + valLen + ")";
			break;
		}
		case "text-ascii":
			typeMsg = "Поље може садржати слова енглеске абецеде, цифре и знаке интерпункције";
			break;
		case "integer-range":
			if (elements[i].other == undefined && field.other.min == undefined && field.other.max == undefined){
				typeMsg = "Недефинисан опсег";
				break;
			}
			
			var min, max;
			if (elements[i].other.min != undefined && elements[i].other.max != undefined){
				min = parseInt(elements[i].other.min);
				max = parseInt(elements[i].other.max);
				typeMsg = "Вредност може бити најмање " + min + " а највише " + max;
			} else {
				if (elements[i].other.min != undefined){
					min = parseInt(elements[i].other.min);
					typeMsg = "Вредност може бити најмање " + min;
				} else {
					max = parseInt(elements[i].other.max);
					typeMsg = "Вредност може бити највише " + max;
				}
			}

			break;

		case "decimal-range":
			if (elements[i].other == undefined && field.other.min == undefined && field.other.max == undefined){
				typeMsg = "Недефинисан опсег";
				break;
			}
			
			var min, max;
			if (elements[i].other.min != undefined && elements[i].other.max != undefined){
				min = parseFloat(elements[i].other.min);
				max = parseFloat(elements[i].other.max);
				typeMsg = "Вредност може бити најмање " + (min + "").replace('.', ',') + " а највише " + (max + "").replace('.', ',');
			} else {
				if (elements[i].other.min != undefined){
					min = parseFloat(elements[i].other.min);
					typeMsg = "Вредност може бити најмање " + (min + "").replace('.', ',');
				} else {
					max = parseFloat(elements[i].other.max);
					typeMsg = "Вредност може бити највише " + (max + "").replace('.', ',');
				}
			}

			break;

		case "student-index":
			typeMsg = "Број индекса је у неисправном облику";
			break;
		case "custom":
			if (elements[i].other != undefined && elements[i].other.errorMessage != undefined)
				typeMsg = elements[i].other.errorMessage;
			else
				typeMsg = elements[i].type;
			break;
		case "password-strength":
			typeMsg = "Лозинка мора имати између " + MIN_PASSWORD_LENGTH + " и " + MAX_PASSWORD_LENGTH
				+ " знакова, мора садржати барем једно мало слово, велико слово и број, а "
				+ "може садржати само ЛАТИНИЧНА слова, бројеве и НЕКЕ знакове интерпункције";
			break;

		case "combo-has-options":
			typeMsg = "Не постоје ставке за одабир";
			break;

		case "combo-no-disabled-select":
			typeMsg = "Не сме бити одабрана ставка која је недоступна";
			break;
		case "cyrilic-input":
			typeMsg = "Поље не сме садржати латинична слова.";
			break;
		case "not-all-uppercase":
			typeMsg = "Поље не сме садржати искључиво велика слова.";
			break;
		default:
			typeMsg = elements[i].type;
		}

		addFormValidationErrorString(errStrings, form, elements[i], typeMsg);
	}

	reportEditFormValidation(errStrings);
}

/** Returns value for the input element with the specified name in the specified form */
function getFormInputValue(formName, inputName)
{
	var form = document.forms[formName];

	if (form == null)
		return("");

	var el = form[inputName];

	if (el == null)
		return("");

	return(el.value);
}

/** Returns value for the input element with the specified name in the specified form */
function setFormInputValue(formName, inputName, val)
{
	var form = document.forms[formName];

	if (form == null)
		return(false);

	var el = form[inputName];

	if (el == null)
		return(false);

	el.value = val;

	return(true);
}

/** Returns value for the selected item in the combo box with the specified name in the specified form */
function getFormSelectValue(formName, selectName)
{
	var form = document.forms[formName];

	if (form == null)
		return "";

	var combo = form[selectName];

	if (combo == null)
		return("");

	return(combo.options[combo.selectedIndex].value);
}

/** Adds a hidden parameter to the form */
function addHiddenParameter(form, name, value)
{
	var param = document.createElement("input");

	param.type = "hidden";
	param.name = name;
	param.value = value;

	form.appendChild(param);
}

/** Submits a form using onsubmit() if it exsits, or submit() otherwise */
function submitForm(form)
{
	form.uspesnoPredat = false;
	
	if (!form.onsubmit || form.onsubmit())
		form.uspesnoPredat = form.submit() != false; // I undefined je OK

	return(false);
}

function addComboOption(combo, optionId, optionValue, optionText)
{
	var option = document.createElement('option');

	if (optionId)
		option.id = optionId;

	option.value = optionValue;
	option.text = optionText;

	if (isMSIE())
		combo.add(option);
	else
		combo.add(option, null);
}
