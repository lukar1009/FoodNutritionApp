//wolframalpha widget iz kog se uzima izgenerisana slika
//https://www.wolframalpha.com/widgets/gallery/view.jsp?id=b62e21c5a338d1151c6f97f1dbd1fff


//Postavljanje nasih API Key-jeva koje smo dobili preko naloga na Clarifai i WolframAlpha
var myClarifaiApiKey = '0eac4de032ac482e83362239b499b75c';
var myWolframAppId = 'H8VPHX-X8J9EPLLYE';

var app = new Clarifai.App({ apiKey: myClarifaiApiKey });

console.log(app);

/**
 * Svrha metode: Slanje informacije drugim pomocnim funkcijama nakon sto korisnik pritisne dugme.
 * Ulazni parametri:
 *  value - Filename ili URL
 *  source - 'url' ili 'file'
 */

function get_nutrition(value, source) {
  var preview = $('.image1-container');
  var file = document.querySelector("input[type=file]").files[0];
  var loader = "C:/Users/lukar/Desktop/FoodApp/img/Reload-2s-200px.gif";
  var reader = new FileReader();

  /**
   * Pri ucitavanju fajla na nas image1-container stavljamo ucitanu sliku
   * U narednom ifu definisemo da dokle god se ucitava fajl, stoji nas loader.gif fajl
   */

  if (file) {
    reader.readAsDataURL(file);
    $('.image2-container').html('<img src="' + loader + '" class="loading" />');
  } else {
    alert("Please select an image!");
  }

  reader.addEventListener("load", function () {
    preview.html('<h3>Food image</h3><img id="generatedImage" src="' + reader.result + '" />');
    //console.log(reader.result);
    doPredict({
      base64: reader.result.split("base64,")[1]
    });
  });
}


/** 
 * Svrha metode: Vrsenje predikcije na osnovu ulaznih parametara
 * Ulazni parametri:
 *  value 
*/
function doPredict(value) {
  app.models.predict(Clarifai.FOOD_MODEL, value).then(function (response) {
    console.log(response);
    if (response.rawData.outputs[0].data.hasOwnProperty("concepts")) {
      var tag = response.rawData.outputs[0].data.concepts[0].name;
      var url = 'http://api.wolframalpha.com/v2/query?input=' + tag + '%20nutrition%20facts&appid=' + myWolframAppId;
      var tagImageSrc = document.getElementById("generatedImage").src;

      getNutritionalInfo(url, function (result) {
        $('.image1-container').html('<h3>Food image</h3><img id="food-slices" src="' + result[0] + '" /><img id="food-image" src="' + tagImageSrc + '" />');
        $('.image2-container').html('<h3>Nutrition value</h3>' + "<img id='nutritionValue' src='" + result[1] + "'>");
      });
    }
  });
}