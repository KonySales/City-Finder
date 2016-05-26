
var KONY_MF_RESTAURANT_FINDER_URL = "https://kony-aws-api.konycloud.com/services/";
var publicParkingURI = "SFgovDOT/parkingOffStreetandGaragesFinder";
var disabledParkingURI = "SFgovDOT/disabledParkingLocationsFinder";
var publicBicycleParkingURI = "SFgovDOT/publicBicycleParkingFinder";
var restaurantFinderURI = "NearByRestaurantFourSquare/getRestaurants";
var client_id = "VHP10VP5WGYBWMBKUQACWEAADDELQPAKETSBAZWMXN1O3THH"; //Client id for Four square API
var client_secret = "Q1UMNZ2DE22FEWV0XLE3N512GSL300KIM4MOOA1VYBUPJ1DH"; //Client secret for Four square API
var query = "Restaurant";
var version = "20130815"; //version number
var restaurantFinderRadius = "7000"; //In meters
var parkingFinderradius = "2000"; //In meters
var limit  = "4"; //Number of results
var venuePhotos = "1";

// @function to get current location

function getCurrentLocation(){
	var positionOptions = {timeout: 15000};
	kony.location.getCurrentPosition(successCallback, errorCallback, positionOptions); 
	 
	function successCallback(position){
      	getRestaurants(position.coords.latitude, position.coords.longitude);
	}
	function errorCallback(positionerror){
		var errorMsg = "Could not retrieve location details. Error code: " + positionerror.code;
		errorMsg = errorMsg  + ". Message: " + positionerror.message;
		kony.application.dismissLoadingScreen();
		alert(errorMsg);
	}
}

// @function to get list of near by restaurants 

function getRestaurants(lat, lon){
	var queryString =  "client_id=" + client_id + "&client_secret=" + client_secret +"&version=" + version + "&query=" + query + "&radius=" + restaurantFinderRadius + "&limit=" + limit + "&latlon=" + lat + "," + lon + "&venuePhotos=" + venuePhotos;
	var restaurantFinderServiceURL = KONY_MF_RESTAURANT_FINDER_URL + restaurantFinderURI + "?" +queryString; 
  	kony.net.invokeServiceAsync(restaurantFinderServiceURL, {}, restaurantServiceCallback);
}

function restaurantServiceCallback(status, results){
	if(status == 400){
		kony.print("Result"+JSON.stringify(results));
      	var venues = results.collection; //venues gets populated as a multidimentional array with 4 rows and columns as restaurantName, streetAddress, country, city, crossStreet, phone, menu, distance, lat, lon, category
		if(venues.length > 0){
			seg_data  = [];
			loc_data=[];
			var i;
			for (i in venues) {
				seg_data.push({
          			lblRestaurantName : venues[i].restaurantName,
                  	lblCategory : venues[i].category,
					lblAddressValue : venues[i].streetAddress + ", " + venues[i].city + ", " + venues[i].country,
					lblDistance : (venues[i].distance*0.00062137).toFixed(2)+ " mi",
					imgRating : "rating4.png",
					lblOpenClose : "OPEN",
					lblAddress : "Address",
					lblHours : "Hours",
					lblDays : "Mon-Sun",
					lblOpenTime : "7:00 am - 8:00 pm",
					imgRestaurant : "restaurant04.png",
                  	menu : venues[i].menu,
                  	restaurantImage : venues[i].imagePrefix + venues[i].imageWidth + "x" + venues[i].imageHeight + venues[i].imageSuffix
				});
				loc_data.push({
        			lat : venues[i].lat,
					lon : venues[i].lon,
					name : venues[i].restaurantName,
					desc: venues[i].streetAddress,
					image: "mappin1.png",
                  	showcallout: true
				});
			}
          
        frmMap.Map.locationData = loc_data;
        frmMap.segRes.setData(seg_data);
        frmMap.show();
        kony.application.dismissLoadingScreen();
		}
	}else{
		kony.application.dismissLoadingScreen();
	}
}

function onClickRestaurantList() {

	var index = frmMap.segRes.selectedIndex[1];
	var index1 = frmMap.segRes.selectedItems;

  	frmDetails.lblRestaurantName.text =seg_data[index].lblRestaurantName;
	frmDetails.lblCategory.text = seg_data[index].lblCategory;
	frmDetails.lblAdderssValue.text =seg_data[index].lblAddressValue;
	frmDetails.lblDays.text = seg_data[index].lblDays;
    frmDetails.lblOpenTime.text = seg_data[index].lblOpenTime;
    frmDetails.lblWeb.text = seg_data[index].menu;
    frmDetails.lbldis.text=seg_data[index].lblDistance;
  	if (seg_data[index].restaurantImage === null || seg_data[index].restaurantImage === "" || seg_data[index].restaurantImage === undefined){
    	frmDetails.img.src = "gallardoimg_details.png";  
    }else{
  		frmDetails.img.src = seg_data[index].restaurantImage;
    }
  	
    frmDetails.show();
}

