$(function () { //Same as document.addEventListener("DOMCOntentLoaded")

	// Same as document.querySelector("#navbarToggle").addEventListener
	$("#navbarToggle").blur(function (event) {
		var screenWidth = window.innerWidth;
		if(screenWidth < 768) {
			$("#collapsable-nav").collapse('hide');
		}
	});

  // In Firefox and Safari, the click event doesn't retain the focus
  // on the clicked button. Therefore, the blur event will not fire on
  // user clicking somewhere else in the page and the blur event handler
  // which is set up above will not be called.
  // Solution: force focus on the element that the click event fired on
  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });
});



(function (global) { //global is the indow object

var rp = {};

var homeHtml = "snippets/home-snippet.html";
//var allTeamUrl = "https://rp-art-default-rtdb.firebaseio.com/team.json";
var allGalleryUrl = "https://rp-art-default-rtdb.firebaseio.com/gallery.json";
var gcategoriesTitleHtml = "snippets/gallery-categories-title-snippet.html";
var gcategoryHtml = "snippets/gallery-category-snippet.html";
var galleryItemsUrl = "https://rp-art-default-rtdb.firebaseio.com/gallery.json?category=";
var galleryItemsTitleHtml = "snippets/gallery-items-title.html";
var galleryItemHtml = "snippets/gallery-item.html";



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



//Return '{{propName}}' substitute with propValue in'string' 
var insertProperty = function(string, propName, propValue) {
	var proptoReplace = "{{" + propName + "}}";
	string = string.replace(new RegExp(proptoReplace, "g"), propValue);
	return string;
};



//On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {
//On first load show home view
//showLoading("#main-content");
$ajaxUtils.sendGetRequest(
	homeHtml,
	function (responseText) {
		document.querySelector("#main-content").innerHTML = responseText;
	},
	false
	);
});

//Load menu categories view
rp.loadGalleryCategories = function() {
	//showloading("#main-content");
	$ajaxUtils.sendGetRequest(allGalleryUrl, buildAndShowGCategoriesHTML);
};

/// Load the menu items view
 // 'categoryShort' is a short_name for a category
rp.loadGalleryItems = function (categoryShort) {
	//showLoading("#main-content");
	$ajaxUtils.sendGetRequest(
		galleryItemsUrl + categoryShort + ".json",
		buildAndShowGalleryItemsHTML
		);
};


//Builds gallery page HTML with server data
function buildAndShowGCategoriesHTML (galleries) {
	//Load gallery categories page title snippet
	$ajaxUtils.sendGetRequest(
			gcategoriesTitleHtml,
			function (gcategoriesTitleHtml) {
				//Retrieve single category snippet
				$ajaxUtils.sendGetRequest(
					gcategoryHtml,
					function (gcategoryHtml) {
						var gcategoriesViewHtml = 
						buildGCategoriesViewHtml(galleries,
							gcategoriesTitleHtml,
							gcategoryHtml);
						insertHtml("#main-content", gcategoriesViewHtml);

					},
					false
				);
			},
			false
		);
}

 	// Using gallery category data and snippets html
  // build categories view HTML to be inserted into page
function buildGCategoriesViewHtml(galleries, gcategoriesTitleHtml, gcategoryHtml) {
	var finalHtml = gcategoriesTitleHtml;
	finalHtml += "<section class='row'>";

	//Loop over galleries
	for (var i = 0; i < galleries.length; i++) {
		//Insert category values
		var html = gcategoryHtml;
		var name = "" + galleries[i].name;
		var short_name = galleries[i].short_name;
		html = insertProperty(html, "name", name);
		html = insertProperty(html, "short_name", short_name);
		finalHtml += html;
	}

	finalHtml +="</section>";
	return finalHtml;
}


// Builds HTML for the single category page based
// on server data
function buildAndShowGalleryItemsHTML(categoryGalleryItems) {
	//Load gallery page title snippet
	$ajaxUtils.sendGetRequest(
		galleryItemsTitleHtml,
		function(galleryItemsTitleHtml) {
			//Retrieve single gallery item snippet
			$ajaxUtils.sendGetRequest(
				galleryItemHtml,
				function (galleryItemHtml) {
					var galleryItemsViewHtml = buildGalleryItemsViewHtml(
						categoryGalleryItems,
						galleryItemsTitleHtml,
						galleryItemHtml
						);
						insertHtml("#main-content", galleryItemsViewHtml);
					},
					false
				);
			},
			false
		);
}
	//Using category and gallery items data and snippets htmla
	// build gallery items view HTML and insert it into page
	function buildGalleryItemsViewHtml(
		categoryGalleryItems,
		galleryItemsTitleHtml,
		galleryItemHtml
	) {
		galleryItemsTitleHtml = insertProperty(
			galleryItemsTitleHtml,
			"name",
			categoryGalleryItems.category.name
		);
		galleryItemsTitleHtml = insertProperty(
			galleryItemsTitleHtml,
			"id",
			categoryGalleryItems.category.id
		);

		var finalHtml = galleryItemsTitleHtml;
		finalHtml += "<section class='row'>";

		//Loop over gallery items
		var galleryItems = categoryGalleryItems.gallery_items;
		var catShortName = categoryGalleryItems.category.short_name;
		for(var i = 0; i < galleryItems.length; i++) {
			//Insert menu item values
			var html = galleryItemHtml;
			html = insertProperty(html, "short_name", galleryItems[i].short_name);
			html = insertProperty(html, "catShortName", catShortName);
			html = insertItemPrice(html, "price_digital", galleryItems[i].price_digital);
			html = insertItemMediumName(
				html,
				"digital_image_name",
				galleryItems[i].digital_image_name
				);
			html = insertItemPrice(html, "price_print", galleryItems[i].price_print);
			html = insertItemMediumName(
				html,
				"print_image_name",
				galleryItems[i].print_image_name
			);
			html = insertProperty(html, "name", galleryItems[i].name);
			html = insertProperty(html, "description", galleryItems[i].description);

		// Add cleafix after evry second menu item
		if (i % 2 != 0) {
			html +=
				"<div class='clearfix visible-lg-block visible-md-block'></div>";
		}

		finalHtml += html;
	}

	finalHtml += "</section>";
	return finalHtml;

}

// Appends price with '$' if price exists

	function insertItemPrice(html, pricePropName, priceValue) {
		// Replace with empty string if unspecified
		if (!priceValue) {
			return insertProperty(html, pricePropName, "");
		}

		priceValue = "$" + priceValue.toFixed(2);
		finalHtml = insertProperty(html, pricePropName, priceValue);
		return html;
	}

	// Appends parents medium name if it exists
	function insertItemMediumName(html, mediumPropName, mediumValue) {
		//if not specified, return original string
		if (!mediumValue) {z
			return insertProperty(html, mediumPropName, "");
		}

		mediumValue = "(" + mediumValue + ")";
		html = insertProperty(html, mediumPropName, mediumValue);
		return html;
	}


global.$rp = rp; //exposing rp variable to global object to use in another page or script global=window

})(window);