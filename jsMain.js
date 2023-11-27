
/*          https://wwwlab.iit.his.se/c20adael/Webbprogrammering/Webbsida/Webbprogrammering-API-2014-/admin/editresource.php    */
/*---------------------------------validering av registrering-------------------------------------*/
function isGreen() {
    if (document.getElementById("username").style.backgroundColor == "rgb(204, 255, 170)" &&
        document.getElementById("fnamn").style.backgroundColor == "rgb(204, 255, 170)" &&
        document.getElementById("enamn").style.backgroundColor == "rgb(204, 255, 170)" &&
        document.getElementById("email").style.backgroundColor == "rgb(204, 255, 170)" &&
        document.getElementById("adress").style.backgroundColor == "rgb(204, 255, 170)") {
        document.getElementById("regKnapp").removeAttribute("disabled");
    }
    else {
        document.getElementById("regKnapp").setAttribute("disabled", true);
    }

}

function validate(id) {
    var textinput = document.getElementById(id);
    var val = textinput.value;

    // Match is null if there is no match
    if (val.match(/^[a-zA-Z]+$/) != null) {
        textinput.style.backgroundColor = "#cfa";

        isGreen();
    } else {
        textinput.style.backgroundColor = "#f57";
        isGreen();
    }
}

function validateEmail(email) {
    var textinput = document.getElementById(email);
    var val = textinput.value;

    
    if (textinput.value.indexOf("@") != -1 && textinput.value.indexOf(".") != -1) {
        textinput.style.backgroundColor = "#cfa";
        isGreen();
    } else {
        textinput.style.backgroundColor = "#f57";
        isGreen();
    }
}

function validateAdress(adress) {
    var textinput = document.getElementById(adress);
    var val = textinput.value;

    
    if (val.match(/^[a-zA-Z0-9ÅÄÖåäö ]+$/) != null) {
        textinput.style.backgroundColor = "#cfa";
        isGreen();
    } else {
        textinput.style.backgroundColor = "#f57";
        isGreen();
    }
}


/*------------------------------------------------------------------------------------------*/

/*----------------------------------Sidnavigering---------------------------------------*/
function showpage(pageid) {
    if (pageid == "page6") {
        /*Shows the varukorg ontop of the other pages*/
        document.getElementById(pageid).style.display = "block";
        goShow();
    }
    else {
        var pages = document.getElementsByClassName("page");
        for (var i = 0; i < pages.length; i++) {
            pages[i].style.display = "none";
        }

        /*Just checking if the animation for the removal of the varukorg should play */
        var varukorgdiv = document.getElementById('page6');
        var computedStyle = window.getComputedStyle(varukorgdiv);
        var isDisplayStyleNone = computedStyle.display === 'none';
        if(isDisplayStyleNone== false){
            goHide();
        }
    }
    document.getElementById(pageid).style.display = "block";
}
function hidekundvagn(pageid) {
    document.getElementById(pageid).style.display = "none";
}
/*------------------------------------------------------------------------------------------*/


/*---------------------------------------HISTORY CODE----------------------------------------------*/

function historyChange(event) {
    if(event.state.includes('timevar')){
        document.getElementById('from').value = event.state.substring(7);
    }
    else{
        showpage(event.state);
    }
}

function updateHistory(token, state) {
    history.pushState(token, "Titel: " + token, "");
}

function setupHistory() {
    window.onpopstate = function (event) {
        historyChange(event);
    };
}

function showpagehistory(pageid) {
    showpage(pageid);
    updateHistory(pageid);
    event.preventDefault();
}
/*------------------------------------------------------------------------------------------*/


