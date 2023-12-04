$(function () { //Same as document.addEventListener("DOMCOntentLoaded")

	// Same as document.querySelector("#navbarToggle").addEventListener
	$("#navbarToggle").blur(function (event) {
		var screenWidth = window.innerWidth;
		if(screenWidth < 768) {
			$("#collapsable-nav").collapse('hide');
		}
	});
	$("navbarToggle").click(function(event){
		$(event.target).focus();
	});
});

(function (global) { //global is the indow object

var rp = {};
var homeHtml = "snippets/home-snippet.html";

//CONVENIENCE FUNCTION REPLACING INNERHTML FOR 'SELECT'
var insertHtml = function (selector, html) {
	var targetElem = document.querySelector(selector);
	targetElem.innerHTML = html;
};


// Show loadcin icon inside element identified by selector
var showLoading = function(selector) {
	var html = "<div class='text-center'>";
	//html += "img src='images/giphy.gif'></div>"; //<-- add animated sloth here
	insertHtml(selector, html);
};

//On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {

//On first load show home view
showLoading("#main-content");
$ajaxUtils.sendGetRequest(
	homeHtml,
	function (responseText) {
		document.querySelector("#main-content")
			.innerHTML = responseText;
	},
	false);
});

global.$rp = rp; //exposing rp variable to global object to use in another page or script global=window

})(window);