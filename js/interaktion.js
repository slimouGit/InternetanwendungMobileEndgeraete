function initaliseView() {

    /*---------------------------------------------------------------------------------------------*/
    
    document.getElementById("wechselAnsicht").addEventListener("click", toggleDetailView_textauszug);
    document.getElementById("zurueck_Pfeil").addEventListener("click", zurueck);
    
    var viewRoot = document.getElementsByTagName("article")[0];
    var pfeilAktivitaet;
    var ansichtsWechsel;

    // Klick auf Kringel
	document.getElementsByClassName("kringel")[0].addEventListener("click", auslesenImgTxt);
	
	
	/*------- KRINGEL-AKTION ------------------------------------------------------------------*/
	
	function auslesenImgTxt(){
	    alert("Kommentar zum Schlumpf");
	}
	
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
            schalteKlassen()
            ansichtsWechsel = false;
        }
        else {
            schalteKlassen()
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
   
   function neuLaden() {
       var temp = confirm("Soll die Ansicht neu geladen werden?");
            if (temp == true) {
                location.reload();
            } else {
                
            }
   }//ENDE neuLaden()

    /*---------------------------------------------------------------------------------------------*/

}//ENDE initaliseView()