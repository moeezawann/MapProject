
    // gobal array where features that are transofrmed to json in order to map counties will be held
        let geojsonFeatures = [];
         
    // global array adding the HealthData to an array that we will use 
        let processedData = [];

    //  global variables for index.html li health condition options

    // let heart_attacks = document.getElementById("heart_attacks");
    // let colonCancer =  document.getElementById("colon");
    // let breastCancer = document.getElementById("breast");
    // let skinCancer = document.getElementById("skin");
    // let strokes = document.getElementById("strokes");
    // let hiv = document.getElementById("HIV");
    // let herpes = document.getElementById("Herpes");
    // let gonorrhea = document.getElementById("Gonorrhea");
    // let syphilis = document.getElementById("Syphilis");
    // let aids = document.getElementById("AIDS");
    // let chlamydia = document.getElementById("Chlamydia");
    // let diabetes = document.getElementById("diabetes");
    // let arthritis = document.getElementById("arthritis");
    
    // creating array for all the health conditons instead of writing 
    // numeorus getelementbyId statements
    const healthIds = [
        "heart_attacks","colon","breast",
        "skin","strokes","HIV","Herpes",
        "Gonorrhea","Syphilis","AIDS",
        "Chlamydia","diabetes","arthritis"
    ];
    
    // mapping them to this array
    const healthIDsArray = healthIds.map(id => document.getElementById(id));

    
         // starting to map North Carolina 
          var map = L.map('map').setView([36.5, -79.5], 7); // Initial map view

          var osm =  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 13,
          attribution: '© OpenStreetMap contributors'
  });
         osm.addTo(map)

     fetch('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/us-county-boundaries/records?limit=100&refine=stusab%3A%22NC%22')
    .then(res => res.json())
    .then(data => {
        
        // array where features that are transofrmed to json will be held
        // var geojsonFeatures = [];

       
        if (data.results) {
            data.results.forEach(record => {
                // Extract latitude and longitude as floating point from the API response
                const long = parseFloat(record.intptlon);
                const lat = parseFloat(record.intptlat);

                // Check if coordinates are valid numbers
                if (!isNaN(long) && !isNaN(lat)) {
                    // Create a GeoJSON feature
                    const geojsonFeature = {
                        "type": "Feature",
                        "properties": {
                            "HQ_NAME": record.name + ' County'
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [long, lat]
                        }
                    };

                     // assigning out coordinates for shape mapping 
                    const countyCoordinates = record.geo_shape.geometry.coordinates;
                    //  Assuming `countCoordinates` is defined as an array of coordinates and `record.name` is available as a variable
                      L.geoJSON({
                        "type": "FeatureCollection",
                        "features": [{
                            "type": "Feature",
                            "id": 0,
                            "properties": {
                                "DISTRICT": record.name,
                                "name": "Count Lines"
                            },
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": countyCoordinates
                            }
                        }]
                    }).addTo(map);

                    // this creates the shape of the counties onto the map
                      countyCoordinates.forEach(data => {
                        L.geoJSON({
                            "type": "Feature",
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": [data[0][0], data[0][1]]
                            },
                            "properties": {
                                "name": "County Points"
                            }
                            }).addTo(map);
                      });
                    
                    // Add the feature to the array
                    geojsonFeatures.push(geojsonFeature);
                } else {
                    console.error('Invalid coordinates for record:', record);
                }
            });

            //adding the features to the map
            L.geoJSON(geojsonFeatures).addTo(map);
    
           // adding the HC-Data to an array that we will use 
            // const processedData = [];
             

           // parisng through the health data JSON I made via fetch call
        //    fetch('HealthData.json')
        //             .then(response => response.json())
        //             .then(data => {
        //                 data.forEach(healthData => processedData.push(healthData));
    
        //             //   processedData.forEach(result => {
    
        //             L.geoJSON(geojsonFeatures, {
        //                 onEachFeature: function (feature,layer){
                            
        //                 const matchingCountyData = processedData.find(data => data.county === feature.properties.HQ_NAME);
        //             //    const filteredData = processedData.filter(item => item.health_data[medCond] === item.properties.HQ_NAME);
    
    
        //                     //console.log(filteredData);
        //                 //  Bind popup for click event
        //                 layer.bindPopup(feature.properties.HQ_NAME);
        
        //                 //  Bind tooltip for hover event
        //                 layer.bindTooltip(feature.properties.HQ_NAME, {
        //                         permanent: false,             // Tooltip is not always visible
        //                         direction: 'top',             // Tooltip appears above the feature
        //                         className: 'county-tooltip'   // Custom class for styling
        //                     });
                            
        //                     if(matchingCountyData){
        //                     let tooltipContent = `<strong>${matchingCountyData.county}</strong><br>
        //                         Population: ${matchingCountyData.population}<br><br>
        //                         <strong>${matchingCountyData.health_data.heart_attacks}</strong>
        //                         <br>Black: ${matchingCountyData.health_data.heart_attacks.black}<br>`;
        //                         // console.log(matchingCountyData.county);
        //                         // console.log(matchingCountyData.health_data.heart_attacks.total);
        
        //                     layer.bindPopup(tooltipContent);
        //                     } else {
        //                         console.log("Names do not match");
        //                     }
        //                 }
        //                 }).addTo(map)
           
           
        //                            //  }) 
                       
        //                    })
        //                    .catch(error => {
        //                        console.error('Error fetching or processing data:', error);
        //                    });


              // L.geoJSON(NCjson).addTo(map);
           
            //map.fitBounds(ncJson.getBounds()); 

    }

  }).catch(error => console.error('Error fetching data:', error));

  
  
