var cors_api_url = 'https://cors-anywhere.herokuapp.com/';

function doCORSRequest(options, printResult) {
  var x = new XMLHttpRequest();
  //console.log(cors_api_url + options.url);
  x.open(options.method, cors_api_url + options.url);

  /**
   * Kreiramo funkciju koja iz dobijenog responseText(xml-a) izvlaci niz od dva linka za dve slike koje trazimo
   * Trazi pocetak svakog linka i na osnovu toga izvlaci pocetak i kraj linka, i ubacuje u niz
   * Dobijeni niz na kraju prosledjujemo funkciji printResult koja nam stoji kao ulazni parametar
   */
  x.onload = x.onerror = function() {
    var final_array=[];
    responseObject = String(x.responseText);
    
    /**
     * Izvlacimo prvi link za manju sliku koja se nalazi odmah iznad unete slike hrane
     */
    first = responseObject.indexOf("img") + 9;
    
    firstSub = responseObject.substring(first);
    
    last = firstSub.indexOf("'");
    
    final = firstSub.substring(0,last).replace("&amp;","&");
    
    final_array.push(final);


    /**
     * Izvlacimo drugi link koji je za sliku nutritivnih vrednosti unete hrane
     */
    first2 = responseObject.indexOf("img") + 1;

    firstSub2 = responseObject.substring(first2);

    second2 = firstSub2.indexOf("img") + 9;
    
    secondSub2 = firstSub2.substring(second2);
    
    last2 = secondSub2.indexOf("'");
    
    final2 = secondSub2.substring(0,last2).replace("&amp;","&");
    
    final_array.push(final2);
  
    printResult(final_array);
  };

  x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  x.send(options.data);
};

/**
 * Ova funkcija sluzi da zapravo pozove gornju funkciju, i da printResult odnosno customResultFunction definise
 * kao zasebnu funkciju, sto se desava u main.js fajlu
 */
function getNutritionalInfo(url, customResultFunction) {
  doCORSRequest({ method: 'POST', url: url, data: url }, customResultFunction);
}