/*---------------------------------Hur Produkten hamnar i kundvagn-------------------------------*/
var prodLimiter = 0;
function chooseProd(x, prodID) {
    if (document.getElementById("li" + x) == null && prodLimiter == 0) {
        prodLimiter = 1;
        var list = document.getElementById("ulCart");

        var listItem = document.createElement("li");
        listItem.innerHTML = x;
        listItem.id = "li" + x;
        listItem.value = x;
        list.appendChild(listItem);

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = x;
        listItem.appendChild(checkbox);

        var sublitknapp = document.createElement("button");
        sublitknapp.innerHTML = "ta bort";
        sublitknapp.onclick = function () { chooseProd(x); };
        listItem.appendChild(sublitknapp);
        var y = 1;
        getVarukorg(x, y, prodID);
        alertProdChoice(x);
    }
    else if (document.getElementById(x).checked == true) {
        document.getElementById("li" + x).remove();
        var y = 2;
        prodLimiter = 0;
        getVarukorg(x, y);
    }
    else if (prodLimiter == 1 && document.getElementById(x).checked == true){
        alert("bara en produkt!");
    }
    else {
        alert("Du måste kryssa i rutan");
    }
}
/*------------------------------------------------------------------------------------------*/


/*--------------------Hur Produkterna som är valda hamnar på bokningssidan-------*/

function getVarukorg(x, y, prodID) {

    if (y == 1) {
        var div = document.getElementById("testcont");
        div.innerHTML = x;
        var idDiv = document.getElementById("idCont");
        idDiv.innerHTML = prodID;
    }
    else if (y == 2) {
        document.getElementById(x).remove();
    }

}
/*------------------------------------------------------------------------------------------*/


/*----------------------------------REGISTRERA EN ANVÄNDARE------------------------------------*/
function regUser() {
    var customerID = document.getElementById("username").value;
    var firstname = document.getElementById("fnamn").value;
    var lastname = document.getElementById("enamn").value;
    var email = document.getElementById("email").value;
    var address = document.getElementById("adress").value;
    var auxdata = document.getElementById("auxdata").value;

    $.ajax({

        type: 'POST',
        url: 'Webbprogrammering-API-2014-/booking/makecustomer_XML.php',
        data: {
            ID: escape(customerID),
            firstname: escape(firstname),
            lastname: escape(lastname),
            email: escape(email),
            address: escape(address),
            auxdata: escape(auxdata),
        },
        success: ResultCustomern(customerID),

        error: "errormsg"
    });

    function ResultCustomern(customerID) {
        alert("Användaren " + customerID + " har registrerats!");
    }
}
/*--------------------------------------------------------------------*/



/*--------------------------Datepicker---------------------------- */
function loaded() {
    $("#from").datepicker({
        dateFormat: 'yy-mm-dd',
        showOn: "both",       
        onSelect: function(dateText, inst){
           $("#to").datepicker("option","minDate" ,
           $("#from").datepicker("getDate"));
        }
      });
      $("#to").datepicker({
        dateFormat: 'yy-mm-dd',
      });
    }
/*--------Alert som säger om något är tillagt i varukorgen-------------*/

function alertProdChoice(prod){
     alert(document.getElementById(prod).innerHTML+" tillagd i varukorgen!")
}

/*--------------------------------------------------------------*/

function datepickerhistory(){
    updateHistory('timevar'+document.getElementById("from").value);
}




/*-------------------Loggar in användaren och matchar användarid med databasen------------------------------*/
var customerGET = "";
function GetCusomerFunctionCaller() {
    event.preventDefault();
    customerGET = document.getElementById("loginName").value;
    $.ajax({
        type: 'POST',
        url: 'Webbprogrammering-API-2014-/booking/getcustomer_XML.php',
        data: {
            customerID: escape(customerGET)
        },
        success: matchid,
        error: errormsg
    });
}

function errormsg(jqXHR, textStatus, errorThrown) {
    alert("AJAX Error:" + errorThrown);
}


function matchid(returnedData) {
    a=1;
    var resultset = returnedData.childNodes[0];
    for (i = 0; i < resultset.childNodes.length; i++) {
        // Iterate over all child nodes of that node that are booking nodes
        if (resultset.childNodes.item(i).nodeName == "customer") {
            // Retrieve first name and last name for node
            var customer = resultset.childNodes.item(i);
            if (customer.attributes['id'].nodeValue == customerGET) {
                checkLocalStorage();
                document.getElementById('login').style.display = "none";
                document.getElementById('nlogin').style.display = "block";
            }
        }
    }
}

