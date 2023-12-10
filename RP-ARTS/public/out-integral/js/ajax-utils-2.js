(function (global) {

//setup utility namesapce
var ajaxUtils = {};

//returns HTTP request object
function getRequestObject () {
	if (window.XMLHttpRequest) {
		return(new XMLHttpRequest()); 
	}
	else if (window.ActiveXObject) {
		//4 very old IE browsers
		return (new ActiveXObject("Microsoft.XMLHTTP"));
	}
	else {
		global.alert("Ajax unsupported!");
		return(null);
	}
}

ajaxUtils.sendGetRequest = 
	function(requestUrl, responseHandler, isJsonResponse)
		var request = getRequestObject();
		request.onreadystatechange =
		function () {
			handleResponse(request,
							responseHandler,
							isJsonResponse);
		};
		request.open("GET", requestUrl, true);
		request.sent(null); //for POST only

});

//ONLY CALLS USER PROVIDED 'RESPONSEHANDLER'
//FUNCTION IF RESPONSE IS READY
//AND NOT AN ERROR
function handleResponse(request, 
						responseHandler,
						isJsonResponse) {
	if( (request.readyState==4) &&
		(request.status==200) ) {
		if(isJsonResponse ==undefined) {
			isJsonResponse = true;
		}

		if(isJsonResponse) {
			responseHandler(JSON.parse(request.responseText))
		}
		else {
			responseHandler(request.responseText);
		}
	}
}


global.$ajaxUtils = ajaxUtils;



