var configs = ["/data/die_umsiedlerin.json", "/data/der_bau.json","/data/uebungen/ue2_1.json", "/data/uebungen/ue2_2.json", "/data/uebungen/ue2_3.json"];
var currentConfigId = 0;

/*---------------------------------------------------------------------------------------------*/

var configSwitch;
var medienverweise;
var medienverweiseListItem;
var medienverweiseParent;
var BildText;

/*---------------------------------------------------------------------------------------------*/

function initialiseView() {

	//
	medienverweise = document.getElementsByClassName("medienverweise")[0];
	medienverweiseListItem = medienverweise.querySelector(".medienverweiseListItem");
	medienverweiseListItem.parentNode.removeChild(medienverweiseListItem);
	medienverweiseParent = medienverweise.parentNode;
	medienverweiseParent.removeChild(medienverweise);

	// set the switch function as onlick on the configSwitch element and display the config
	configSwitch = document.getElementById("configSwitch");
	configSwitch.onclick = function() {
		switchJsonConfig();
		entferneMehrfacheintraege();
		loadContentAndCreateLayout();
	};

	loadContentAndCreateLayout();
	/*---------------------------------------------------------------------------------------------*/


	//DETAIL-ANSICHT
	/*---------------------------------------------------------------------------------------------*/

	document.getElementById("wechselAnsicht").addEventListener("click", toggleDetailView_textauszug);
	document.getElementById("zurueck_Pfeil").addEventListener("click", zurueck);

	var viewRoot = document.getElementsByTagName("article")[0];
	var pfeilAktivitaet;
	var ansichtsWechsel;

	/*---------------------------------------------------------------------------------------------*/

	//
	function toggleDetailView_textauszug() {
		viewRoot.classList.toggle("ausblenden");
		viewRoot.classList.remove("einblenden");
		viewRoot.addEventListener("transitionend", wechselAnsicht);
		pfeilAktivitaet = true;
	}//ENDE toggleDetailView_textauszug()

	/*---------------------------------------------------------------------------------------------*/

	//BEINHALTEN VIER FUNKTIONEN FUER "wechselAnsicht()"
	function schalteKlassen(){
		viewRoot.removeEventListener("transitionend",wechselAnsicht);
		viewRoot.classList.toggle("detailview_textauszug");
		viewRoot.classList.toggle("ausblenden");
		viewRoot.classList.toggle("einblenden");
	}//ENDE schalteKlassen()

	/*---------------------------------------------------------------------------------------------*/

	//WECHSEL DER CSS-KLASSEN
	function wechselAnsicht(){
		if(ansichtsWechsel){
			schalteKlassen();
			ansichtsWechsel = false;
		}
		else {
			schalteKlassen();
			ansichtsWechsel = true;
		}
	}//ENDE wechselAnsicht()

	/*---------------------------------------------------------------------------------------------*/

	//PFEIL Aktivitaet
	function zurueck(){
		if(!pfeilAktivitaet) {
			neuLaden();
		}
		else {
			toggleDetailView_textauszug();
			pfeilAktivitaet = false;
		}
	}//ENDE zurueck()

	//Seite neue laden, Abfrage per confirm	
	function neuLaden() {
		var temp = confirm("Soll die Ansicht neu geladen werden?");
		if (temp == true) {
			location.reload();
		} else {
			//Nix passiert
		}
	}//ENDE neuLaden()

	/*---------------------------------------------------------------------------------------------*/

}//ENDE initialiseView()


/*---------------------------------------------------------------------------------------------*/

function switchJsonConfig() {
	if (currentConfigId < (configs.length - 1)) {
		currentConfigId = currentConfigId + 1;
	} else {
		currentConfigId = 0;
	}
}

/*---------------------------------------------------------------------------------------------*/

//Funktion entferneMehrfacheintraege verhindert doppelte Medienverweise
function entferneMehrfacheintraege() {
    var entferneMedienverweise = document.getElementsByClassName("medienverweise");
    
	if(medienverweise.hasChildNodes()){
	    for (i=0;i<entferneMedienverweise.length;i++) {
	        entferneMedienverweise[i].parentNode.removeChild(entferneMedienverweise[i]);
	    }//ENDE for-Schleife
	}//ENDE if-Anweisung
	
}//ENDE entferneMehrfacheintraege()

/*---------------------------------------------------------------------------------------------*/

function loadContentAndCreateLayout() {
	// we display the current config
	var pathSegments = configs[currentConfigId].split("/");
	configSwitch.textContent = pathSegments[pathSegments.length-1];

	document.getElementById("imgbox").hidden = true;
	document.getElementsByClassName("medienverweise").hidden = true;
	document.getElementById("textauszug").hidden = true;

	console.log("loadContentFromServer()");

	// we load the json data that contains the content that will be used to populate the view elements
	xhr("GET", ((currentConfigId && configs) ? configs[currentConfigId] : "/data/die_umsiedlerin.json"), null, function(xmlhttp) {
		// we read out the textual content from the response, parsing it as json -- try out with
		var textContent = xmlhttp.responseText;
		console.log("responseText from server is: " + textContent);
		var jsonContent = JSON.parse(textContent);
		console.log("responseText as json object is: " + jsonContent);

		// we read out the title and set it
		setTitle(jsonContent.title);

		// the content is a list of json objects. log its length
		console.log("length of content items loaded from server is: " + jsonContent.contentItems.length);

		// now iterate over the items checking its type and calling the appropriate function for creating the content item
		for (var i = 0; i < jsonContent.contentItems.length; i++) {
			var currentItem = jsonContent.contentItems[i];
			// log the item type
			console.log("type of item is: " + currentItem.type);
			switch (currentItem.type) {
				case "imgbox":
					createImgbox(currentItem);
					break;
				case "medienverweise":
					createMedienverweise(currentItem);
					break;
				case "textauszug":
					createTextauszug(currentItem);
					break;
				default:
					console.log("cannot handle item type: " + currentItem.type + ". Ignore for the time being...");
			}
		}
	});
}//ENDE loadContentAndCreateLayout()

