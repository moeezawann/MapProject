
    // gobal array where features that are transofrmed to json in order to map counties will be held
        let geojsonFeatures = [];
         
    // global array adding the HealthData to an array that we will use 
        let processedData = [];

    // assigning out coordinates for county shape mapping 
        let countyCoordinates = [];

    // assiging a variable for the full county creation for choropleth mapping

        let fullCounty = [];

    //  global variables for index.html li health condition options

    // let heart_attacks = document.getElementById("heart_attacks");
    //let colonCancer =  document.getElementById("colon");
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
    //let menu = document.getElementsByClassName("dropDownMenu");
    
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
                            "HQ_NAME": record.name + ' County',
                           // "total": 0 // added this section for total 6/26/24 as it could be needed for the chorpleth section
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [long, lat]
                        }
                   };

                     // assigning out coordinates for county shape mapping 
                         countyCoordinates = record.geo_shape.geometry.coordinates;
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
                                "coordinates": countyCoordinates,
                                "total": 0 // added this section for total 6/26/24 as it could be needed for the chorpleth section

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
                                "name": "County Points",
                                "total": 0 // added this section for total 6/26/24 as it could be needed for the chorpleth section
                            }
                            }).addTo(map);

                            fullCounty.push(countyCoordinates);
                      });
                    
                    // Add the feature to the array
                    geojsonFeatures.push(geojsonFeature);
                } else {
                    console.error('Invalid coordinates for record:', record);
                }
             });

           

            //adding the features to the map
            L.geoJSON(geojsonFeatures).addTo(map);

            countyCoordinates.forEach(data => {
                data.forEach(coordSet => {
                    fullCounty.push(coordSet);
                });
            });
            
            console.log(fullCounty);
            

            // countyCoordinates.forEach(data => {
            //     data.forEach(coordSet => {
            //         L.geoJSON({
            //             "type": "Feature",
            //             "geometry": {
            //                 "type": "Polygon",
            //                 "coordinates": [coordSet] // Assuming each coordSet is a pair [lon, lat]
            //             },
            //             "properties": {
            //                 "name": "County Points",
            //                 "total": 0 // added this section for total 6/26/24 as it could be needed for the choropleth section
            //             }
            //         }).addTo(map);
            
            //         // Add the coordinate set to fullCounty array
            //         fullCounty.push(coordSet);
            //     });
            // });

        


           
           // adding the HC-Data to an array that we will use 
            // const processedData = [];

            // when initially entering website this will allow poeple to hover around the map and see the counties
            // in NC with names 
            L.geoJSON(geojsonFeatures, {
                onEachFeature: function (feature,layer){
                    
                const matchingCountyData = processedData.find(data => data.county === feature.properties.HQ_NAME);
            
                //  Bind tooltip for hover event
                layer.bindTooltip(feature.properties.HQ_NAME, {
                        permanent: false,             // Tooltip is not always visible
                        direction: 'top',             // Tooltip appears above the feature
                        className: 'county-tooltip'   // Custom class for styling
                    });
                    
                    
                }
                }).addTo(map)
    
              // L.geoJSON(NCjson).addTo(map);
           
            //map.fitBounds(ncJson.getBounds()); 

    }

  }).catch(error => console.error('Error fetching data:', error));