//function addMedConditionToMap(medCond, medCondName){
   
    // fetch('HealthData.json')
    //         .then(response => response.json())
    //         .then(data => {
    //             data.forEach(healthData => processedData.push(healthData));

    //             //   processedData.forEach(result => {

    //         L.geoJSON(geojsonFeatures, {
    //             onEachFeature: function (feature,layer){
                    
    //             const matchingCountyData = processedData.find(data => data.county === feature.properties.HQ_NAME);
    //             const filteredData = processedData.filter(item => item.health_data[medCond] === item.properties.HQ_NAME);


    //                 //console.log(filteredData);
    //             //  Bind popup for click event
    //             layer.bindPopup(feature.properties.HQ_NAME);

    //             //  Bind tooltip for hover event
    //             layer.bindTooltip(feature.properties.HQ_NAME, {
    //                     permanent: false,             // Tooltip is not always visible
    //                     direction: 'top',             // Tooltip appears above the feature
    //                     className: 'county-tooltip'   // Custom class for styling
    //                 });
                    
    //                 if(matchingCountyData && processedData.health_data[medCond]){
    //                 let tooltipContent = `<strong>${matchingCountyData.county}</strong><br>
    //                     Population: ${matchingCountyData.population}<br><br>
    //                     <strong>${medCondName}</strong>
    //                     <br>Black: ${matchingCountyData.health_data.heart_attacks.black}<br>`;
    //                     // console.log(matchingCountyData.county);
    //                     // console.log(matchingCountyData.health_data.heart_attacks.total);

    //                 layer.bindPopup(tooltipContent);
    //                 } else {
    //                     console.log("Names do not match");
    //                 }
    //             }
    //             }).addTo(map)


    //                 //  }) 
        
    //         })
    //         .catch(error => {
    //             console.error('Error fetching or processing data:', error);
    //         });
//     console.log("here");
//     var ddlRace = document.getElementById("ddlRace");
//     ddlRace.removeAttribute("disabled");
//  console.log(document.getElementById("ddlMedCondtion").value);
//    // $(".ddlRace").setAttribute();

//     document.getElementsByClassName("list");
    
//}


function addMedConditionToMap(conditionId, conditionName) {
    console.log(`Adding ${conditionName} to map with ID: ${conditionId}`);

    fetch('HealthData.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(healthData => processedData.push(healthData));



        L.geoJSON(geojsonFeatures, {
            onEachFeature: function (feature, layer) {
                const matchingCountyData = processedData.find(data => data.county === feature.properties.HQ_NAME);
                const filteredData = processedData.filter(item => item.health_data[conditionId] === item.county);
    
                // Bind popup for click event
                layer.bindPopup(feature.properties.HQ_NAME);
    
                // Bind tooltip for hover event
                layer.bindTooltip(feature.properties.HQ_NAME, {
                    permanent: false,             // Tooltip is not always visible
                    direction: 'top',             // Tooltip appears above the feature
                    className: 'county-tooltip'   // Custom class for styling
                });
    
                if (matchingCountyData && filteredData) {
                    let tooltipContent = `<strong>${matchingCountyData.county}</strong><br>
                        Population: ${matchingCountyData.population}<br><br>
                        <strong>${conditionName}</strong>
                        <br>Total: ${matchingCountyData.health_data.cancer.colon.total}<br>`;
                   
    
                    layer.bindPopup(tooltipContent);
                } else {
                    console.log("Names do not match");
                }
            }
        }).addTo(map);
                
    })
    .catch(error => {
        console.error('Error fetching or processing data:', error);
    });

}
            