// Function to get near by parking locations

function getPublicParkingLocations(lat,lon){
  var queryString = "lat=" + lat + "&lon=" + lon + "&radius=" + parkingFinderRadius;
  var publicParkingFinderURL = KONY_MF_PARKING_FINDER_URL + publicParkingURI + "?" + queryString;
  kony.net.invokeServiceAsync(publicParkingFinderURL, {}, publicParkingFinderServiceCallback);
}


// Callback function for the async service call in getPublicParkingLocations()

function publicParkingFinderServiceCallback(status, results){
	//Waiting for asynchronus service to return with data
  	if(status == 400){
		kony.print("Result"+JSON.stringify(results)); // Let's see what we've got back
      	/*locations gets populated as a multidimentional array with 8 rows and columns as  
      	* owner, address, regularSlots, garageOrLot, valetSlots, motorcycleSlots, lat, lon
      	*/
        var locations = results.parkingPlaces; 
		var locationData = [];
      	if(locations.length > 0){
			for (var i in locations) {
				locationData.push({
          			"owner"   			: locations[i].owner,		//Private or public owned
                  	"address" 			: locations[i].address,		//Street address of the location
                  	"regularSlots"		: locations[i].regCap,		//Regular car parking slots
                  	"garageOrLot"		: locations[i].garageOrLot, //Is the location a garage or a lot
                  	"valetSlots"		: locations[i].valetCap,	//Valet parking slots
                  	"motorcycleSlots"	: locations[i].mcCap,		//Motorcycle parking slots
                  	"lat"				: locations[i].lat,			//Latitude position of the location
                  	"lon"				: locations[i].lon			//Longitude position of the location
				});
			}
          return locationData;
		}
	}
}


// Function to get near by disabled parking locations

function getDisabledParkingLocations(lat,lon){
  var queryString = "lat=" + lat + "&lon=" + lon + "&radius=" + parkingFinderRadius;
  var disabledParkingFinderURL = KONY_MF_PARKING_FINDER_URL + disabledParkingURI + "?" + queryString;
  kony.net.invokeServiceAsync(disabledParkingFinderURL, {}, disabledParkingFinderServiceCallback);
}


// Callback function for the async service call in getDisabledParkingLocations()

function disabledParkingFinderServiceCallback(status, results){
	//Waiting for asynchronus service to return with data
  	if(status == 400){
		kony.print("Result"+JSON.stringify(results)); // Let's see what we've go back
      	/*locations gets populated as a multidimentional array with 8 rows and columns as  
      	* address, spaceLength, sitedetail, crossStreet, stside, lat, lon
      	*/
      	var locations = results.disabledParkingPlaces; 
		var locationData = [];
      	if(locations.length > 0){
			for (var i in locations) {
				locationData.push({
          			"address" 			: locations[i].address,		//Street address of the location
                  	"spaceLength"		: locations[i].spaceleng,	//Length of the parking slot. Will return 0 if value unknown
                  	"sitedetail"		: locations[i].sitedetail,  //Extra details to find the location
                  	"crossStreet"		: locations[i].crossst,		//Cross street name
                  	"stside"			: locations[i].stside,		//Street side direction returned as N,W,S,E directions 
                  	"lat"				: locations[i].lat,			//Latitude position of the location
                  	"lon"				: locations[i].lon			//Longitude position of the location
				});
			}
          return locationData;
		}
	}
}

// Function to get near by bicycle parking locations

function getPublicBicycleParkingLocations(lat,lon){
  var queryString = "lat=" + lat + "&lon=" + lon + "&radius=" + parkingFinderRadius;
  var publicBicycleParkingFinderURL = KONY_MF_PARKING_FINDER_URL + publicBicycleParkingURI + "?" + queryString;
  kony.net.invokeServiceAsync(publicBicycleParkingFinderURL, {}, publicBicycleParkingFinderServiceCallback);
}


// Callback function for the async service call in getPublicBicycleParkingLocations()

function publicBicycleParkingFinderServiceCallback(status, results){
	//Waiting for asynchronus service to return with data
  	if(status == 400){
		kony.print("Result"+JSON.stringify(results)); // Let's see what we've go back
      	/*locations gets populated as a multidimentional array with 8 rows and columns as  
      	* address, racks, spaces, lat, lon
      	*/
      	var locations = results.bicycleParkingLoc;
		var locationData = [];
      	if(locations.length > 0){
			for (var i in locations) {
				locationData.push({
          			"address" 			: locations[i].location,	//Street address of the location
                  	"racks"				: locations[i].racks,		//Racks available
                  	"spaces"			: locations[i].spaces,		//Bicycle parking slots
                  	"lat"				: locations[i].latitude,	//Latitude position of the location
                  	"lon"				: locations[i].longitude	//Longitude position of the location
				});
			}
          return locationData;
		}
	}
}