// function for making color for coropleth map 
function getColor(total) {
    debugger;
    return total > 1000 ? '#800026' :
           total > 500  ? '#BD0026' :
           total > 200  ? '#E31A1C' :
           total > 100  ? '#FC4E2A' :
           total > 50   ? '#FD8D3C' :
           total > 20   ? '#FEB24C' :
           total > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    debugger;

    // L.geoJSON(geojsonFeatures, {
    //     style: style, 
    // onEachFeature: function (feature) {
    //          total = feature.properties.coordinates;
    //         return {
    //             fillColor: getColor(total),
    //             weight: 2,
    //             opacity: 1,
    //             color: 'white',
    //             dashArray: '3',
    //             fillOpacity: 0.7
    //         };
    //   }
    // }).addTo(map);
    return {
        fillColor: getColor(feature.properties.total),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
    
}

// we will be using this function for the impression of reloading
// function addGeoJSONToMap(geojsonFeatures) {
//     L.geoJSON(geojsonFeatures, {
//       style: style,
//       onEachFeature: function (feature, layer) {
//         const total = feature.properties.total;
//         let tooltipContent = `<strong>${feature.properties.name}</strong><br>
//                               Total: ${total.toLocaleString()}<br>`;
//         layer.bindPopup(tooltipContent);
//       }
//     }).addTo(map);
//   }




function addMedConditionToMap(conditionId, conditionName) {
    debugger;

    fetch('HealthData.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(healthData => processedData.push(healthData));


   L.geoJSON(geojsonFeatures, {
        // style: style, 
        onEachFeature: function (feature, layer) {

          
             var matchingCountyData = processedData.find(data => data.county === feature.properties.HQ_NAME);
             let filteredData = processedData.filter(item => item.health_data[conditionId] === item.county);
             const matchingFeature = feature.properties.HQ_NAME;

            // console.log(feature);
           

            // // this array holds the variety of cancer names so we can check if the condtionId is equal to any of them
             const CancerNames = Object.keys(matchingCountyData.health_data.cancer);
             debugger;

            // this array holds the variety of sti and std names so we can check if the condtionId is equal to any of them
             const stiStdNames = Object.keys(matchingCountyData.health_data.stis_and_stds);

            // Bind popup for click event
           // layer.bindPopup(feature.properties.HQ_NAME);

            // Bind tooltip for hover event
            // layer.bindTooltip(feature.properties.HQ_NAME, {
            //     permanent: false,             // Tooltip is not always visible
            //     direction: 'top',             // Tooltip appears above the feature
            //     className: 'county-tooltip'   // Custom class for styling
            // });
            
   

            if (matchingCountyData && filteredData) {

                let tooltipContent;

            if(CancerNames.includes(conditionId)){
                   tooltipContent = `<strong>${matchingCountyData.county}</strong><br>
                    Population: ${matchingCountyData.population}<br><br>
                    <strong>${conditionName}</strong>
                    <br>Total: ${matchingCountyData.health_data.cancer[conditionId].total}<br>`;
                    layer.bindPopup(tooltipContent);
                    feature.properties.total = matchingCountyData.health_data.cancer[conditionId].total;
                    style(feature);
                    console.log(feature);
                   // const match = feature;
                  //  console.log(match, "We found match!");
                   L.geoJson(countyCoordinates.forEach(data => {[data[0][0], data[0][1]]}), {style: style}).addTo(map);

             }
             else if(stiStdNames.includes(conditionId)){
                    tooltipContent = `<strong>${matchingCountyData.county}</strong><br>
                    Population: ${matchingCountyData.population.toLocaleString()}<br><br>
                    <strong>${conditionName}</strong>
                    <br>Total: ${matchingCountyData.health_data.stis_and_stds[conditionId].total.toLocaleString()}<br>`;
                    layer.bindPopup(tooltipContent);



                }  
             else {
                    tooltipContent = `<strong>${matchingCountyData.county}</strong><br>
                    Population: ${matchingCountyData.population.toLocaleString()}<br><br>
                    <strong>${conditionName}</strong>
                    <br>Total: ${matchingCountyData.health_data[conditionId].total.toLocaleString()}<br>`;
                    layer.bindPopup(tooltipContent);
            }


            // menu.addEventListener('click', function() {
            //     location.reload();
            //   });

           
            
            //     let total = feature.properties.total;

            //    if (matchingCountyData && filteredData) {
            //         total = matchingCountyData.total; // Assuming 'total' is a field in your health data
            //    } else {
            //        feature.properties.total = 0; // Default value if no matching data is found
            //    }
            //    //style(total);
           
                
            }
        }

     }).addTo(map);
            
})
.catch(error => {
    console.error('Error fetching or processing data:', error);
});

}
            