/*---------------------------------------------------------------------------------------------*/

//Spalte ermitteln, in der das Elemente platziert werden soll
function ermittelSpalte(element, contentItem) {
	switch (contentItem.renderContainer){
		case "left":
			document.getElementById("left").appendChild(element);
			//alert("links")
			break;
		case "middle":
			document.getElementById("middle").appendChild(element);
			//alert("mitte")
			break;
		case "right":
			document.getElementById("right").appendChild(element);
			//alert("rechts")
			break;
		default:
			document.getElementById("right").appendChild(element);
			element.hidden = true;
	}
}//ENDE ermittelSpalte(element, contentItem)

/*---------------------------------------------------------------------------------------------*/

function setTitle(title) {
	console.log("setTitle(): " + title);
	document.getElementById("topicTitle").textContent = title;
}//ENDE setTitle(title)

/*---------------------------------------------------------------------------------------------*/


//ELEMENTE ERSTELLEN
/*---------------------------------------------------------------------------------------------*/

function createImgbox(contentItem) {
	console.log("createImgbox()");
	var imgbox = document.getElementById("imgbox");

	//Element in der Spalte platzieren, dem es in der JSON zugewiesen ist
	ermittelSpalte(imgbox, contentItem);

	// set hidden to false
	imgbox.hidden = false;

	// Bild aus src-Pfad
	imgbox.getElementsByClassName("hauptbild")[0].setAttribute("src", contentItem.src);

	// Wert fuer Figcaption wird aus JSON gelesen
	imgbox.getElementsByTagName("figcaption")[0].textContent = contentItem.description;
	// BildText bekommt den Wert von Figcaption
	BildText = imgbox.getElementsByTagName("figcaption")[0].textContent;
	//bei Klick auf den Kringel wird auslesenImgTxt() aufgerufen
	document.getElementsByClassName("kringel")[0].onclick = function() {auslesenImgTxt()};

	/*---------------------------------------------------------------------------------------------*/

	//auslesenImgTxt() gibt den Text aus description aus
	function auslesenImgTxt(){
		alert(BildText);
		//document.getElementsByClassName("kringel")[0].removeEventListener("click", auslesenImgTxt);
	}//ENDE auslesenImgTxt

	/*---------------------------------------------------------------------------------------------*/

}//ENDE createImgbox

/*---------------------------------------------------------------------------------------------*/

function createTextauszug(contentItem) {
	//alert("createTextauszug");
	console.log("createTextauszug()");
	var textauszug = document.getElementById("textauszug");

	//Element in der Spalte platzieren, der es in der JSON zugewiesen ist
	ermittelSpalte(textauszug, contentItem);

	textauszug.hidden = false;

	// the content will be provided by a server-side html file which we set as innerHTML in the local attachment site (the div element marked as "contentfragment")
	xhr("GET", contentItem.src, null, function(xmlhttp) {
		console.log("received response for textauszug");
		document.querySelector("#textauszug .wrapper .contentfragment").innerHTML = xmlhttp.responseText;
	});
}//ENDE createTextauszug

/*---------------------------------------------------------------------------------------------*/

function createMedienverweise(contentItem) {
	//alert("createMedienverweise(): " + JSON.stringify(contentItem));
	medienverweise.hidden = false;

	var currentMedienverweiseElement = medienverweise.cloneNode(true);
	medienverweiseParent.appendChild(currentMedienverweiseElement);

	for (var i=0; i<contentItem.content.length; i++) {
		var currentMedienverweiseListElementFromJSON = contentItem.content[i];
		var currentMedienverweiseListItem = medienverweiseListItem.cloneNode(true);

		//Headline des jeweiligen Medienverweis
		currentMedienverweiseElement.getElementsByTagName("h1")[0].textContent = contentItem.title;

		//Unterpunkte der jeweiligen Medienverweise
		currentMedienverweiseListItem.querySelector("a").textContent = currentMedienverweiseListElementFromJSON.title;
		currentMedienverweiseListItem.querySelector("a").href = currentMedienverweiseListElementFromJSON.src;
		currentMedienverweiseElement.getElementsByTagName("ul")[0].appendChild(currentMedienverweiseListItem);
	}
	//Element in der Spalte platzieren, dem es in der JSON zugewiesen ist
	ermittelSpalte(currentMedienverweiseElement, contentItem);

	/*---------------------------------------------------------------------------------------------*/

}//ENDE createMedienverweise

/*---------------------------------------------------------------------------------------------*/