/*-----------Denna delen körs när användaren klickar på knappen min sida.-------------------------
-------------När man klickar på min sida så kontaktar sidan databasen och-------------------------
-------------hämtar info om den användaren som finns i local storage----------------------------*/
function GetUserOnClickMinSida() {
    event.preventDefault();
    customerGET = localStorage.getItem("username");
    $.ajax({
        type: 'POST',
        url: 'Webbprogrammering-API-2014-/booking/getcustomer_XML.php',
        data: {
            customerID: escape(customerGET)

        },
        success: GenerateMinSida,
        error: errormsg

    });


    /*--------------------------------This part gets the customers bookings------------------------------------*/
    $.ajax({
        type: 'POST',
        url: 'Webbprogrammering-API-2014-/booking/getcustomerbookings_XML.php',
        data: {
            customerID: escape(customerGET),
            type: escape("test 1")
        },
        success: generateBookingHistory,
        error: errormsg

    });


}

/*-------------------------------Here we generate the information about the customer on his page-------------------------------------*/
function GenerateMinSida(returnedData) {
    var resultset = returnedData.childNodes[0];
    var output="<table>";

    for (i = 0; i < resultset.childNodes.length; i++) {
        // Iterate over all child nodes of that node that are customer nodes
        if (resultset.childNodes.item(i).nodeName == "customer") {

            // Retrieve and display attrubutes from database
            var customer = resultset.childNodes.item(i);
                output+="<tr><td>Användarnamn: "+customer.attributes['id'].nodeValue+"</td></tr>";
                output+="<tr><td>Förnamn: "+customer.attributes['firstname'].nodeValue+"</td></tr>";
                output+="<tr><td>Efternamn: "+customer.attributes['lastname'].nodeValue+"</td></tr>";
                output+="<tr><td>Adress: "+customer.attributes['address'].nodeValue+"</td></tr>";
                output+="<tr><td>Mejl: "+customer.attributes['email'].nodeValue+"</td></tr>";
                output+="<tr><td>Auxdata: "+customer.attributes['auxdata'].nodeValue+"</td></tr>";   
        }
    }
    output+="</table>"
	var div=document.getElementById('MinSidaDiv');
	div.innerHTML=output;    

}


/*-----------------------------------This function generates a table with the customers bookings and displays it---------------------------------*/
function generateBookingHistory(returnedData){
    var resultset = returnedData.childNodes[0];
    if(resultset.childNodes.length==1){
        var output="inga bokningar gjorda";
        var div=document.getElementById('bokningsHistorik');
        div.innerHTML=output;
    }else{
        var output="<table class='histTable'>";
        output+="<thead><tr><th>Produkt</th> <th>Från</th>  <th>Till</th>  <th>Skärm</th> <th>Grafikkort</th> <th>Processor</th> <th>Cost</th> <th>size</th> <th>Ta bort</th></tr></thead>";
        output+="<tbody>";
        for (i = 0; i < resultset.childNodes.length; i++) {
            // Iterate over all child nodes of that node that are booking nodes
            if (resultset.childNodes.item(i).nodeName == "booking") {
                output+="<tr>";

                // Retrieve and display data from database
                var customer = resultset.childNodes.item(i);
                    output+="<td>"+customer.attributes['name'].nodeValue+"</td>";
                    output+="<td>"+customer.attributes['date'].nodeValue+"</td>";
                    output+="<td>"+customer.attributes['dateto'].nodeValue+"</td>";
                    output+="<td>"+customer.attributes['company'].nodeValue+"</td>";
                    output+="<td>"+customer.attributes['location'].nodeValue+"</td>";
                    output+="<td>"+customer.attributes['category'].nodeValue+"</td>";
                    output+="<td>"+customer.attributes['cost'].nodeValue+"</td>";
                    output+="<td>"+customer.attributes['size'].nodeValue+"</td>"; 
                    output+="<td><button id='Avboka' onclick='removeBooking(`"+customer.attributes['resourceID'].nodeValue+"`, `"+customer.attributes['customerID'].nodeValue+"`, `"+customer.attributes['date'].nodeValue+"`)'>Avboka</button></td>";   
            }
            output+="</tr>"
        }
        output+="</tbody></table>"
        var div=document.getElementById('bokningsHistorik');
        div.innerHTML=output;
    }
}
/*--------------------------------------------------------------------*/


