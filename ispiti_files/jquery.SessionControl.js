/**
 * SessionControl(sessionTotalTime, reloadPage)
 *	@sessionTotalTime - session duration - in seconds
 *	@reloadPage - CGI that reloads session
 *
 *	da bi se pojedinacnoj strani zabranilo osvezavanje sesije, potrebno je da se
 *	pri inicijalizaciji SESSION_CONTROL_ENABLED postavi na `false`
 *		SESSION_CONTROL_ENABLED = false;
 *
 *	ako na pojedinacnoj strani treba prikazivati upozorenje o isteku sesije cak i ako
 *	je u nekom drugom tabu vec prikazano upozorenje (ako se radi npr. o stranici
 *	sa velikim formularom, na kojoj je vrlo bitno da ne dodje do isteka sesije), 
 *	potrebno je da se pri inicijalizaciji ALWAYS_SHOW_SESSION_ALERT postavi na `true`
 *		ALWAYS_SHOW_SESSION_ALERT = true; 
 */

var SESSION_CONTROL_ENABLED = true;
var ALWAYS_SHOW_SESSION_ALERT = false;

jQuery.extend({
	SessionControl: function(sessionTotalTime, reloadPage){
		if (!SESSION_CONTROL_ENABLED){
			return;
		}
		
		var sessionTimeAfterWarning = 300; // (seconds)	5 minuta
		
		var timeCheckIntervalTime = 10; // (seconds)

		var sessionExpired = false;
		
		var minutesLeft = Math.floor(sessionTimeAfterWarning / 60);
		var sessionTimeoutMessage = "Ако између отварања две стране апликације "
			+ "прође више од " + Math.floor(sessionTotalTime / 60) + " минута, из безбедносних "
			+ "разлога ћете аутоматски бити одјављени са система.\n\n"
			+ "Преостало је још " + minutesLeft + " мин. до аутоматског одјављивања. "
			+ "Да бисте продужили време за рад, кликните на \u201EOK\u201C.";
		
		var sessionReloadedMessage = "Време за рад је успешно продужено.";
		var sessionExpiredMessage = "Продужење времена за рад није успело!\n\nДа бисте наставили рад, морате поново да се пријавите.";

		function timeFormat(date){
			var h = date.getHours();
			var m = date.getMinutes();
			var s = date.getSeconds();
			
			if (h <= 9) h = "0" + h;
			if (m <= 9) m = "0" + m;
			if (s <= 9) s = "0" + s;
			
			return h + ":" + m + ":" + s;
		}

		function sessionReload(){
			//-------------------------------------
			jQuery.ajax({
				async: false, type: "POST", url: reloadPage,
				complete: function(request, options){
					
					var odgovor = request.responseText;
					var status = $(odgovor).find("#status").text();
					var osvezavanjeUspelo = status == 'true';	
					
					if (osvezavanjeUspelo){
						$.cookie('vremeOsvezavanja', new Date().getTime(), { path: '/' });
						alert(sessionReloadedMessage);
					} else {
						sessionExpired = true;
						alert(sessionExpiredMessage);
					}
				}
			});
		}

		function sessionShowWarning(){
		
			var date1 = new Date();
			
			$.cookie('vremeUpozorenja', date1.getTime(), { path: '/' });
			
			var message = timeFormat(date1) + "\n\n" + sessionTimeoutMessage;

			alert(message);
			
			sessionReload();
		}
		
		function checkTime(){
			
			if (sessionExpired)
				return;

			var trenutnoVreme = new Date().getTime();
			var vremeOsvezavanja = $.cookie('vremeOsvezavanja');
			var vremeUpozorenja = $.cookie('vremeUpozorenja');

			if (vremeOsvezavanja == null || isNaN(vremeOsvezavanja))
				vremeOsvezavanja = 0;
			if (vremeUpozorenja == null || isNaN(vremeUpozorenja))
				vremeUpozorenja = 0;

			if ((trenutnoVreme - (sessionTotalTime - sessionTimeAfterWarning) * 1000) > vremeOsvezavanja)
			{
				if (ALWAYS_SHOW_SESSION_ALERT || vremeUpozorenja <= vremeOsvezavanja)
				{
					sessionShowWarning();
				}
			}
		}
		//------------------------------------
		setInterval(checkTime, timeCheckIntervalTime * 1000);
	}
});
