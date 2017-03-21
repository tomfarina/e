define([
        // Include dependencies
        "jquery", "handlebars"
    ],

    /** Module definition/implementation */
    function (jQuery, Handlebars) {

    // list global scripts to execute on DOM-ready
    $(function() {
        var currentPage = 1;
        var randomSeed;
        var queryString = {
          "seed": [],
          "specialty":[],
          "area":[],
          "sort":[],
          "faculty":[],
          "dept": [],
          "center": [],
          "fname": [],
          "lname": [],
          "language": [],
          "clinicalInterests": [],
          "office": [],
          "sex": [],
          "photo": [],
          "emoryClinics": []
        };

        //selecting option
        $(document).on("click", ".results-page div.filter-options a", function(e){
          e.preventDefault();
    			e.stopPropagation();
    			$(this).parent("ul").find("li").removeClass("active");
    			$(this).parent().addClass("active");
      		//setActiveFilters();
          checkSearchCriteria();
  			  $(".results-page .filter-menu .back-menu").trigger("click");  //if you make a selection, close to force the search
		    });

		//physician detail
		if ($(".physician-profile-container").length > 0){
			$('a[href$="#about"]').text( $("h2:contains('About Dr')")[0].innerText); //change the left column text
			if($("*:contains('Primary Care')").length > 0){
				//location comes first
				$("#liProfile").hide();
				$("#divProfile").hide();
				$("#liProfile2").show();
				$("#divProfile2").show();
			}
			else{
				$("#liProfile").show();
				$("#divProfile").show();
				$("#liProfile2").hide();
				$("#divProfile2").hide();
			}
		}

        if ($(".results-page, .landing-page").length == 0){
            return;
        }

        if ($(".results-page").length != 0){
		        randomSeed = Math.floor(Math.random() * 1000000000);  //get a new random number on results page load, but carry with through view mores (ajax).
            if (location.search != "")
            {
                var temp = location.search.match(/seed=([^&]+)/);
        				if (temp != null)
        				{
          					randomSeed = temp[1];
                    addQuery("seed",temp[1]);
        				}
                else
                {
                    addQuery("seed", randomSeed);
                }

				        temp = location.search.match(/specialty=([^&]+)/);
                if (temp != null)
                {
                    var t = temp[1].split(",");
                    $.each(t, function(index, value){
                      $("#specialty-menu li a").filter(function() {
                          return $(this).text() === decodeURIComponent(value);
                      }).trigger("click");

                      addQuery("specialty",decodeURIComponent(value));
                    });
                }
                temp = location.search.match(/language=([^&]+)/);
                if (temp != null)
                {
                    var t = temp[1].split(",");
                    $.each(t, function(index, value){
                      $("#language-menu li a").filter(function() {
                          return $(this).text() === decodeURIComponent(value);
                      }).trigger("click");

                      addQuery("language",decodeURIComponent(value));
                    });
                }
                temp = location.search.match(/clinicalInterests=([^&]+)/);
                if (temp != null)
                {
                    var t = temp[1].split(",");
                    $.each(t, function(index, value){
                      $("#clinical-menu li a").filter(function() {
                          return $(this).text() === decodeURIComponent(value);
                      }).trigger("click");

                      addQuery("clinicalInterests",decodeURIComponent(value));
                    });
                }

                temp = location.search.match(/office=([^&]+)/);
                if (temp != null)
                {
                    var t = temp[1].split(",");
                    $.each(t, function(index, value){
                      $("#practiceName-menu li a").filter(function() {
                          return $(this).text() === decodeURIComponent(value);
                      }).trigger("click");

                      addQuery("office",decodeURIComponent(value));
                    });
                }
                temp = location.search.match(/faculty=([^&]+)/);
                if (temp != null && temp[1])
                {
                    $("#filter-by-faculty").prop("checked","checked");
                    addQuery("faculty", "true");
                }
                temp = location.search.match(/department=([^&]+)/);
                if (temp != null && temp[1])
                {
                    addQuery("dept", decodeURIComponent(temp[1]));
                }
                temp = location.search.match(/center=([^&]+)/);
                if (temp != null && temp[1])
                {
                    addQuery("center", decodeURIComponent(temp[1]));
                }
                temp = location.search.match(/city=([^&]+)/);
                if (temp != null)
                {
                    $("#area").val(temp[1]);
                    addQuery("area", temp[1]);
                    addQuery("sort", "distance");
                    $("#distance").prop("checked","checked");
                }
                temp = location.search.match(/zip=([^&]+)/);
                if (temp != null)
                {
                    $("#area").val(temp[1]);
                    addQuery("area", temp[1]);
                    addQuery("sort", "distance");
                    $("#distance").prop("checked","checked");
                }
                temp = location.search.match(/area=([^&]+)/);
                if (temp != null)
                {
                    $("#area").val(temp[1]);
                    addQuery("area", temp[1]);
                    addQuery("sort", "distance");
                    $("#distance").prop("checked","checked");
                }
                temp = location.search.match(/fname=([^&]+)/);
                if (temp != null)
                {
                    $("#fname").val(decodeURIComponent(temp[1]));
                    addQuery("fname", decodeURIComponent(temp[1]));
                }
                 temp = location.search.match(/lname=([^&]+)/);
                if (temp != null)
                {
                    $("#lname").val(decodeURIComponent(temp[1]));
                    addQuery("lname", decodeURIComponent(temp[1]));
                }
                 temp = location.search.match(/hospital=([^&]+)/);
                if (temp != null)
                {
                  var t = temp[1].split(",");
                  $.each(t, function(index, value){
                    if($("#hospitalName-menu li a").filter(":contains('" + value + "')").length == 0 && $("#hospitalName-menu li a").filter(":contains('" + value + "')").length == 0){
                        $("#hospitalName-menu ul").append("<li><a href='#'>" + value + "</a></li>");
                    } // if the hospital doesn't exist in the filter menu add it.

                    $("#hospitalName-menu li a").filter(function() {
                        return $(this).text() === decodeURIComponent(value);
                    }).trigger("click");

                    addQuery("hospital",decodeURIComponent(value));
                  });
                }
                temp = location.search.match(/sort=([^&]+)/);
                if (temp != null)
                {
                    if (temp[1] == "az"){
                      $("#a-z").prop("checked", "checked");
                      addQuery("sort", "az");
                    }
                    else if (temp[1] == "za"){
                      $("#z-a").prop("checked", "checked");
                      addQuery("sort", "za");
                    }
                    else if (temp[1] == "distance"){
                      $("#distance").prop("checked", "checked");
                      addQuery("sort", "distance");
                    }
                }
                temp = location.search.match(/sex=([^&]+)/);
                if (temp != null)
                {
                  if (temp[1] == "male"){
                    $("#male").prop("checked", "checked");
                    $("#no-preference").prop("checked","");
                    addQuery("sex", "male");
                  } else if (temp[1] == "female"){
                    $("#female").prop("checked", "checked");
                    $("#no-preference").prop("checked","");
                    addQuery("sex", "female");
                  }
                }
                temp = location.search.match(/emoryClinics=([^&]+)/);
                if (temp != null)
                {
                  $("#clinic").prop("checked", "checked");
                  addQuery("emoryClinics", "true");
                }
                temp = location.search.match(/photo=([^&]+)/);
                if (temp != null)
                {
                  $("#photo").prop("checked", "checked");
                  addQuery("photo", "true");
                }
            }
            else {
              addQuery("seed", randomSeed);
            }
            $("#phys-results").html("");
        	  runSearch();
        }

        $(".load-more").on("click", function(e) {
            e = e || window.event;
            currentPage = currentPage + 1;
            runSearch();
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
        });

        $(".landing-page #area").autocomplete({
          source: function( request, response ) {
            $.ajax({
              url: "/service/findPhysician/api/locations/findzipcode",
              method: "POST",
              dataType: "json",
              data: JSON.stringify({"selectFields": ["distinct city"],"filters":{"City":{"$like":$("#area").val()+"%"},"State":"GA"}}),
              success: function( data ) {
        				if(data.count > 0){
        					var zipcodes = $.map(data.ZipCodes, function( item ) {
        					  return {
        						label: item.data.CITY,
        						value: item.data.CITY
        					  }
        					});
        					response(zipcodes);
        				}
        				else{
        					$.ajax({
        					  url: "/service/findPhysician/api/locations/findzipcode",
        					  method: "POST",
        					  dataType: "json",
        					  data: JSON.stringify({"selectFields": ["distinct city","zip"],"filters":{"Zip":$("#area").val()}}),
        					  success: function( data ) {
          						var zipcodes = $.map(data.ZipCodes, function( item ) {
          						  return {
          							label: item.data.CITY + ", " + item.data.ZIP,
          							value: item.data.ZIP
          						  }
          						});
          						response(zipcodes);
        					  }
        					});
        				}
              }
            });
          },
          minLength: 2,
          select: function( event, ui ) {
			         window.location.href="/physician-finder/results.html?specialty=Primary%20Care&area=" + ui.item.value;
          }
        });

        $(".results-page #area").autocomplete({
          source: function( request, response ) {
            $.ajax({
              url: "/service/findPhysician/api/locations/findzipcode",
              method: "POST",
              dataType: "json",
              data: JSON.stringify({"selectFields": ["distinct city"],"filters":{"City":{"$like":$("#area").val()+"%"},"State":"GA"}}),
              success: function( data ) {
        				if(data.count > 0){
        					var zipcodes = $.map(data.ZipCodes, function( item ) {
        					  return {
        						label: item.data.CITY,
        						value: item.data.CITY
        					  }
        					});

        					response(zipcodes);
        				}
        				else{
        					$.ajax({
        					  url: "/service/findPhysician/api/locations/findzipcode",
        					  method: "POST",
        					  dataType: "json",
        					  data: JSON.stringify({"selectFields": ["distinct city","zip"],"filters":{"Zip":$("#area").val()}}),
        					  success: function( data ) {
        						var zipcodes = $.map(data.ZipCodes, function( item ) {
        						  return {
        							label: item.data.CITY + ", " + item.data.ZIP,
        							value: item.data.ZIP
        						  }
        						});

        						response(zipcodes);
        					  }
        					});
        				}
              }
            });
          },
          minLength: 2,
          select: function( event, ui ) {
    		  //if we just link off, then we lose the other filters
    			//window.location.href="/physician-finder/results.html?area=" + ui.item.value;
          }
        });

        $("#fname").autocomplete({
          source: function( request, response ) {
            $.ajax({
			        url: "/service/findPhysician/api/phys-finder/search",
              method: "POST",
              dataType: "json",
              data: JSON.stringify({"selectFields": ["firstName", "lastName"],"filters":{"firstName":{"$like":$("#fname").val()+"%"}}}),
              success: function( data ) {
        				if(data.filteredCount > 0){
        					var names = $.map(data.data, function(item){
        						return {
        							label: item.FIRSTNAME + " " + item.LASTNAME,
        							value: encodeURIComponent(item.FIRSTNAME) + "&lname=" + encodeURIComponent(item.LASTNAME)
        						}
        					});
        					response(names);
        				}
      			  }
            });
          },
          minLength: 3,
          select: function( event, ui ) {
			         window.location.href="/physician-finder/results.html?fname=" + ui.item.value;
          }
        });

        $("#lname").autocomplete({
          source: function( request, response ) {
            $.ajax({
			        url: "/service/findPhysician/api/phys-finder/search",
              method: "POST",
              dataType: "json",
              data: JSON.stringify({"selectFields": ["firstName", "lastName"],"filters":{"lastName":{"$like":$("#lname").val()+"%"}}}),
              success: function( data ) {
        				if(data.filteredCount > 0){
        					var names = $.map(data.data, function(item){
        						return {
        							label: item.FIRSTNAME + " " + item.LASTNAME,
        							value: encodeURIComponent(item.FIRSTNAME) + "&lname=" + encodeURIComponent(item.LASTNAME)
        						}
        					});
        					response(names);
        				}
      			  }
            });
          },
          minLength: 3,
          select: function( event, ui ) {
			         window.location.href="/physician-finder/results.html?fname=" + ui.item.value;
          }
        });

        $(".results-page #fname, .results-page #lname").on("keyup", function () {
           checkSearchCriteria();
        });

		$("#fname").on("keyup",function(){
			if($(this).val() != ""){
        $(".filter-menu .close-menu").hide();
        $(".filter-menu .update").show();
			}else{
        $(".filter-menu .close-menu").show();
        $(".filter-menu .update").hide();
			}
		});

		$("#lname").on("keyup",function(){
			if($(this).val() != ""){
        $(".filter-menu .close-menu").hide();
        $(".filter-menu .update").show();
			}else{
        $(".filter-menu .close-menu").show();
        $(".filter-menu .update").hide();
			}
		});

        $(".results-page #area").on("keyup", function () {
            checkSearchCriteria();
            if ($("#area").val() != "")
    		    {
               $("#distance-group").show();
      			}
            else
            {
          		  $("#distance-group").hide();
                //$("#a-z").prop("checked","checked");
                $("#distance").prop("checked","");
                //updateQuery("sort", "az");
      			}
        });

        $(".landing-page #area").keypress(function(e) {
            if(e.which == 13) {
                location.href = "results.html?specialty=Primary%20Care&"+$(this).attr("id")+"="+encodeURIComponent($(this).val());
            }
        });

        $(".landing-page #fname, .landing-page #lname").keypress(function(e) {
            if(e.which == 13) {
                location.href = "results.html?"+$(this).attr("id")+"="+encodeURIComponent($(this).val());
            }
        });

        $(document).on("click", ".landing-page div.filter-options a", function(e){
    			location.href = "results.html?specialty="+encodeURIComponent($(this).html().replace("&amp;","&"));
    		});

      	// $("#name-menu .close-menu, #name-menu .update").on("click", function () {
        //   $.each(queryString, function(index, value) {
        //     queryString[index] = [];
        //   });
        // });

        Handlebars.registerHelper("displayMiles", function (distance){
        		if(distance != null)
            {
      				if(Math.round(distance) == 1){
      					return new Handlebars.SafeString( "<li><span>"+Math.round(distance)+" mile</span></li>");
      				}
      				else{
      					return new Handlebars.SafeString( "<li><span>"+Math.round(distance)+" miles</span></li>");
      				}
    			  } else {
        		    return new Handlebars.SafeString( "<li>&nbsp;</li>");
    			  }
    		});

        Handlebars.registerHelper("displayBadge", function (isFaculty){
    			if(isFaculty == "true")
          {
    				return new Handlebars.SafeString( "<div class='faculty-badge'>Emory school of medicine    <span class='hidden-md hidden-sm'>faculty</span></div>")
    			}
    		});

        Handlebars.registerHelper("equals", function (firstTerm, secondTerm){
      		if(firstTerm == secondTerm)
          {
    				return true;
    			}
    			else
    			{
    				return false;
    			}
    		});

    		Handlebars.registerHelper("displayLocations", function (locations){

    			var output = "<div class='col-xs-8'><ul>";
    			var dists = "<div class='col-xs-4'><ul class='miles'>";


    			var cities = { "locations": [] };

    			for(ct = 0; ct < locations.length; ct++){
    				if (locations[ct].NAME != locations[ct].PHONE){
    					if(locations[ct].DISTANCE != null){
    						output = output + "<li>" + locations[ct].CITY + ", GA</li>"
    						if(Math.round(locations[ct].DISTANCE) == 1){
    							dists = dists + "<li><span>"+Math.round(locations[ct].DISTANCE)+" mile</span></li>";
    						}
    						else{
    							dists = dists + "<li><span>"+Math.round(locations[ct].DISTANCE)+" miles</span></li>";
    						}
    					} else {
    						var found = 0;

    						$.each(cities.locations, function(){
    							if (this.name == locations[ct].CITY){
    								this.count = this.count + 1;
    								found = 1;
    							}
    						});

    						if (!found)
    							cities.locations.push({name: locations[ct].CITY, count: 1});

    						dists = dists + "<li>&nbsp;</li>";
    					}
    				}
    			}

    			$.each(cities.locations, function(){
    				if (this.count > 1)
    					output = output + "<li>" + this.name + ", GA (" + this.count + " locations)</li>";
    				else
    					output = output + "<li>" + this.name + ", GA</li>"
    			});

    			output = output + "</ul></div>" + dists + "</ul></div>"

    			return new Handlebars.SafeString(output);
    		});

        Handlebars.registerHelper("displayNumber", function (location){
    			if(location.length > 0){
    				if(location[0].NAME == location[0].PHONE)
    				{
    					//credentialed record, let's get the next record
    					if(location[1] && location[1].PHONE){
    						return new Handlebars.SafeString(location[1].PHONE);
    					}
    					else {
    						return new Handlebars.SafeString(location[0].PHONE);
    					}
    				}
    				else
    				{
    					return new Handlebars.SafeString(location[0].PHONE);
    				}
    			}
    		});

        Handlebars.registerHelper("displayCard", function (hasDetail){
    			if(hasDetail)
          {
    				return new Handlebars.SafeString( "<div class='module physician-block faculty'>")
    			}
    			else
          {
    				return new Handlebars.SafeString( "<div class='module physician-block generic short-card'>")
    			}
    		});

        Handlebars.registerHelper("displayCardImage", function (href, imageSrc, firstName, lastName){
    			if(href != null)
          {
    				return new Handlebars.SafeString( "<figure class='thumb'><a href='" + href + "'><img src='" + imageSrc + "' alt='" + firstName + lastName + "'></a></figure>")
    			}
    		});

        Handlebars.registerHelper("displayPrimary", function (specialties){
          for(ct = 0; ct < specialties.length; ct++){
            if(specialties[ct].ISPRIMARY == "Y"){
              if(specialties[ct].NAME == "Primary Care") {
                return "Primary Care Physician";
              }
              else
              {
                return specialties[ct].NAME;
              }
            }
          }
        });

        Handlebars.registerHelper("displaySpecialty", function (specialties){
  		    var arrPrimary = [];
    			var arrReferrable = [];
    			var arrNonReferrable = [];
    			var boardCertifications = "";
    			for(ct = 0; ct < specialties.length; ct++){
    				var specialty = specialties[ct];
    				if(specialty.ISPRIMARY == "Y"){
    					arrPrimary.push("<li>"+specialty.NAME + " " + specialty.YEAR+"</li>");
    				}
    				else if(specialty.REFERABLE == "Y"){
    					arrReferrable.push("<li>"+specialty.NAME + " " + specialty.YEAR+"</li>");
    				}
    				else{
    					arrNonReferrable.push("<li>"+specialty.NAME + " " + specialty.YEAR+"</li>");
    				}
    			}
    			for(ct = 0; ct < arrPrimary.length; ct++){
    				boardCertifications += arrPrimary[ct].replace(" null","");
    			}
    			for(ct = 0; ct < arrReferrable.length; ct++){
    				boardCertifications += arrReferrable[ct].replace(" null","");
    			}
    			for(ct = 0; ct < arrNonReferrable.length; ct++){
    				boardCertifications += arrNonReferrable[ct].replace(" null","");
    			}
    			return new Handlebars.SafeString(boardCertifications);
    		});

        Handlebars.registerHelper("displayInNetwork", function (networkMember){
      		if (networkMember == "true")
      			return new Handlebars.SafeString("<p class=\"alt\">Emory Healthcare Network Physician</p>");
      		else
      			return;
    		});

        function assignValue(qryFilters, fieldName, value) {
            if (value) {
                if (value.indexOf('%') > 0)
                    value = { "$like": value };
                qryFilters[fieldName] = value;
            }
        }

        function checkSearchCriteria(){
            if ($("#area").val() != "" || $("#fname").val() != "" || $("#lname").val() != ""
                || $("#photo").is(":checked") || $("#clinic").is(":checked") || $("#filter-by-faculty").is(":checked")
                || $("#male").is(":checked") || $("#female").is(":checked")
                || $("#specialty-menu li.active a").length > 0
                || $("#clinical-menu li.active a").length > 0
                || $("#language-menu li.active a").length > 0
                || $("#hospitalName-menu li.active a").length > 0
                || $("#practiceName-menu li.active a").length > 0
                ){
                  $(".filter-menu .close-menu").hide();
            	    $(".filter-menu .update").show();
            } else {
                $(".filter-menu .close-menu").show();
                $(".filter-menu .update").hide();
            }

        }

    	function setActiveFilters(){
			     $("a[data-target]").siblings().remove();

           $("div.sub-filter-menu div.filter-options li.active").each(function (index, obj)
    		   {
                var selectedChoice = "";
				        var subMenu = $(obj).closest("div.sub-filter-menu");

                if ($("a[data-target='#"+$(subMenu).attr("id")+"']").siblings("div.selected-options").length == 1)
                {
                    var temp = $(obj).find("a").html();
                    $("a[data-target='#"+$(subMenu).attr("id")+"']").siblings("div.selected-options").find("ul li:last")
                    .after("<li><a href='#' class='selected' data-id='" + temp + "'>" + temp + "</a></li>");
                }
                else
                {
                    selectedChoice += "<div class='selected-options'>";
            				selectedChoice += "<a href='#' id='clear-specialty' class='clear-selected'>Clear</a>";
            				selectedChoice +=  "<ul>";

                    var temp = $(obj).find("a").html();
                		selectedChoice += "<li><a href='#' class='selected' data-id='" + temp + "'>" + temp + "</a></li>";

            				selectedChoice += "</ul>";
            				selectedChoice += "</div>";

            				$("a[data-target='#"+$(subMenu).attr("id")+"']").addClass("has-options");
            				$("a[data-target='#"+$(subMenu).attr("id")+"']").after(selectedChoice);
                }

    		   });

            $("div.selected-options .clear-selected").on("click", function(e){
        		    e = e || window.event;
                var targetList = $(this).closest("div").siblings("a.has-options").data("target");

                clearSelected(targetList);

          			$(this).closest("li").find("a").removeClass("has-options");
          			$(this).parent().remove();

                $(targetList + " div.filter-options li.active").removeClass("active");
          			e.preventDefault ? e.preventDefault() : e.returnValue = false;
          		});

            $("div.selected-options a.selected").on("click", function(e){
        		    e = e || window.event;

                var targetDiv = $(this).closest("div");
                var count = $(targetDiv).find("ul li").length;

                var targetList = $(targetDiv).siblings("a.has-options").data("target");
                var name = $(this).html();


                $(targetList + " div.filter-options li.active a[data-id='"+name+"']").closest("li").removeClass("active");
                if (count == 1)
                {
                    $(targetDiv).closest("li").find("a").removeClass("has-options");
                    $(targetDiv).remove();
                } else {
                    $(this).parent().remove();
                }
    			      e.preventDefault ? e.preventDefault() : e.returnValue = false;
    		});

		}

		function reloadFilters(data, qry){
			$("#specialty-menu div.filter-menu div.filter-options ul").html(""); //clear all existing specialties
			$("#clinical-menu div.filter-menu div.filter-options ul").html(""); //clear all existing interests
			$("#language-menu div.filter-menu div.filter-options ul").html(""); //clear all existing languages
			$("#practiceName-menu div.filter-menu div.filter-options ul").html(""); //clear all existing locations
			$("#hospitalName-menu div.filter-menu div.filter-options ul").html(""); //clear all existing hospitals

			var arrSpecValues = [];
			var arrClinicalValues = [];
			var arrLangValues = [];
			var arrLocValues = [];
			var arrHospValues = [];
			$(data).each(function (index, obj){
				$(obj.hospitalAffiliations).each(function (i,o){
					var loc = o.LOCATIONNAME;
					if($.inArray(loc,arrHospValues) == -1){
						arrHospValues.push(loc);
					}
				});
				$(obj.specialties).each(function (i,o){
					var spec = o.NAME;
					if($.inArray(spec,arrSpecValues) == -1){
						arrSpecValues.push(spec);
					}
				});
				$(obj.clinicalInterests).each(function (i,o){
					if($.inArray(o,arrClinicalValues) == -1){
						arrClinicalValues.push(o);
					}
				});
				$(obj.languages).each(function (i,o){
					if($.inArray(o,arrLangValues) == -1){
						arrLangValues.push(o);
					}
				});
				$(obj.locations).each(function (i,o){
					var practice = o.LOCATIONNAME;
					var city = o.CITY;
					if(o.NAME != o.PHONE && city != null && practice.indexOf("Hospital") == -1){
						if($.inArray(practice,arrLocValues) == -1){
							arrLocValues.push(practice);
						}
					}
				});
			});

			//sort arrays
			arrSpecValues.sort();
			arrClinicalValues.sort();
			arrLangValues.sort();
			arrLocValues.sort();
			arrHospValues.sort();

			$(arrHospValues).each(function(i, obj){
				var htmlLI = "<li><a href='#'>" + obj + "</a></li>";
				if(qry.containsAll && qry.containsAll["hospitalAffiliations.locationName"]){
					var found = $.inArray(obj, qry.containsAll["hospitalAffiliations.locationName"]) > -1;
					if(found){
						htmlLI = "<li class='active'><a href='#' data-id='" + obj + "'>" + obj + "</a></li>";
					}
				}
				$("#hospitalName-menu div.filter-menu div.filter-options ul").append(htmlLI);
			});
			$(arrSpecValues).each(function(i, obj){
				var htmlLI = "<li><a href='#'>" + obj + "</a></li>";
				if(qry.containsAll && qry.containsAll["specialties.name"]){
					var found = $.inArray(obj, qry.containsAll["specialties.name"]) > -1;
					if(found){
						htmlLI = "<li class='active'><a href='#' data-id='" + obj + "'>" + obj + "</a></li>";
					}
				}
				$("#specialty-menu div.filter-menu div.filter-options ul").append(htmlLI);
			});
			$(arrClinicalValues).each(function(i, obj){
				var htmlLI = "<li><a href='#'>" + obj + "</a></li>";
        if(qry.containsAll && qry.containsAll["clinicalInterests"]){
					var found = $.inArray(obj, qry.containsAll["clinicalInterests"]) > -1;
					if(found){
						htmlLI = "<li class='active'><a href='#' data-id='" + obj + "'>" + obj + "</a></li>";
					}
				}
				$("#clinical-menu div.filter-menu div.filter-options ul").append(htmlLI);
			});
			$(arrLangValues).each(function(i, obj){
				var htmlLI = "<li><a href='#'>" + obj + "</a></li>";
        if(qry.containsAll && qry.containsAll["languages"]){
					var found = $.inArray(obj, qry.containsAll["languages"]) > -1;
					if(found){
						htmlLI = "<li class='active'><a href='#' data-id='" + obj + "'>" + obj + "</a></li>";
					}
				}
				$("#language-menu div.filter-menu div.filter-options ul").append(htmlLI);
			});
			$(arrLocValues).each(function(i, obj){
				var htmlLI = "<li><a href='#'>" + obj + "</a></li>";
        if(qry.containsAll && qry.containsAll["locations.locationName"]){
					var found = $.inArray(obj, qry.containsAll["locations.locationName"]) > -1;
					if(found){
						htmlLI = "<li class='active'><a href='#' data-id='" + obj + "'>" + obj + "</a></li>";
					}
				}
				$("#practiceName-menu div.filter-menu div.filter-options ul").append(htmlLI);
			});
		}

		function runSearch(){

			var searchOnlyCMS = true;
			//clear results
			$("#filteredCount").parent().hide();
			$("#h2Loading").show();

			setActiveFilters();
			buildFilters = "";

      var startIndex  = 9 * (currentPage - 1);
      var endIndex = 9 * currentPage;
      if (currentPage > 1){
          startIndex = startIndex + 1;
      }

			var qry = {
  			selectFields: [ "firstName", "middleName", "lastName", "honorifics", "specialties","clinicalInterests", "hospitalAffiliations", "medicalPracticeName", "networkMember", "languages", "locations", "imagesrc", "href", "displayemoryshieldlogo"],
  			filters: {},
                selectRows: {"startIndex":startIndex,"endIndex":endIndex },
  			orderingID: randomSeed
			};

      if ($("#a-z").is(":checked")){
        qry.orderBy = { "lastName": -1, "firstName": -1 };
        updateQuery("sort", "az");
      }
      else if ($("#z-a").is(":checked")){
        qry.orderBy = { "lastName": 1, "firstName": 1 };
        updateQuery("sort", "za");
      }
      else {
        removeQuery("sort", null);
      }

      if ($("#area").val() != ""){
  	    var rad = "7";
        temp = location.search.match(/radius=([^&]+)/);
        if (temp != null)
        {
            rad = temp[1];
        }
        if (isNaN($("#area").val())) {
            qry.geoWithin = {"city":$("#area").val(),"state":"GA", "radius":rad};
        } else {
            qry.geoWithin = {"zipCode":$("#area").val(),"radius":rad};
        }
        if (getQuery("sort") != "az" && getQuery("sort") != "za"){
          qry.geoWithin.findNearest = "true";
          addQuery("sort", "distance");
        }
        updateQuery("area", $("#area").val());
        buildFilters += "<li><a href='#'  data-id='area'>" + $("#area").val() + "</a></li>";
		  }

			if ($("#fname").val() != "")
			{
				searchOnlyCMS = false;
				assignValue(qry.filters, "firstName", $("#fname").val());
				buildFilters += "<li><a href='#'  data-id='firstName'>" + $("#fname").val() + "</a></li>";
        addQuery("fname", $("#fname").val());
			}

			if ($("#lname").val() != "")
			{
				searchOnlyCMS = false;
				assignValue(qry.filters, "lastName", $("#lname").val() + "%");
				buildFilters += "<li><a href='#' data-id='lastName'>" + $("#lname").val() + "</a></li>";
        addQuery("lname", $("#lname").val());
			}

      if (getQuery("dept")){
        assignValue(qry.filters, "clinics.name", getQuery("dept"));
  			buildFilters += "<li><a href='#' data-id='dept'>" + getQuery("dept") + "</a></li>";
      }

			if (getQuery("center"))
			{
				assignValue(qry.filters, "centers.name", getQuery("center"));
				buildFilters += "<li><a href='#' data-id='center'>" + getQuery("center") + "</a></li>";
			}

      if ($("#photo").is(":checked"))
      {
        qry.filters["imagesrc"] = { "$ne": "/img/physician-photos/nophoto.jpg" };
  	    buildFilters += "<li><a href='#' data-id='photo'>Has Photo</a></li>";
        addQuery("photo", "true");
			}

      if ($("#clinic").is(":checked"))
      {
        assignValue(qry.filters, "medicalPracticeName", "Emory Clinic");
        buildFilters += "<li><a href='#' data-id='clinic'>Emory Clinic Physicians</a></li>";
        addQuery("emoryClinics", "true");
			}

      if (getQuery("faculty") == "true")
      {
        assignValue(qry.filters, "displayemoryshieldlogo", "true");
		    buildFilters += "<li><a href='#' data-id='faculty'>Faculty Only</a></li>";
			}

      if ($("#male").is(":checked"))
      {
        assignValue(qry.filters, "sex","M");
    	  buildFilters += "<li><a href='#' data-id='sex'>Male</a></li>";
        addQuery("sex", "male");
			}
      else if ($("#female").is(":checked"))
      {
        assignValue(qry.filters, "sex","F");
  		  buildFilters += "<li><a href='#' data-id='sex'>Female</a></li>";
        addQuery("sex", "female");
      }

      if ($("#specialty-menu li.active a").length){
        addContainsAll(qry);
        qry.containsAll["specialties.name"] = [];
        removeQuery("specialty", null);
        $("#specialty-menu li.active a").each(function (index,obj){
    				qry.containsAll["specialties.name"].push($(obj).html().replace("&amp;","&"));
            buildFilters += "<li><a href='#' data-id='spec'>"+$(obj).html()+"</a></li>";
            addQuery("specialty",$(obj).html());
        });
      }

      if ($("#hospitalName-menu li.active a").length){
        addContainsAll(qry);
        qry.containsAll["hospitalAffiliations.locationName"] = [];
        removeQuery("hospital", null);
        $("#hospitalName-menu li.active a").each(function (index,obj){
            qry.containsAll["hospitalAffiliations.locationName"].push($(obj).html().replace("&amp;","&"));
            buildFilters += "<li><a href='#' data-id='affiliation'>"+$(obj).html()+"</a></li>";
            addQuery("hospital",$(obj).html());
        });
      }

      if ($("#clinical-menu li.active a").length){
        addContainsAll(qry);
        qry.containsAll["clinicalInterests"] = [];
        removeQuery("clinicalInterests", null);
        $("#clinical-menu li.active a").each(function (index,obj){
            qry.containsAll["clinicalInterests"].push($(obj).html().replace("&amp;","&"));
            buildFilters += "<li><a href='#' data-id='clinical'>"+$(obj).html()+"</a></li>";
            addQuery("clinicalInterests",$(obj).html());
        });
      }

      if ($("#language-menu li.active a").length){
        addContainsAll(qry);
        qry.containsAll["languages"] = [];
        removeQuery("language", null);
        $("#language-menu li.active a").each(function (index,obj){
            qry.containsAll["languages"].push($(obj).html().replace("&amp;","&"));
            buildFilters += "<li><a href='#' data-id='language'>"+$(obj).html()+"</a></li>";
            addQuery("language",$(obj).html());
        });
      }

      if ($("#practiceName-menu li.active a").length){
        addContainsAll(qry);
        qry.containsAll["locations.locationName"] = [];
        removeQuery("office", null);
        $("#practiceName-menu li.active a").each(function (index,obj){
            qry.containsAll["locations.locationName"].push($(obj).html().replace("&amp;","&"));
            buildFilters += "<li><a href='#' data-id='practice'>"+$(obj).html()+"</a></li>";
            addQuery("office",$(obj).html());
        });
      }

			if(searchOnlyCMS){
				assignValue(qry.filters, "isCMS", "true");
			}

			$(".specialist-filters").html(buildFilters);

      updateQueryString();

			jQuery.ajax({
				type: 'POST',
				url: "/service/findPhysician/api/phys-finder/search",
				dataType: "json",
				data: JSON.stringify(qry),
				success: function(data, textStatus) {
					var theTemplateScript = $("#phys-template").html();

					//compile
					var theTemplate = Handlebars.compile(theTemplateScript);
					$("#phys-results").append(theTemplate(data));

                    $("#filteredCount").html(data.filteredCount);
                    $("#totalCount").html(data.totalCount);

					if (endIndex <= data.filteredCount){
						$("#btnLoadMore").show();
					}
					else{
						$("#btnLoadMore").hide();
					}

					$("#formFilterFaculty").show();
					$("#filteredCount").parent().show();
					$("#h2Loading").hide();

				},
				error: function (jqXHR, textStatus) {
					//$("#phys-results").html(textStatus);
				}
			});

			//first call is for all results, not just paginated ones for filtering
            delete qry.selectRows;
			jQuery.ajax({
				type: 'POST',
				url: "/service/findPhysician/api/phys-finder/search",
				dataType: "json",
				data: JSON.stringify(qry),
				success: function(data, textStatus) {
					//reloadSpecialties(data.data, qry);
					//reloadClinicalInterests(data.data, qry);
					//reloadLanguages(data.data,qry);
					//reloadLocations(data.data,qry);
					reloadFilters(data.data,qry);
				},
				error: function (jqXHR, textStatus) {
					//$("#phys-results").html(textStatus);
				}
			});
		}

    function addContainsAll(query){
      if (!query.containsAll)
        query.containsAll = {};
    };

		//code for clicking x on faceted search filter
		$(document).on("click", ".specialist-filters li a",  function(e){
			e = e || window.event;
			if ($(this).data("id") == "firstName")
			{
				$("#fname").val("");
        removeQuery("fname", null);
			}
			else if ($(this).data("id") == "lastName")
			{
				$("#lname").val("");
        removeQuery("lname", null);
			}
      else if ($(this).data("id") == "area")
			{
        removeQuery("area", $("#area").val());
        $("#area").val("");

        if ($("#distance").is(":checked"))
        {
           //$("#a-z").prop("checked","checked");
           $("#distance").prop("checked","");
           removeQuery("sort", null);
        }
			}
			else if ($(this).data("id") == "photo")
			{
				$("#photo").prop("checked","");
        removeQuery("photo", null);
			}
			else if ($(this).data("id") == "clinic")
			{
				$("#clinic").prop("checked","");
        removeQuery("emoryClinics", null);
			}
      else if ($(this).data("id") == "faculty")
			{
				$("#filter-by-faculty").prop("checked","");
        removeQuery("faculty", null);
			}
      else if ($(this).data("id") == "sex")
			{
				$("#no-preference").prop("checked","checked");
        removeQuery("sex", null);
			}
      else if ($(this).data("id") == "spec")
			{
		    $("a[data-target='#specialty-menu']").siblings("div").find("li a[data-id='"+$(this).html()+"']").trigger("click");
        removeQuery("specialty", $(this).html());
			}
      else if ($(this).data("id") == "clinical")
  		{
				$("a[data-target='#clinical-menu']").siblings("div").find("li a[data-id='"+$(this).html()+"']").trigger("click");
        removeQuery("clinicalInterests", $(this).html());
			}
      else if ($(this).data("id") == "language")
    	{
				$("a[data-target='#language-menu']").siblings("div").find("li a[data-id='"+$(this).html()+"']").trigger("click");
        removeQuery("language", $(this).html());
			}
      else if ($(this).data("id") == "affiliation")
      {
				$("a[data-target='#hospitalName-menu']").siblings("div").find("li a[data-id='"+$(this).html()+"']").trigger("click");
        removeQuery("hospital", $(this).html());
			}
      else if ($(this).data("id") == "practice")
      {
        $("a[data-target='#practiceName-menu']").siblings("div").find("li a[data-id='"+$(this).html()+"']").trigger("click");
        removeQuery("office", $(this).html());
      }

			$(this).parent().remove();
      $("#phys-results").html("");
			runSearch();
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
		});

		//clear all
		$("#clear-all").on("click", function(e){
			e = e || window.event;
			$("div.filter-options li").removeClass("active");
			$("div.selected-options .clear-selected").trigger("click");
			$("#no-preference").trigger("click");
			$("#clinic").attr("checked",false)
			$("#photo").attr("checked",false)
      checkSearchCriteria();
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
			$(".results-page .filter-menu .close-menu").trigger("click");

      $.each(queryString, function(index, value) {
        queryString[index] = [];
      });
		});

		//checking faculty only checkbox
    $("#filter-by-faculty").on("change", function () {
        $("#phys-results").html("");

        if (getQuery("faculty"))
          removeQuery("faculty", null);
        else
          addQuery("faculty", "true");

        currentPage = 1;
	      runSearch();
        checkSearchCriteria();
		});

		//back
    $(".results-page .filter-menu .back-menu").on("click", function () {
		    setActiveFilters();
        checkSearchCriteria();
		});

		//update or close
  	$(".results-page .filter-menu .update, .results-page .filter-menu .close-menu").on("click", function () {
        $("#phys-results").html("");
        currentPage = 1;
	      runSearch();
		});

    function updateQueryString(){
      var firstParam = true;
      var qstring = "";
      $.each(queryString, function(index, value) {
        var firstVal = true;
        if (getQuery(index)){
          if (firstParam){
            qstring = "?";
            firstParam = false;
          } else {
            qstring += "&";
          }
          $.each(queryString[index], function(i,val) {
            if (firstVal){
              qstring += index + "=" + encodeURIComponent(val);
              firstVal = false;
            } else {
              qstring += "," + encodeURIComponent(val);
            }
          });
        }
      });
      window.history.pushState(null,$(document).find("title").text(), window.location.href.split('?')[0] + qstring);
    };

    function removeQuery(name, value){
      if (value == null){
        queryString[name] = [];
      } else {
        queryString[name].remove(value);
      }
    };

    function addQuery(name, value){
      queryString[name].push(value);
    };

    function updateQuery(name, value){
      queryString[name].pop();
      queryString[name].push(value);
    };

    function getQuery(name){
      if (queryString[name].length > 0)
        return queryString[name][0];
      else
        return null;
    }

    function clearSelected(idName){
        if (~idName.indexOf("specialty"))
          removeQuery("specialty", null);
        else if (~idName.indexOf("clinical"))
          removeQuery("clinicalInterests", null);
        else if (~idName.indexOf("language"))
          removeQuery("language", null);
        else if (~idName.indexOf("hospital"))
          removeQuery("hospital", null);
        else if (~idName.indexOf("practice"))
          removeQuery("office", null);
    }

    Array.prototype.remove= function(){
        var what, a= arguments, L= a.length, ax;
        while(L && this.length){
            what= a[--L];
            while((ax= this.indexOf(what))!= -1){
                this.splice(ax, 1);
            }
        }
        return this;
    }
    });
});