/*---------------------------------Removes a booking from a user-----------------------------------*/
function removeBooking(bookedProdID, userID, date){
    $.ajax({
        type: 'POST',
        url: 'Webbprogrammering-API-2014-/booking/deletebooking_XML.php',
        data: {
            resourceID: escape(bookedProdID),
            date: escape(date),
            customerID: escape(userID)
        },
        success: GetUserOnClickMinSida,
        error: errormsg

    });


}
/*--------------------------------------------------------------------*/



/*-----------------------------LOCAL STORAGE FUNKTION--------------------------------*/
function checkLocalStorage() {
    var username = localStorage.getItem("username");
    if (username != null && username != "") {
        alert('Welcome again ' + username + '!');
        document.getElementById("login").style.display="none";
        document.getElementById("nlogin").style.display="block";
    } else {
        username = document.getElementById("loginName").value;
        localStorage.setItem("username", username);
        
    }
}

function clearLocalStorage() {
    localStorage.setItem('username', '');
    document.getElementById("login").style.display="block";
        document.getElementById("nlogin").style.display="none";
}
/*------------------------------------------------------------------------------*/


/*--------------------------------------Get Customer ID from localstorage----------------------------------------*/
function getCostId(){
    var costomerID;
    showBuyProd()
    if (localStorage.getItem("username") != null){
        costomerID = localStorage.getItem("username");
        document.getElementById("bookingName").value=costomerID
    
    }
}
/*------------------------------------------------------------------------------*/


/*----------------------------------------Make Booking--------------------------------------*/
function makebooking(){
    var prodID = document.getElementById("idCont").innerHTML;
    var userID = document.getElementById("bookingName").value;
    var datefrom = document.getElementById("from").value;
    var dateto = document.getElementById("to").value;

    $.ajax({
        type: 'POST',
        url: 'Webbprogrammering-API-2014-/booking/makebooking_XML.php',
        data: {
            resourceID: encodeURIComponent(prodID),
            date: encodeURIComponent(datefrom),
            dateto: encodeURIComponent(dateto),
            customerID: encodeURIComponent(userID),
            type: "test 1"
        },
        success: alert("det gick"),
        error: "errormsg"
    });

    
}
/*------------------------------------------------------------------------------*/



/*--------------------------------------When Searching for Product----------------------------------------*/
function searchProd(){

    $.ajax({

        type: 'POST',
        url: 'Webbprogrammering-API-2014-/booking/getresources_XML.php',
        data: {
            type: "test 1"
        },
        success: GenerateSearchResult,

        error: "errormsg"
    });

}

/*--------------------------------------Generate HTML For search result----------------------------------------*/
function GenerateSearchResult(returnedData) {
    const regex = new RegExp(document.getElementById('searchValue').value);
    var resultset = returnedData.childNodes[0];
    //var output="<table>";
    var output="<div class='prodCont'>";
    for (i = 0; i < resultset.childNodes.length; i++) {
        // Iterate over all child nodes of that node that are resource nodes
        if (resultset.childNodes.item(i).nodeName == "resource") {
            // Retrieve data from database and display it on search page
            var resource = resultset.childNodes.item(i);
            if(regex.test(resource.attributes['name'].nodeValue) == true){
            output+="<div class='prodCard' onclick='chooseProd(`"+resource.attributes['name'].value+"`, `"+resource.attributes['id'].value+"`);'>"
					output+="<div class='cardTitle'>"+resource.attributes['name'].value+"</div>";             
                    output+="<div class='picCont'>"
                        output+="<canvas class='cardPic' style='border: 2px solid red;'>";
                    output+="</div>"; 
                    output+="<div class='prodInfoCont'>";
                        output+="<div>"+resource.attributes['company'].value+"</div>";
                        output+="<div>"+resource.attributes['location'].value+"</div>";
                        output+="<div>"+resource.attributes['category'].value+"</div>";
                        output+="<div>"+resource.attributes['size'].value+"GB m.2 drive</div>";
                        output+="<div>"+resource.attributes['cost'].value+" sek</div>";
                    output+="</div>" 
                output+="</div>"
            }     
        }
    }
    output+="</div>";
	var div=document.getElementById('placeProdHere');
	div.innerHTML=output;    
}
/*------------------------------------------------------------------------------*/



