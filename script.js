
          // starting to parse county data 
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
        var geojsonFeatures = [];

       
        if (data.results) {
            data.results.forEach(record => {
                // Extract latitude and longitude as strings from the API response
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

                    // this maps out the shape of the counties onto the map
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


            // Show this tp rahul to portray where we wan the data to show
            L.geoJSON(geojsonFeatures, {
                onEachFeature: function (feature, layer) {
                    // Bind popup for click event
                    layer.bindPopup(feature.properties.HQ_NAME);
            
                    // Bind tooltip for hover event
                    layer.bindTooltip(feature.properties.HQ_NAME, {
                        permanent: false,             // Tooltip is not always visible
                        direction: 'top',             // Tooltip appears above the feature
                        className: 'county-tooltip'   // Custom class for styling
                    });
            
                    // Show tooltip on hover
                    layer.on('mouseover', function () {
                        this.openTooltip();
                    });
            
                    // Hide tooltip on mouseout
                    layer.on('mouseout', function () {
                        this.closeTooltip();
                    });
                }
            }).addTo(map); 
    

           // adding the HC-Data to an array that we will use 
            const processedData = [];
            for (let i = 0; i < hcData.length; i++) {
                const countyData = hcData[i];
                processedData.push(countyData);
              }
            
            

            // adding hovering effect with county names 
            // L.geoJSON(geojsonFeatures, {
            //     onEachFeature: function (feature,layer){
                 
            //  //  County name from API parsed data "Opensoft data"
            //       const countyName = features.properties.HQ_NAME;
            //   //  county name from health care data json
            //       const hcCounty = processedData.find(data => data.county === countyName)

            //   //  Bind popup for click event
            //    layer.bindPopup(feature.properties.HQ_NAME);

            //    //  Bind tooltip for hover event
            //     layer.bindTooltip(feature.properties.HQ_NAME, {
            //             permanent: false,             // Tooltip is not always visible
            //             direction: 'top',             // Tooltip appears above the feature
            //             className: 'county-tooltip'   // Custom class for styling
            //         });
                    
            //      if(hcCounty){
            //         let tooltipContent = `<strong>${healthcareData.county}</strong><br>
            //           Population: ${hcCounty.population}<br><br>
            //           <strong>Heart Attacks:</strong><br>
            //           Black: ${hcCounty.health_data.heart_attacks.black}<br>`;

            //        layer.bindTooltip(tooltipContent);
            //       } else {
            //             console.log("Names do not match");
            //       }
            //     }
            //   }).addTo(map)

                    
        

            // L.geoJSON(NCjson).addTo(map);
           
            //map.fitBounds(ncJson.getBounds());

        //  console.log(JSON.stringify(geojsonFeatures, null, 2)); // Log the transformed data


       

    }

  }).catch(error => console.error('Error fetching data:', error));
    