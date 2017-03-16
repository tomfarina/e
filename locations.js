define(function (require) {

    "use strict";

    var $ = require("jquery");
    require("jquery");

    (function() {
    	var specialtyList = "";
        var map;
        var locs = [];
		var markers = [];
		var infowindow;
		var centerMap;
        var firstScroll = true;
		
		$.fn.scrollView = function () {
		  return this.each(function () {
			$('html, body').animate({
			  scrollTop: $(this).offset().top
			}, 1000);
		  });
		}
		
		function getUrlVars() {
			var vars = [], hash;
			if(window.location.href.indexOf('?') > 0){
				var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
				for(var i = 0; i < hashes.length; i++)
				{
					hash = hashes[i].split('=');
					vars.push(hash[0]);
					if(hash[1]){
						vars[hash[0]] = hash[1].replace("#","");
					}
				}
			}
			return vars;
		}
		
		function initLocationWayfinding() {
			log('init location wayfinding');

			var $wayfinding = $('.wayfinding'); // generic wayfinding class

			// Look to see if .wayfinding is on page...
			if ($wayfinding.length > 0) {
			
				infowindow = new google.maps.InfoWindow({
				});
				
				//google.maps.event.addDomListener(map, 'idle', function() {calculateCenter();});
				// google.maps.event.addDomListener(window, 'resize', function() {map.setCenter(centerMap);});
				//$(window).resize($.debounce(250, function(e){map.setCenter(centerMap);}));

				// once map is loaded
				//google.maps.event.addListenerOnce(map, 'idle', function(){
				   //function here
				//});
			
			
				$("#filters").hide();
				var specialtyFromQuerystring = getUrlVars()["specialty"];
				var departmentFromQuerystring = getUrlVars()["department"];
				var centerFromQuerystring = getUrlVars()["center"];
				var type = getUrlVars()["type"];
				var zip = getUrlVars()["zip"];
				if(zip == undefined){
					//try city
					zip = getUrlVars()["city"];
				}
				var radius = getUrlVars()["radius"];
				loadMap();
				showUpdate(false);
				if(specialtyFromQuerystring && specialtyFromQuerystring != ""){					
					//tag spec as selected
					var selectedChoice = "";
					selectedChoice += "<div class='selected-options'>";
					selectedChoice += "<a href='#' id='clear-specialty' class='clear-selected'>Clear</a>";
					selectedChoice += "<ul>";
					selectedChoice += "<li><a href='#' class='selected'>" + specialtyFromQuerystring + "</a></li>";
					selectedChoice += "</ul>";
					selectedChoice += "</div>";
					$("a[data-target='#specialty-menu']").addClass("has-options");
					$("a[data-target='#specialty-menu']").after(selectedChoice);
					
					//now search
					search(zip,radius,type,specialtyFromQuerystring,"Name");
				}
				else if(departmentFromQuerystring && departmentFromQuerystring != ""){					
					//now search
					search(zip,radius,type,"","Name",departmentFromQuerystring,"");
				}
				else if(centerFromQuerystring && centerFromQuerystring != ""){					
					//now search
					search(zip,radius,type,"","Name","",centerFromQuerystring);
				}
				else if(type){
					type= type.toLowerCase();
					
					if(type == "hospitals"){
						search(zip,radius,"All Hospitals",specialtyFromQuerystring,"Name");
					}
					else if(type == "primary"){
						search(zip,radius,"Primary Care Locations",specialtyFromQuerystring,"Name");
					}
					else if(type == "specialty"){
						search(zip,radius,"Specialty Care Locations",specialtyFromQuerystring,"Name");
					}
				}
				else{
					search(zip,radius,type,specialtyFromQuerystring,"Name");
				}
				initMap();
								
				$(".close-menu, .update").on("click", function(e){
					var zip = $("#area").val();
					var sort = $("input[name='phys-filter']:checked").attr("id");
					var type = $("#location-filter div.filter-options ul li.active a").html();
					var spec = $("div.selected-options ul li a").html();
					
					search(zip,"",type,spec,sort);
				});

				$(".back-menu").on("click", function(e){
					$("a[data-target='#specialty-menu']").siblings().remove();
					
					if($("#specialty-menu div.filter-options li.active").length > 0){
						showUpdate(true);
						var selectedChoice = "";
						selectedChoice += "<div class='selected-options'>";
						selectedChoice += "<a href='#' id='clear-specialty' class='clear-selected'>Clear</a>";
						selectedChoice += "<ul>";
						selectedChoice += "<li><a href='#' class='selected'>" + $("#specialty-menu div.filter-options li.active a").html() + "</a></li>";
						selectedChoice += "</ul>";
						selectedChoice += "</div>";
						
						$("a[data-target='#specialty-menu']").addClass("has-options");
						$("a[data-target='#specialty-menu']").after(selectedChoice);
					}
				});

				$(document).on("keyup", "#area", function(e){
					e.stopPropagation();
					if($("#area").val() != ""){
						showUpdate(true);
					}
				});

				$(document).on("click", "#location-filter div.filter-options a", function(e){
					e.stopPropagation();
					$("#location-filter div.filter-options li").removeClass("active");
					$(this).parent().addClass("active");
					showUpdate(true);
					$(".close-menu, .update").trigger("click");
				});

				$(document).on("click", "#specialty-menu div.filter-options a", function(e){
					e.stopPropagation();
					$("#specialty-menu div.filter-options li").removeClass("active");
					$(this).parent().addClass("active");
					showUpdate(true);
					$(".back-menu").trigger("click");
				});

				//code for clicking x on filter
				$(document).on("click", ".specialist-filters li a",  function(e){
					e.stopPropagation();
					if($(this).attr("data-id") == "zip"){
						$("#area").val("");
					}
					else if($(this).attr("data-id") == "type"){
						$("#location-filter div.filter-options li").removeClass("active");
					}
					else if($(this).attr("data-id") == "spec"){
						$("#clear-specialty").click();
					}
					$(this).parent().remove();
					
					var zip = $(".specialist-filters li a[data-id='zip']").html();
					var type = $(".specialist-filters li a[data-id='type']").html();
					var spec = $(".specialist-filters li a[data-id='spec']").html();
					var sort = $("input[name='phys-filter']:checked").attr("id");
					
					search(zip,"",type,spec,sort);
				});
        
				$("#clear-all").on("click", function(e){
					e.stopPropagation();
					$("#area").val("");
					$("input[name='phys-filter']").removeAttr("checked");
					$("div.filter-options li").removeClass("active");
					$("#clear-specialty").click();
					showUpdate(false);
				});

				$(document).on("click", "#clear-specialty", function(e){
					$(this).parent().remove();
					$("a[data-target='#specialty-menu']").removeClass("has-options");
					showUpdate(true);
				});
				
				$(document).on("click", "#linkShowHospitals", function(e){
					$("#clear-all").click();
					search("","","All Hospitals","","Name");
				});
				
				$(document).on("click", "#linkShowPrimaryCare", function(e){
					$("#clear-all").click();
					search("","","Primary Care Locations","","Name");
				});
				
				$(document).on("click", "#linkShowSpecialtyCare", function(e){
					$("#clear-all").click();
					search("","","Specialty Care Locations","","Name");
				});
				
				$(document).on("click", "#linkShowCenters", function(e){
					$("#clear-all").click();
					search("","","Centers and Programs","","Name");
				});
				
				$(document).on("click", ".list-loc", function(e){
					console.log("hey");
					openMarker(this.getAttribute("data-markerid"));
				});
				
			}		

		}
		
		function updateCounts(num, tot){
			$("#numResults").html(num);
			$("#totalResults").html(tot);
		}
		
		function showUpdate(show){
			if(show){			
				//show update and hide x
				$(".close-menu").hide();
				$(".update").show();
			}
			else{
				//show x and hide update
				$(".close-menu").show();
				$(".update").hide();
			}
		}
		
		function postThis(type, queryData, controlToUpdate){
			var locationUrl = "/service/findPhysician/api/locations/retrieve";
			if(type == "Primary Care"){
				delete queryData.filters["locationTypes.locationtype"];
				queryData.filters["specialists.specialty"] = {}; 
				queryData.filters["specialists.specialty"]["$in"] = ["Primary Care"];
			}
			else{
				delete queryData.filters["specialists.specialty"]; 
				queryData.filters["locationTypes.locationtype"] = {};
				queryData.filters["locationTypes.locationtype"]["$in"] = [type];
			}
            $.ajax({
                type: 'POST',
                url: locationUrl,
                dataType: "json",
                data: JSON.stringify(queryData),
                success: function(data, textStatus) {
					if(data.filteredCount){
						var dataVal = $(controlToUpdate).html();
						$(controlToUpdate).html(data.filteredCount);
					}
                },
                error: function (jqXHR, textStatus) {
                    //alert(textStatus);
                }
            });
		
		}
		
		function loadMap(){			
			var returnHTML = "";
			var numHosp = 0;
			var numPrimary = 0;
			var numSpecialty = 0;
			var numCenters = 0;
			var queryData = {};
			queryData.selectFields = ["Name"];
			queryData.filters = {};
			queryData.orderBy = {};
			queryData.filters["1"] = "1"; // Where 1=1 (i.e. return all)
			//queryData.orderBy["Name"] = -1; // -1=sorted ascending, 1=sorted descending
			
			postThis("Hospital",queryData,"#h2Hospital");
			postThis("Primary Care",queryData,"#h2Primary");
			postThis("Office",queryData,"#h2Specialty");
			postThis("Centers & Programs",queryData,"#h2Centers");
		}
		
		function search(zip,rad,t,spec,sort){
			search(zip,rad,t,spec,sort,"","");
		}
			
		function search(zip,rad,t,spec,sort, dept, center){
					
			var locationUrl = "/service/findPhysician/api/locations/retrieve";
			var returnHTML = "";
			var ct = 1;
			var queryData = {};
			var buildDisplayFilters = "";
			queryData.selectFields = ["Name", "Address", "City", "State", "Zip", "URL", "Type", "Specialists", "Latitude", "Longitude"];
			queryData.filters = {};
            queryData.geoWithin = {};
			queryData.orderBy = {};
			
			if((zip == undefined || zip=="") && (t == undefined || t == "") && (spec == undefined || spec == "")){
				queryData.filters["1"] = "1"; // Where 1=1 (i.e. return all)
			}
			
            if (zip != undefined && zip != ""){
				locationUrl = "/service/findPhysician/api/locations/findLocationsInRadius";
				if($.isNumeric(zip)) {
					queryData.geoWithin["zipCode"] = zip;
				}
				else{
					queryData.geoWithin["city"] = zip;
					queryData.geoWithin["state"] = "GA";
				}
                queryData.geoWithin["sort"] = "distance";
                queryData.geoWithin["radius"] = "10";
				queryData.filters = {};
				queryData.orderBy = {};
				buildDisplayFilters += "<li><a href='#' data-id='zip'>" + zip + "</a></li>";
            }
			else{
				if(sort == undefined || sort == ""){
					queryData.orderBy["Name"] = -1; // -1=sorted ascending, 1=sorted descending
				}
				//else if(sort == "Distance"){
				//	delete queryData.orderBy;
				//}
				else{
					queryData.orderBy[sort] = -1; // -1=sorted ascending, 1=sorted descending
				}
			}
			
            if (rad != undefined && rad != ""){
				if($.isNumeric(rad)) {
					queryData.geoWithin["radius"] = rad;
				}
            }
			
			if (t != undefined & t != "") {
				if(t == "All Hospitals"){
					queryData.filters["locationTypes.locationtype"] = {};
					queryData.filters["locationTypes.locationtype"]["$in"] = ["Hospital"];
				}
				else if(t == "Primary Care Locations"){
					//queryData.filters["locationTypes.locationtype"] = {};
					//queryData.filters["locationTypes.locationtype"]["$in"] = ["Primary Care"];
					queryData.filters["specialists.specialty"] = {}; 
					queryData.filters["specialists.specialty"]["$in"] = ["Primary Care"];
				}
				else if(t == "Specialty Care Locations"){
					queryData.filters["locationTypes.locationtype"] = {};
					queryData.filters["locationTypes.locationtype"]["$in"] = ["Office"];
				}
				else if(t == "Centers and Programs"){
					queryData.filters["locationTypes.locationtype"] = {};
					queryData.filters["locationTypes.locationtype"]["$in"] = ["Centers & Programs"];
				}
				buildDisplayFilters += "<li><a href='#' data-id='type'>" + t + "</a></li>";
            }

			if (spec != undefined & spec != "") {
				queryData.filters["specialists.specialty"] = {}; 
				if(selectMapping(spec)){
					queryData.filters["specialists.specialty"]["$in"] = [selectMapping(spec)];
				}
				else{
					queryData.filters["specialists.specialty"]["$in"] = [spec];// this is on the filter with already mapped values
				}
				buildDisplayFilters += "<li><a href='#' data-id='spec'>" + spec + "</a></li>";
            }
			
			if(dept != undefined && dept != ""){
				queryData.filters["clinics.name"] = {};
				queryData.filters["clinics.name"]["$in"] = [dept];
				//queryData.filters["clinics.name"]["$in"] = [dept.replace(" & "," ")];
			}

			if(center != undefined && center != ""){
				queryData.filters["centers.name"] = center.replace(" & "," ");
			}

			//when searching, show what searching on
			if(buildDisplayFilters != ""){
				$(".specialist-filters").html(buildDisplayFilters);
				$("#filters").show();
			}
			
			//hold new list of specialties in array
			var arrSpecs = [];
			$.ajax({
				type: 'POST',
				url: locationUrl,
				dataType: "json",
				data: JSON.stringify(queryData),
				success: function(data, textStatus) {
					if(map != null){
						clearMarkers();
					}
					returnHTML = "<ol>";
					var arrLocations = data.locations;
					if (arrLocations == undefined){
						arrLocations = data.Locations;
					}
					$.each(arrLocations, function(key, loc){

						if(loc && loc.Specialists){
							//buildSpecialties(loc.Specialists);
							arrSpecs = arrSpecs.concat(loc.Specialists);
						}
						if(loc.TYPE == "Hospital"){
							returnHTML += "<li class='hospital'>";
						}else if(loc.TYPE == "Primary care"){
							returnHTML += "<li class='primary'>";
						} else{
							returnHTML += " <li>";
						}
						returnHTML += "<div class='map-content-inner'>";
						returnHTML += "<div class='name'><a class='list-loc' href='javascript:void(0);' data-markerid='" + (ct-1) + "'>" + loc.NAME + "</a></div>";
						returnHTML += "<div class='address'>";
						returnHTML += loc.ADDRESS+ "<br/>";
						returnHTML += loc.CITY + ", " + loc.STATE + " " + loc.ZIP;
						returnHTML += "</div>";
						//returnHTML += "<div class='miles'>60 Miles Away</div>";
						returnHTML += "</div>";
						returnHTML += "</li>";
						
						var arrLoc = [
							loc.NAME,
							loc.LATITUDE,
							loc.LONGITUDE,
							ct,
							loc.ADDRESS,
							loc.CITY,
							loc.STATE,
							loc.ZIP,
							loc.URL,
							loc.PHONE
						];
						locs.push(arrLoc);
						addMarker(arrLoc);

						ct++;
					});
					
					//now that we have our new specialty list, let's build the html.
					buildSpecialties(arrSpecs.sort());
					
					returnHTML += "</ol>";
					$(".map-content").html(returnHTML);

					//if(locationUrl.indexOf("Radius") > -1){
					//	updateCounts(data.filteredCount, data.totalLocations);
					//}
					//else{
					//	updateCounts(data.count, data.totalLocations);
					//}
					
					updateCounts(data.filteredCount, data.totalCount);
					
					//alert(specialtyList);
					$("#specialty-menu div.filter-options ul").html(specialtyList);
					if(map != null){
						//don't bother until map is created.
						showMarkers();
					}
                    if (firstScroll == true){
					    $('#find-loc').scrollView();
                        firstScroll = false;
                    } else {
                        $('#numResults').scrollView();
                    }
				},
				error: function (jqXHR, textStatus) {
					//alert(textStatus);
				}
			});
		}
		
		function buildSpecialties(specs){
			if(specs != undefined){
				var arrList = specs;
				arrList.forEach(function(item){
					//alert(item);
					if(item != "" && specialtyList.indexOf(">" + item + "<") < 0){
					specialtyList += "<li><a href='#'>" + item + "</li>";
					}
				});
			}
		}

        function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
				center: {lat: 33.7487959, lng: -83.965851},
				zoomControl: true,
				mapTypeControl: false,
				scaleControl: false,
				streetViewControl: false,
				rotateControl: false,
				fullscreenControl: false,
				scrollwheel: false,
				zoom: 10
            });
            showMarkers();
        }
			
        function addMarker(loc){
			var markerIcon = {
				url: '/ui/images/blue-pin.png',
				labelOrigin: new google.maps.Point(11, 11)
			};
			var contentString = '<div class="map-overlay">' +'<div class="name">' + loc[0] + '</div>' +'<div class="address">' + loc[4] + '<br/>' + loc[5] + ', ' + loc[6] + ' ' + loc[7] + '</div>';
				if(loc[9]){
					contentString += '<div class="main-phone">Main: ' + loc[9] + '</div>';
				}
					contentString += '<ul class="map-links">' +'<li><a href="' + loc[8] + '.html">View Location Details</a></li>';
					contentString += '<li><a target="_blank" href="http://maps.google.com/?daddr=' + loc[1] + ',' + loc[2] + '">Get Directions</a></li></ul></div>';
					
			if(loc[1] == null || loc[2] == null){
				return false;
			}
			var marker = new google.maps.Marker({
				position: {lat: loc[1], lng: loc[2]},
				title: loc[3].toString() + "  " + loc[0], 
				icon: markerIcon
			});
			
			marker.addListener('click', function() {
				infowindow.setContent(contentString);
				infowindow.open(map, marker);
			});
			markers.push(marker);
        }
        	
		// Sets the map on all markers in the array.
		function setMapOnAll(map) {
		  for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(map);
		  }
		}

		// Removes the markers from the map, but keeps them in the array.
		function clearMarkers() {
		  setMapOnAll(null);
			markers = [];
		}

		// Shows any markers currently in the array.
		function showMarkers() {
		  setMapOnAll(map);
		}
		
		function openMarker(id){
			console.log("openMakrer triggerd");
			google.maps.event.trigger(markers[id], 'click');
		}
		
		
		// Center map on resize
		//function calculateCenter() {
		//	centerMap = map.getCenter();
		//}

		function selectMapping(ist){
			var mapping = {"Adolescent Gynecologist": "Adolescent Gynecology",
							"Allergist/Immunologist": "Allergy and Immunology",
							"Anesthesiologist": "Anesthesiology",
							"Cardiac Electrophysiologist": "Cardiac Electrophysiology",
							"Cardiologist": "Cardiology",
							"Cardiothoracic Surgeon": "Cardiothoracic Surgery",
							"Cardiovascular Disease Physician": "Cardiovascular Disease",
							"Child and Adolescent Psychiatrist": "Child and Adolescent Psychiatry",
							"Clinical Neurophysiologist": "Clinical Neurophysiology",
							"Colon and Rectal Surgeon": "Colon and Rectal Surgery",
							"Intensivist": "Critical Care Medicine",
							"Dermatologic Immunologist": "Dermatologic Immunology",
							"Dermatologist": "Dermatology",
							"Dermatopathologist": "Dermatopathology",
							"Diagnostic Radiologist": "Diagnostic Radiology",
							"Emergency Medicine Physician": "Emergency Medicine",
							"Endocrinologist": "Endocrinology",
							"Facial Plastic Surgeon": "Facial Plastic Surgery",
							"Family Physician": "Family Practice",
							"Female Pelvic and Reconstructive Surgeon": "Female Pelvic and Reconstructive Surgery",
							"Gastroenterologist": "Gastroenterology",
							"Geneticist": "Genetics",
							"Geriatric Dentist": "Geriatric Dentist",
							"Geriatrician": "Geriatric Medicine",
							"Geriatric Psychiatrist": "Geriatric Psychiatry",
							"Gynecologic Oncologist": "Gynecologic Oncology",
							"Gynecologist": "Gynecology",
							"Hand Surgeon": "Hand Surgery",
							"Hematologist": "Hematology",
							"Hepatologist": "Hepatology",
							"Hospice and Palliative Care Physician": "Hospice and Palliative Care",
							"Hospitalist": "Hospitalist",
							"Infectious Disease Physician": "Infectious Disease",
							"Internist": "Internal Medicine",
							"Interventional Cardiologist": "Interventional Cardiology",
							"Interventional Radiologist": "Interventional Radiology",
							"Maternal and Fetal Medicine Physician": "Maternal and Fetal Medicine",
							"Medical/Clinical Geneticist": "Medical Gen-Clinical Genetics",
							"Medical Oncologist": "Medical Oncology",
							"Neonatologist/Perinatologist": "Neonatal-Perinatal Medicine",
							"Nephrologist": "Nephrology",
							"Neuro-Oncologist": "Neuro-Oncology",
							"Neuro-Ophthalmologist": "Neuro-Ophthalmology",
							"Neurological Surgeon": "Neurological Surgery",
							"Neurologist": "Neurology",
							"Neuromuscular Medicine Physician": "Neuromuscular Medicine",
							"Neuropathologist": "Neuropathology",
							"Neuropsychologist": "Neuropsychology",
							"Neuroradiologist": "Neuroradiology",
                            "Neurosurgeon": "Neurosurgery",
							"Neurotologist": "Neurotology",
							"Nuclear Cardiologist": "Nuclear Cardiology",
							"Nuclear Medicine Physician": "Nuclear Medicine",
							"Obstetrician/Gynecologist": "Obstetrics",
							"Occupational Medicine": "Occupational Medicine",
							"Ophthalmologist": "Ophthalmology",
							"Optometrist": "Optometry",
							"Oral/Maxillofacial Surgeon": "Oral/Maxillofacial Surgery",
							"Orthopaedic Oncologist": "Orthopaedic Oncology",
							"Orthopaedic Surgeon": "Orthopaedic Surgery",
							"Otolaryngologist": "Otolaryngology",
							"Pain Medicine Physician": "Pain Medicine",
							"Pathologist": "Pathology",
							"Pediatric Anesthesiologist": "Pediatric Anesthesiology",
							"Pediatric Cardio-Thoracic Surgeon": "Pediatric Cardio-Thoracic Surgery",
							"Pediatric Cardiologist": "Pediatric Cardiology",
							"Pediatric Cystic Fibrosis Physician": "Pediatric Cystic Fibrosis",
							"Pediatric Dermatologist": "Pediatric Dermatology",
							"Pediatric Emergency Medicine Physician": "Pediatric Emergency Med",
							"Pediatric Geneticist": "Pediatric Genetics",
							"Pediatric Gynecologist": "Pediatric Gynecology",
							"Pediatric Neurologist": "Pediatric Neurology",
							"Pediatric Ophthalmologist": "Pediatric Ophthalmology",
							"Pediatric Orthopaedist": "Pediatric Orthopaedics",
							"Pediatric Otolaryngologist": "Pediatric Otolaryngology",
							"Pediatric Radiologist": "Pediatric Radiology",
							"Pediatric Sports Medicine Physician": "Pediatric Sports Medicine",
							"Pediatrician": "Pediatrics",
							"Physiatrist": "Physical Medicine and Rehabilitation (Physiatry)",
							"Plastic Surgeon": "Plastic Surgery",
							"Podiatrist": "Podiatry",
							"Primary Care Physician": "Primary Care",
							"Psychiatrist": "Psychiatry",
							"Psychologist": "Psychology",
							"Pulmonologist": "Pulmonary Disease",
							"Radiation Oncologist": "Radiation Oncology",
							"Radiologist": "Radiology",
							"Reproductive Endocrinologist": "Reproductive Endocrinology and Infertility",
							"Rheumatologist": "Rheumatology",
							"Sleep Medicine Physician": "Sleep Medicine",
							"Spine Surgeon": "Spine",
							"Sports Medicine Physician": "Sports Medicine",
							"Student Health Services Physician": "Student Health Services",
							"Surgeon": "Surgery",
							"Surgical Oncologist": "Surgical Oncology",
							"Thoracic Surgeon": "Thoracic Surgery",
							"Transplant Hepatologist": "Transplant Hepatology",
							"Transplant Surgeon": "Transplantation",
							"Urologic Oncologist": "Urologic Oncology",
							"Urologist": "Urology",
							"Vascular Neurologist": "Vascular Neurology",
							"Vascular Surgeon":"Vascular Surgery"};
							
			return mapping[ist];
		}
		
		initLocationWayfinding();
      
	}());

});