/*-------------------------------------Booking page Product Display-----------------------------------------*/
function getResourcesForProdPage(){

    $.ajax({

        type: 'POST',
        url: 'Webbprogrammering-API-2014-/booking/getresources_XML.php',
        data: {
            type: "test 1"
        },
        success: showProductsAvalible,

        error: "errormsg"
    });

}

/*--------------------------------------Generate Product Cards for Products page----------------------------------------*/
function showProductsAvalible(returnedData)
		{
				// An XML DOM document is returned from AJAX
				var resultset=returnedData.childNodes[0];
				var output="<div class='prodCont'>";
				// Iterate over all nodes in root node (i.e. resources)
				for (i = 0; i < resultset.childNodes.length; i++) {
						// Iterate over all child nodes of that node that are resource nodes
						if(resultset.childNodes.item(i).nodeName=="resource"){
								// Retrieve data from resource nodes
								var resource=resultset.childNodes.item(i);
                                output+="<div class='prodCard' onclick='chooseProd(`"+resource.attributes['name'].value+"`, `"+resource.attributes['id'].value+"`);'>"
								    output+="<div class='cardTitle'>"+resource.attributes['name'].value+"</div>";
                                    
                                    output+="<div class='picCont'>"
                                        output+="<canvas id='pcCanvas"+resource.attributes['id'].value+"' class='cardPic' style='border: 2px solid red;'>"
                                    output+="</div>";
                                    
                                    output+="<div class='prodInfoCont'>"
                                        output+="<div>"+resource.attributes['company'].value+"</div>";
								        output+="<div>"+resource.attributes['location'].value+"</div>";
								        output+="<div>"+resource.attributes['category'].value+"</div>";
                                        output+="<div>"+resource.attributes['size'].value+"GB m.2 drive</div>";
                                        output+="<div>"+resource.attributes['cost'].value+" sek</div>";
                                    output+="</div>" 
                                output+="</div>"
						}
				}
				output+="</div>";
				var div=document.getElementById("resources");
				div.innerHTML=output;
                drawPC(resultset)
                

                

		}
/*------------------------------------------------------------------------------*/



/*-------------------------------------Draw Images for all resources with auxdata-----------------------------------------*/
function drawPC(resultset, prodCard){
        if (prodCard == null){
            for (i = 0; i < resultset.childNodes.length; i++) {
                var resource=resultset.childNodes.item(i);
                if(resultset.childNodes.item(i).nodeName=="resource"){
                    var canvas=document.getElementById("pcCanvas"+resource.attributes['id'].value);
                    canvas.width = 100;
                    canvas.height = 100;
                    canvas.style.border = '2px solid red';
                    var ctx = canvas.getContext('2d');
                    var auximg = resource.attributes['auxdata'].value;
                    eval(auximg);
                }
            }
        }else if(prodCard != null){
            var canvas=document.getElementById("pcCanvas"+prodCard.attributes['id'].value+"B");
            canvas.width = 100;
            canvas.height = 100;
            canvas.style.border = '2px solid red';
            var ctx = canvas.getContext('2d');
            var auximg = prodCard.attributes['auxdata'].value;
            eval(prodCard.attributes['auxdata'].value);
        }          
}
/*------------------------------------------------------------------------------*/



