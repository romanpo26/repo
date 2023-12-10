document.addEventListener("DOMContentLoaded",
function (event) {

	//unobstrutive event binding
	document.querySelector("button")
		.addEventListener("click", function () {

			//call server to get the name
			$ajaxUtils
				.sendGetRequest("data/hi.json",
					function (rp) {
						var message = rp.key;
						message += " does ";
						if (rp.metallic) {
							message += "metallic prints";
						}
						else {
							message += "prints";
						}
						//document.querySelector("#content")
							//.innerHTML = message
					});
			});
		}
);