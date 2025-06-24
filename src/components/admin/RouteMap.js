import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { calculateOccupancyRate } from '../../services/routeAnalysisApi';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RouteMap = ({ routes = [], locations = [], selectedTrips = [], startLocation = null, endLocation = null }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const isMountedRef = useRef(true);
  const [routeData, setRouteData] = useState({});
  const [loading, setLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const getLocationCoordinates = (locationId) => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      // Check if location has coordinates directly
      if (location.coordinates) {
        return location.coordinates;
      }
      
      // Check if location has latitude and longitude
      if (location.latitude && location.longitude) {
        return [parseFloat(location.latitude), parseFloat(location.longitude)];
      }
    }
    
    // Default to KL coordinates if location not found or no coordinates
    return [3.1390, 101.6869];
  };

  // Safe map operation wrapper
  const safeMapOperation = useCallback((operation) => {
    if (!isMountedRef.current || !mapInstanceRef.current || !mapReady) {
      return false;
    }
    
    try {
      return operation();
    } catch (error) {
      console.warn('Map operation failed:', error);
      return false;
    }
  }, [mapReady]);

  // Cleanup function for map
  const cleanupMap = useCallback(() => {
    if (mapInstanceRef.current) {
      try {
        // Stop all animations and transitions
        mapInstanceRef.current.stop();
        
        // Remove all layers safely
        mapInstanceRef.current.eachLayer((layer) => {
          try {
            mapInstanceRef.current.removeLayer(layer);
          } catch (e) {
            // Ignore cleanup errors
          }
        });
        
        // Remove map instance
        mapInstanceRef.current.off(); // Remove all event listeners
        mapInstanceRef.current.remove();
      } catch (error) {
        console.warn('Error during map cleanup:', error);
      } finally {
        mapInstanceRef.current = null;
      }
    }
    setMapReady(false);
  }, []);

  // Fetch actual road route using OpenRouteService or OSRM
  const fetchRoadRoute = async (startCoords, endCoords, routeId) => {
    if (!isMountedRef.current) return null;
    
    try {
      // Using OSRM (Open Source Routing Machine) - free and reliable
      const url = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      if (!isMountedRef.current) return null;
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const coordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        const distance = (data.routes[0].distance / 1000).toFixed(1); // Convert to km
        const duration = (data.routes[0].duration / 3600).toFixed(1); // Convert to hours
        
        return {
          coordinates,
          distance: parseFloat(distance),
          duration: parseFloat(duration)
        };
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.warn(`Failed to fetch road route for ${routeId}, falling back to straight line:`, error);
      }
    }
    
    // Fallback to straight line if routing fails
    return {
      coordinates: [startCoords, endCoords],
      distance: null,
      duration: null
    };
  };

  // Fetch road route with intermediate stops
  const fetchRouteWithStops = async (route) => {
    if (!isMountedRef.current) return null;
    
    try {
      setLoading(true);
      
      // Handle both old and new data structures
      const originId = route.originId || route.origin_id;
      const destId = route.destinationId || route.destination_id;
      
      const originCoords = getLocationCoordinates(originId);
      const destCoords = getLocationCoordinates(destId);
      
      // If there are intermediate stops, create waypoints
      if (route.intermediateStops && route.intermediateStops.length > 0) {
        const waypoints = [originCoords];
        
        // Add intermediate stops in order
        route.intermediateStops
          .sort((a, b) => a.stopNumber - b.stopNumber)
          .forEach(stop => {
            const stopLocationId = stop.locationId || stop.location_id;
            waypoints.push(getLocationCoordinates(stopLocationId));
          });
        
        waypoints.push(destCoords);
        
        // Create waypoint string for OSRM
        const waypointString = waypoints
          .map(coord => `${coord[1]},${coord[0]}`)
          .join(';');
        
        const url = `https://router.project-osrm.org/route/v1/driving/${waypointString}?overview=full&geometries=geojson&steps=true`;
        
        const response = await fetch(url);
        if (!isMountedRef.current) return null;
        
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          const coordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
          const distance = (data.routes[0].distance / 1000).toFixed(1);
          const duration = (data.routes[0].duration / 3600).toFixed(1);
          
          return {
            coordinates,
            distance: parseFloat(distance),
            duration: parseFloat(duration),
            waypoints
          };
        }
      } else {
        // Simple route without stops
        return await fetchRoadRoute(originCoords, destCoords, route.id);
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.warn(`Failed to fetch route with stops for ${route.id}:`, error);
        
        // Handle both old and new data structures
        const originId = route.originId || route.origin_id;
        const destId = route.destinationId || route.destination_id;
        
        return await fetchRoadRoute(
          getLocationCoordinates(originId),
          getLocationCoordinates(destId),
          route.id
        );
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
    return null;
  };

  // Initialize map
  useEffect(() => {
    isMountedRef.current = true;
    console.log('RouteMap: Component mounting, initializing map...');
    
    if (!mapRef.current) return;

    // Clean up any existing map instance
    cleanupMap();

    // Add a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      if (!isMountedRef.current || !mapRef.current) return;
      
      try {
        // Initialize map with better settings
        const map = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          touchZoom: true,
          fadeAnimation: false, // Disable animations to prevent position errors
          zoomAnimation: false,
          markerZoomAnimation: false,
        }).setView([4.2105, 101.9758], 7); // Center on Malaysia
        
        if (!isMountedRef.current) {
          map.remove();
          return;
        }
        
        mapInstanceRef.current = map;

        // Add tile layer with better styling
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors | Routing by OSRM',
          maxZoom: 18,
          minZoom: 6,
        }).addTo(map);

        // Wait for map to be fully loaded
        map.whenReady(() => {
          if (isMountedRef.current) {
            console.log('Map is ready and initialized successfully');
            setMapReady(true);
          } else {
            // Component was unmounted, cleanup
            console.log('Component unmounted during map init, cleaning up...');
            try {
              map.remove();
            } catch (e) {
              // Ignore cleanup errors
            }
          }
        });

        // Add error handling for map events
        map.on('error', (error) => {
          console.warn('Map error:', error);
        });

      } catch (error) {
        if (isMountedRef.current) {
          console.error('Error initializing map:', error);
        }
      }
    }, 100);

    return () => {
      console.log('RouteMap: Component unmounting, cleaning up...');
      clearTimeout(timeoutId);
      isMountedRef.current = false;
      cleanupMap();
    };
  }, []); // Only run once on mount

  // Handle route display
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady || !isMountedRef.current) return;

    const map = mapInstanceRef.current;

    // Clear existing layers safely
    safeMapOperation(() => {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.CircleMarker) {
          map.removeLayer(layer);
        }
      });
      return true;
    });

    // Handle single route display (when startLocation and endLocation are provided)
    if (startLocation && endLocation) {
      const displaySingleRoute = async () => {
        if (!isMountedRef.current) return;
        
        try {
          setLoading(true);
          
          const startCoords = getLocationCoordinates(startLocation);
          const endCoords = getLocationCoordinates(endLocation);
          
          const routeInfo = await fetchRoadRoute(startCoords, endCoords, 'single-route');
          
          if (!routeInfo || !isMountedRef.current) return;
          
          // Add markers with error handling
          safeMapOperation(() => {
            const startMarker = L.marker(startCoords, {
              icon: L.divIcon({
                className: 'custom-route-marker',
                html: `<div style="
                  background-color: #3B82F6; 
                  width: 16px; 
                  height: 16px; 
                  border-radius: 50%;
                  border: 2px solid white; 
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                "></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })
            }).bindPopup(`
              <div class="text-sm max-w-xs">
                <strong class="text-base">Start Location</strong><br/>
                <span class="text-gray-600">${locations.find(l => l.id === startLocation)?.city || 'Origin'}</span>
              </div>
            `);

            const endMarker = L.marker(endCoords, {
              icon: L.divIcon({
                className: 'custom-route-marker',
                html: `<div style="
                  background-color: #EF4444; 
                  width: 16px; 
                  height: 16px; 
                  border-radius: 20%;
                  border: 2px solid white; 
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  transform: rotate(45deg);
                "></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })
            }).bindPopup(`
              <div class="text-sm max-w-xs">
                <strong class="text-base">End Location</strong><br/>
                <span class="text-gray-600">${locations.find(l => l.id === endLocation)?.city || 'Destination'}</span>
                ${routeInfo.distance ? `<br/><span class="text-gray-500">Distance: ${routeInfo.distance} km</span>` : ''}
                ${routeInfo.duration ? `<br/><span class="text-gray-500">Duration: ${routeInfo.duration} hours</span>` : ''}
              </div>
            `);

            // Add route line
            const routeLine = L.polyline(routeInfo.coordinates, {
              color: '#3B82F6',
              weight: 4,
              opacity: 0.8,
            });

            // Add to map
            startMarker.addTo(map);
            endMarker.addTo(map);
            routeLine.addTo(map);

            // Fit map to route
            const bounds = L.latLngBounds(routeInfo.coordinates);
            map.fitBounds(bounds, { padding: [30, 30], animate: false });
            
            return true;
          });
          
        } catch (error) {
          if (isMountedRef.current) {
            console.error('Error displaying single route:', error);
          }
        } finally {
          if (isMountedRef.current) {
            setLoading(false);
          }
        }
      };

      displaySingleRoute();
      return;
    }

    // Handle multiple routes display
    if (!routes.length) return;

    const displayMultipleRoutes = async () => {
      if (!isMountedRef.current) return;
      
      try {
        setLoading(true);
        const bounds = L.latLngBounds();
        const routeColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];
        const newRouteData = {};

        // Fetch all routes
        for (let index = 0; index < routes.length; index++) {
          if (!isMountedRef.current) break;
          
          const route = routes[index];
          const color = routeColors[index % routeColors.length];
          
          try {
            // Transform route data to expected format if needed
            const transformedRoute = {
              id: route.id,
              name: route.name,
              originId: route.origin_id,
              destinationId: route.destination_id,
              basePrice: route.base_price,
              distanceKm: route.distance_km || 0,
              durationHours: route.estimated_duration_minutes ? route.estimated_duration_minutes / 60 : 0,
              intermediateStops: []
            };

            const routeInfo = await fetchRouteWithStops(transformedRoute);
            if (!routeInfo || !isMountedRef.current) continue;
            
            newRouteData[route.id] = routeInfo;

            // Get location details
            const originLocation = locations.find(loc => loc.id === route.origin_id);
            const destLocation = locations.find(loc => loc.id === route.destination_id);

            // Create custom icons with route colors
            const createCustomIcon = (isOrigin, size = 'medium') => {
              const sizes = {
                small: { width: 8, height: 8, iconSize: [12, 12] },
                medium: { width: 12, height: 12, iconSize: [16, 16] },
                large: { width: 16, height: 16, iconSize: [20, 20] }
              };
              
              const iconSize = sizes[size];
              const borderRadius = isOrigin ? '50%' : '20%';
              
              return L.divIcon({
                className: 'custom-route-marker',
                html: `<div style="
                  background-color: ${color}; 
                  width: ${iconSize.width}px; 
                  height: ${iconSize.height}px; 
                  border-radius: ${borderRadius};
                  border: 2px solid white; 
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  ${!isOrigin ? 'transform: rotate(45deg);' : ''}
                "></div>`,
                iconSize: iconSize.iconSize,
                iconAnchor: [iconSize.iconSize[0]/2, iconSize.iconSize[1]/2]
              });
            };

            const originCoords = getLocationCoordinates(route.originId);
            const destCoords = getLocationCoordinates(route.destinationId);

            // Add markers and routes safely
            safeMapOperation(() => {
              // Add origin marker
              const originMarker = L.marker(originCoords, { 
                icon: createCustomIcon(true, 'large'),
                zIndexOffset: 1000
              }).bindPopup(`
                <div class="text-sm max-w-xs">
                  <strong class="text-base">${originLocation?.city || 'Origin'}</strong><br/>
                  <span class="text-gray-600">${route.name}</span><br/>
                  <span class="text-gray-500">${originLocation?.address || ''}</span>
                </div>
              `);

              // Add destination marker
              const destMarker = L.marker(destCoords, { 
                icon: createCustomIcon(false, 'large'),
                zIndexOffset: 1000
              }).bindPopup(`
                <div class="text-sm max-w-xs">
                  <strong class="text-base">${destLocation?.city || 'Destination'}</strong><br/>
                  <span class="text-gray-600">${route.name}</span><br/>
                  <span class="text-gray-500">Distance: ${routeInfo.distance || route.distance_km || 'N/A'} km</span><br/>
                  <span class="text-gray-500">Duration: ${routeInfo.duration ? routeInfo.duration + ' hours' : route.estimated_duration_minutes ? (route.estimated_duration_minutes / 60).toFixed(1) + ' hours' : 'N/A'}</span><br/>
                  <span class="text-gray-500">Price: RM ${route.base_price || 'N/A'}</span><br/>
                  <span class="text-gray-500">${destLocation?.address || ''}</span>
                </div>
              `);

              // Add intermediate stop markers
              route.intermediateStops?.forEach((stop) => {
                if (!isMountedRef.current) return;
                
                try {
                  const stopLocation = locations.find(loc => loc.id === stop.locationId);
                  const stopCoords = getLocationCoordinates(stop.locationId);
                  
                  const stopMarker = L.marker(stopCoords, { 
                    icon: createCustomIcon(true, 'small'),
                    zIndexOffset: 500
                  }).bindPopup(`
                    <div class="text-sm max-w-xs">
                      <strong>${stopLocation?.city || 'Stop'}</strong><br/>
                      <span class="text-gray-600">Stop ${stop.stopNumber}</span><br/>
                      <span class="text-gray-500">+RM ${stop.additionalPrice}</span><br/>
                      <span class="text-gray-500">${Math.floor(stop.arrivalOffset/60)}h ${stop.arrivalOffset%60}m from origin</span>
                    </div>
                  `);

                  stopMarker.addTo(map);
                  bounds.extend(stopCoords);
                } catch (stopError) {
                  console.warn('Error adding stop marker:', stopError);
                }
              });

              // Add route line using real road coordinates
              const routeLine = L.polyline(routeInfo.coordinates, {
                color: color,
                weight: 4,
                opacity: 0.8,
                dashArray: route.frequency === 'weekend' ? '10, 5' : null
              });

              // Add hover effects
              routeLine.on('mouseover', function() {
                if (isMountedRef.current) {
                  this.setStyle({ weight: 6, opacity: 1.0 });
                }
              });
              
              routeLine.on('mouseout', function() {
                if (isMountedRef.current) {
                  this.setStyle({ weight: 4, opacity: 0.8 });
                }
              });

              // Add to map
              originMarker.addTo(map);
              destMarker.addTo(map);
              routeLine.addTo(map);

              // Add to bounds
              routeInfo.coordinates.forEach(point => bounds.extend(point));
              
              return true;
            });
          } catch (routeError) {
            console.warn(`Error processing route ${route.id}:`, routeError);
          }
        }

        if (isMountedRef.current) {
          setRouteData(newRouteData);

          // Fit map to show all routes with padding
          safeMapOperation(() => {
            if (bounds.isValid()) {
              map.fitBounds(bounds, { 
                padding: [30, 30],
                maxZoom: 12,
                animate: false
              });
            }
            return true;
          });
        }
      } catch (error) {
        if (isMountedRef.current) {
          console.error('Error displaying multiple routes:', error);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    displayMultipleRoutes();

  }, [routes, locations, startLocation, endLocation, mapReady, safeMapOperation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanupMap();
    };
  }, [cleanupMap]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full rounded-lg" style={{ zIndex: 1 }} />
      
      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-lg" style={{ zIndex: 1001 }}>
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Loading road routes...</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Enhanced Legend with Trip Occupation */}
      {routes.length > 0 && !startLocation && !endLocation && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 max-w-xs" style={{ zIndex: 1000 }}>
          <div className="p-4">
            <h4 className="font-semibold text-sm mb-3 text-gray-800">Active Routes</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {routes.slice(0, 7).map((route, index) => {
                const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];
                const color = colors[index % colors.length];
                
                // Calculate average occupation for this route
                const routeTrips = selectedTrips.filter(trip => trip.routeId === route.id);
                const avgOccupation = routeTrips.length > 0 
                  ? routeTrips.reduce((sum, trip) => sum + calculateOccupancyRate(trip), 0) / routeTrips.length
                  : 0;
                
                const routeInfo = routeData[route.id];
                
                return (
                  <div key={route.id} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center flex-1 min-w-0">
                      <div 
                        className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                        style={{ backgroundColor: color }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-gray-700">{route.name}</div>
                        {routeInfo && (
                          <div className="text-xs text-gray-500">
                            {routeInfo.distance || route.distance_km || 'N/A'} km • {routeInfo.duration || (route.estimated_duration_minutes ? (route.estimated_duration_minutes / 60).toFixed(1) : 'N/A')}h
                          </div>
                        )}
                      </div>
                    </div>
                    {avgOccupation > 0 && (
                      <div className="ml-2 flex items-center">
                        <div className="w-8 bg-gray-200 rounded-full h-1.5 mr-1">
                          <div 
                            className="h-1.5 rounded-full transition-all"
                            style={{ 
                              width: `${Math.min(avgOccupation, 100)}%`,
                              backgroundColor: avgOccupation > 80 ? '#EF4444' : avgOccupation > 60 ? '#F59E0B' : '#10B981'
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 font-medium">
                          {avgOccupation.toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Legend explanation */}
            <div className="mt-3 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>● Origin</span>
                <span>◆ Destination</span>
                <span>Real Roads</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200" style={{ zIndex: 1000 }}>
        <div className="p-3">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span>Regular Service</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-gray-400 mr-2" style={{borderTop: '2px dashed'}}></div>
              <span>Weekend Only</span>
            </div>
            <div className="mt-2 pt-1 border-t border-gray-200">
              <div className="text-xs text-gray-500">🛣️ Real road routes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {routes.length === 0 && !startLocation && !endLocation && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center text-gray-500">
            <div className="mb-2">🗺️</div>
            <p className="text-sm font-medium">No routes to display</p>
            <p className="text-xs">Select routes to view on map</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteMap; 