/*---------------------------------------Search resources for selected product---------------------------------------*/
function showBuyProd(){

    $.ajax({

        type: 'POST',
        url: 'Webbprogrammering-API-2014-/booking/getresources_XML.php',
        data: {
            type: "test 1"
        },
        success: showProdCardOnbuyPage,

        error: "errormsg"
    });

}

/*--------------------------------------Generate Product Card for Buy Page----------------------------------------*/
function showProdCardOnbuyPage(returnedData){
    const regex = new RegExp(document.getElementById("testcont").innerHTML);
    var prodCard;
    var resultset = returnedData.childNodes[0];
    var output="<div class='prodCont'>";
    for (i = 0; i < resultset.childNodes.length; i++) {
        // Iterate over all child nodes of that node that are booking nodes
        if (resultset.childNodes.item(i).nodeName == "resource") {
            // Retrieve first name and last name for node
            var resource = resultset.childNodes.item(i);
            if(regex.test(resource.attributes['name'].nodeValue) == true){
                prodCard = resultset.childNodes.item(i);
                output+="<div class='prodCard'>"
                    output+="<div class='cardTitle'>"+resource.attributes['name'].value+"</div>";             
                    output+="<div class='picCont'>"
                        output+="<canvas id='pcCanvas"+resource.attributes['id'].value+"B' class='cardPic' style='border: 2px solid red;'>"
                    output+="</div>";
                    output+="<div class='prodInfoCont'>";
                        output+="<div>"+resource.attributes['company'].value+"</div>";
                        output+="<div>"+resource.attributes['location'].value+"</div>";
                        output+="<div>"+resource.attributes['category'].value+"</div>";
                        output+="<div>"+resource.attributes['size'].value+"GB m.2 drive</div>";
                        output+="<div>"+resource.attributes['cost'].value+" sek</div>";
                    output+="</div>" 
                output+="</div>"
            }         
        }
    }
    output+="</div>";
	var div=document.getElementById("testcont");
	div.innerHTML=output;
    drawPC(resultset, prodCard)
}
/*------------------------------------------------------------------------------*/



