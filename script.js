
    // gobal array where features that are transofrmed to json in order to map counties will be held
        let geojsonFeatures = [];
         
    // global array adding the HealthData to an array that we will use 
        let processedData = [];

    // assigning out coordinates for county shape mapping 
        let countyCoordinates = [];

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
                            "total": 0 // added this section for total 6/26/24 as it could be needed for the chorpleth section
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
    return total > 1000 ? '#800026' :
           total > 500  ? '#BD0026' :
           total > 200  ? '#E31A1C' :
           total > 100  ? '#FC4E2A' :
           total > 50   ? '#FD8D3C' :
           total > 20   ? '#FEB24C' :
           total > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(total) {

    L.geoJSON(geojsonFeatures, {
        style: style, 
    onEachFeature: function (feature) {
             total = feature.properties.total;
            return {
                fillColor: getColor(total),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
      }
    }).addTo(map);
    
}




function addMedConditionToMap(conditionId, conditionName) {

    fetch('HealthData.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(healthData => processedData.push(healthData));

        
        // L.geoJSON(geojsonFeatures, {
        //     style: style, 
        //     onEachFeature: function (feature, layer) {
        //         const matchingCountyData = processedData.find(data => data.county === feature.properties.HQ_NAME);
        //         console.log('Feature:', feature);
        //         console.log('Matching County Data:', matchingCountyData);
        
        //         if (!matchingCountyData) {
        //             console.error(`No matching data found for county: ${feature.properties.HQ_NAME}`);
        //             return;
        //         }
        
        //         if (!matchingCountyData.health_data || !matchingCountyData.health_data.stis_and_stds) {
        //             console.error(`No health data or STI/STD data found for county: ${feature.properties.HQ_NAME}`);
        //             return;
        //         }
        
        //         if (!matchingCountyData.health_data.stis_and_stds.hasOwnProperty(conditionId)) {
        //             console.error(`No STI/STD data found for condition: ${conditionId} in county: ${feature.properties.HQ_NAME}`);
        //             return;
        //         }
        
        //         const total = matchingCountyData.health_data.stis_and_stds[conditionId].total;
        
        //         if (total === undefined) {
        //             console.error(`Total value is undefined for condition: ${conditionId} in county: ${feature.properties.HQ_NAME}`);
        //             return;
        //         }
        
        //         let tooltipContent = `<strong>${matchingCountyData.county}</strong><br>
        //             Population: ${matchingCountyData.population.toLocaleString()}<br><br>
        //             <strong>${conditionName}</strong><br>
        //             Total: ${total.toLocaleString()}<br>`;
                
        //         layer.bindPopup(tooltipContent);
        //     }
      
        
       
        

        // to string for condiditonID since it is in '' for html when bieng inoutted in function
            //conditionIdToStr = conditionId.toString();
           // console.log(countyCoordinates);

            

   L.geoJSON(geojsonFeatures, {
        style: style, 
        onEachFeature: function (feature, layer) {

             var matchingCountyData = processedData.find(data => data.county === feature.properties.HQ_NAME);
             let filteredData = processedData.filter(item => item.health_data[conditionId] === item.county);

            // // this array holds the variety of cancer names so we can check if the condtionId is equal to any of them
             const CancerNames = Object.keys(matchingCountyData.health_data.cancer)

            // this array holds the variety of sti and std names so we can check if the condtionId is equal to any of them
             const stiStdNames = Object.keys(matchingCountyData.health_data.stis_and_stds);

            // console.log(stiStdNames)
            // Bind popup for click event
            layer.bindPopup(feature.properties.HQ_NAME);

            // Bind tooltip for hover event
            layer.bindTooltip(feature.properties.HQ_NAME, {
                permanent: false,             // Tooltip is not always visible
                direction: 'top',             // Tooltip appears above the feature
                className: 'county-tooltip'   // Custom class for styling
            });

            if (matchingCountyData && filteredData) {

                let tooltipContent;

            if(CancerNames.includes(conditionId)){
                   tooltipContent = `<strong>${matchingCountyData.county}</strong><br>
                    Population: ${matchingCountyData.population}<br><br>
                    <strong>${conditionName}</strong>
                    <br>Total: ${matchingCountyData.health_data.cancer[conditionId].total}<br>`;
                    layer.bindPopup(tooltipContent);
             }
             else if(stiStdNames.includes(conditionId)){
                    // console.log("STI/STD Condition found: ", conditionId);
                    // console.log("Matching County Data: ", matchingCountyData);
                    // console.log("Health Data: ", matchingCountyData.health_data);
                    // console.log("STIs and STDs Data: ", matchingCountyData.health_data.stis_and_stds);
                    // console.log("Condition Data: ", matchingCountyData.health_data.stis_and_stds[conditionId]);

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

            //  menu.addEventListener('click', function() {
            //     location.reload();
            //   });
           
            
            //     let total = feature.properties.total;

            //    if (matchingCountyData && filteredData) {
            //         total = matchingCountyData.total; // Assuming 'total' is a field in your health data
            //    } else {
            //        feature.properties.total = 0; // Default value if no matching data is found
            //    }
            //    //style(total);
           

                // if(StiStdNames.includes(conditionId)){
                //     console.log("STI/STD Condition found: ", conditionId);
                //     console.log("Matching County Data: ", matchingCountyData);
                //     console.log("Health Data: ", matchingCountyData.health_data);
                //     console.log("STIs and STDs Data: ", matchingCountyData.health_data.stis_and_stds);
                //     console.log("Condition Data: ", matchingCountyData.health_data.stis_and_stds[conditionId]);

                //     tooltipContent = `<strong>${matchingCountyData.county}</strong><br>
                //     Population: ${matchingCountyData.population}<br><br>
                //     <strong>${conditionName}</strong>
                //     <br>Total: ${matchingCountyData.health_data.stis_and_stds[conditionId].total}<br>`;
                //     layer.bindPopup(tooltipContent);

                
                // }  
                // if (StiStdNames.includes(conditionId)) {
                //    // console.log("STI/STD Condition found: ", conditionId);
                //     console.log("Matching County Data: ", matchingCountyData);
                //   //g("STIs and STDs Data: ", matchingCountyData.health_data.stis_and_stds);
                //     console.log("Condition Data: ", matchingCountyData.health_data.stis_and_stds[conditionId]);
                
                //     // Check if matchingCountyData and its nested properties exist and are not null
                //     if (matchingCountyData && matchingCountyData.health_data && matchingCountyData.health_data.stis_and_stds && matchingCountyData.health_data.stis_and_stds[conditionId]) {
                //         let conditionData = matchingCountyData.health_data.stis_and_stds[conditionId];
                        
                //         if (conditionData.total !== null) {
                //             tooltipContent = `<strong>${matchingCountyData.county}</strong><br>
                //                 Population: ${matchingCountyData.population}<br><br>
                //                 <strong>${conditionName}</strong>
                //                 <br>Total: ${conditionData.total}<br>`;
                //             //layer.bindPopup(tooltipContent);
                //         } else {
                //             console.log(`Total data for condition ${matchingCountyData.county} is null`);
                //         }
                //     } 
                
                
                
            }
        }

     }).addTo(map);
            
})
.catch(error => {
    console.error('Error fetching or processing data:', error);
});

}
            