/*---------------------------------------Draw Explosion when logging in on---------------------------------------*/
function exp(){
    ctx.translate(150,-50);

    ctx.globalAlpha=1.0;
    ctx.fillStyle='#000';
    ctx.beginPath();
    ctx.moveTo(3,27);
    ctx.lineTo(0,31);
    ctx.lineTo(-3,27);
    ctx.lineTo(-12,44);
    ctx.lineTo(-11,24);
    ctx.lineTo(-16,27);
    ctx.lineTo(-16,22);
    ctx.lineTo(-31,32);
    ctx.lineTo(-21,15);
    ctx.lineTo(-28,15);
    ctx.lineTo(-25,10);
    ctx.lineTo(-40,11);
    ctx.lineTo(-26,2);
    ctx.lineTo(-32,-1);
    ctx.lineTo(-26,-4);
    ctx.lineTo(-40,-13);
    ctx.lineTo(-25,-13);
    ctx.lineTo(-28,-17);
    ctx.lineTo(-21,-17);
    ctx.lineTo(-30,-33);
    ctx.lineTo(-16,-24);
    ctx.lineTo(-16,-29);
    ctx.lineTo(-11,-26);
    ctx.lineTo(-11,-46);
    ctx.lineTo(-3,-29);
    ctx.lineTo(0,-33);
    ctx.lineTo(3,-29);
    ctx.lineTo(11,-46);
    ctx.lineTo(11,-26);
    ctx.lineTo(16,-29);
    ctx.lineTo(16,-24);
    ctx.lineTo(31,-34);
    ctx.lineTo(21,-17);
    ctx.lineTo(28,-17);
    ctx.lineTo(25,-13);
    ctx.lineTo(40,-13);
    ctx.lineTo(26,-4);
    ctx.lineTo(32,-1);
    ctx.lineTo(26,2);
    ctx.lineTo(40,11);
    ctx.lineTo(25,10);
    ctx.lineTo(28,15);
    ctx.lineTo(21,15);
    ctx.lineTo(32,34);
    ctx.lineTo(16,22);
    ctx.lineTo(16,27);
    ctx.lineTo(11,24);
    ctx.lineTo(11,46);
    ctx.lineTo(3,27);
    ctx.fill();
       //--==## SVGID_1_ radialGradient ##==--
    var SVGID_1_=ctx.createRadialGradient(0,-1,0,0,-1,34);
    SVGID_1_.addColorStop(0.6452,'RGB(254,197,87)');
    SVGID_1_.addColorStop(0.6611,'RGB(251,186,81)');
    SVGID_1_.addColorStop(0.7146,'RGB(243,155,64)');
    SVGID_1_.addColorStop(0.7693,'RGB(238,130,52)');
    SVGID_1_.addColorStop(0.8246,'RGB(234,111,44)');
    SVGID_1_.addColorStop(0.8808,'RGB(232,96,40)');
    SVGID_1_.addColorStop(0.9385,'RGB(230,86,38)');
    SVGID_1_.addColorStop(1,'RGB(230,83,37)');
    ctx.fillStyle=SVGID_1_;
    ctx.beginPath();
    ctx.moveTo(0,-19);
    ctx.lineTo(9,-36);
    ctx.lineTo(9,-17);
    ctx.lineTo(24,-27);
    ctx.lineTo(15,-10);
    ctx.lineTo(33,-11);
    ctx.lineTo(17,-1);
    ctx.lineTo(33,9);
    ctx.lineTo(15,8);
    ctx.lineTo(24,25);
    ctx.lineTo(9,15);
    ctx.lineTo(9,34);
    ctx.lineTo(0,17);
    ctx.lineTo(-9,34);
    ctx.lineTo(-9,15);
    ctx.lineTo(-24,25);
    ctx.lineTo(-15,8);
    ctx.lineTo(-33,9);
    ctx.lineTo(-17,-1);
    ctx.lineTo(-33,-11);
    ctx.lineTo(-15,-10);
    ctx.lineTo(-24,-27);
    ctx.lineTo(-9,-17);
    ctx.lineTo(-9,-36);
    ctx.lineTo(0,-19);
    ctx.fill();
       //--==## SVGID_2_ radialGradient ##==--
    var SVGID_2_=ctx.createRadialGradient(0,-1,0,0,-1,28);
    SVGID_2_.addColorStop(0.1822,'RGB(252,242,202)');
    SVGID_2_.addColorStop(0.5596,'RGB(254,230,135)');
    SVGID_2_.addColorStop(0.5614,'RGB(254,229,134)');
    SVGID_2_.addColorStop(0.6219,'RGB(247,191,103)');
    SVGID_2_.addColorStop(0.6837,'RGB(241,158,78)');
    SVGID_2_.addColorStop(0.7458,'RGB(237,133,59)');
    SVGID_2_.addColorStop(0.8081,'RGB(234,114,48)');
    SVGID_2_.addColorStop(0.8709,'RGB(232,98,41)');
    SVGID_2_.addColorStop(0.9345,'RGB(231,88,38)');
    SVGID_2_.addColorStop(1,'RGB(230,85,37)');
    ctx.fillStyle=SVGID_2_;
    ctx.beginPath();
    ctx.moveTo(5,-20);
    ctx.lineTo(14,-25);
    ctx.lineTo(14,-15);
    ctx.lineTo(24,-15);
    ctx.lineTo(19,-6);
    ctx.lineTo(28,-1);
    ctx.lineTo(19,4);
    ctx.lineTo(24,13);
    ctx.lineTo(14,13);
    ctx.lineTo(14,23);
    ctx.lineTo(5,18);
    ctx.lineTo(0,27);
    ctx.lineTo(-5,18);
    ctx.lineTo(-14,23);
    ctx.lineTo(-14,13);
    ctx.lineTo(-24,13);
    ctx.lineTo(-19,4);
    ctx.lineTo(-28,-1);
    ctx.lineTo(-19,-6);
    ctx.lineTo(-24,-15);
    ctx.lineTo(-14,-15);
    ctx.lineTo(-14,-25);
    ctx.lineTo(-5,-20);
    ctx.lineTo(0,-29);
    ctx.lineTo(5,-20);
    ctx.fill();
}

var ctx;
var v=400;
var a=0;

function drawgraphics()
{
    ctx.clearRect(0,0,400,400);

    v=v+a;
    if(v>400||v<0) a=-a;

    ctx.save();
    ctx.translate(100,v);  
    exp();
    ctx.restore();

    /*
    for(var i=0;i<numflakes;i++){
        ctx.save();
        ctx.translate(snowflakes[i].xk+(Math.sin(snowflakes[i].xk+(snowflakes[i].yk*0.03))*snowflakes[i].siz*14.0),snowflakes[i].yk);  
        ctx.scale(snowflakes[i].siz,snowflakes[i].siz);
        //ctx.drawImage(img,-18,-18);
        exp();
        ctx.restore();
        
        snowflakes[i].yk+=snowflakes[i].spd;
        if(snowflakes[i].yk>400) snowflakes[i].yk-=400;
    }
*/
requestAnimationFrame(drawgraphics);
//    setTimeout(function(){drawgraphics()}, 30);
}

function startupCanvas()
          {
              img=document.getElementById("flake");
              
              /*
              for(var i=0;i<numflakes;i++){
                  var typ=Math.round(Math.random()*4);
                  snowflakes[i]=new Snowflake(Math.round(Math.random()*400),Math.round(Math.random()*400),0.5+(typ/2),0.2+(typ/8));    
              }
              */
              
              var elem = document.getElementById("logincanvas");
              if (elem && elem.getContext) {
                ctx = elem.getContext('2d');
                drawgraphics();
              }                  
          }


    /* 
          var img;
 
          // Array to hold snowflakes
          var snowflakes = new Array(); 
          
          // Number of flakes
          var numflakes=100;
          
          // Constructor for snowflakes
          function Snowflake(xk, yk, spd, siz) {
            this.xk = xk;
            this.yk = yk;
            this.spd = spd;
            this.siz = siz;
          }          
        
          function drawgraphics()
          {
              ctx.clearRect(0,0,400,400);
                  
              for(var i=0;i<numflakes;i++){
                  ctx.save();
                  ctx.translate(snowflakes[i].xk+(Math.sin(snowflakes[i].xk+(snowflakes[i].yk*0.03))*snowflakes[i].siz*14.0),snowflakes[i].yk);  
                  ctx.scale(snowflakes[i].siz,snowflakes[i].siz);
                  //ctx.drawImage(img,-18,-18);
                  exp();
                  ctx.restore();
                  
                  snowflakes[i].yk+=snowflakes[i].spd;
                  if(snowflakes[i].yk>400) snowflakes[i].yk-=400;
              }
 
              setTimeout(function(){drawgraphics()}, 30);
          }
          
          function startupCanvas()
          {
              img=document.getElementById("flake");
              
              for(var i=0;i<numflakes;i++){
                  var typ=Math.round(Math.random()*4);
                  snowflakes[i]=new Snowflake(Math.round(Math.random()*400),Math.round(Math.random()*400),0.5+(typ/2),0.2+(typ/8));    
              }
              
              var elem = document.getElementById("logincanvas");
              if (elem && elem.getContext) {
                ctx = elem.getContext('2d');
                drawgraphics();
              }                  
          }
     */




function goShow()
{
    var element = document.getElementById("page6");
    element.style.display="block";
    element.style.opacity= 100;
    element.classList.add('jsAnimation');
}

function goHide()
{   
    var element = document.getElementById("page6");
    $("#page6").animate({ opacity: 0, top: -200}, 1500, "easeInBack");
    $("#page6").animate({ opacity: 0, top:  200}, 1500, "easeInBack");
    element.classList.remove('jsAnimation'); 
}







    