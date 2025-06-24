const { executeQuery } = require('../config/database');

class Location {
  // Get all locations
  static async getAllLocations() {
    const query = `
      SELECT 
        id,
        name,
        code,
        city,
        state,
        country,
        address,
        postal_code,
        latitude,
        longitude,
        timezone,
        facilities,
        operating_hours,
        contact_phone,
        contact_email,
        is_active,
        terminal_type
      FROM locations
      WHERE is_active = 1
      ORDER BY city ASC, name ASC
    `;
    
    const results = await executeQuery(query);
    return results.map(location => ({
      id: location.id,
      name: location.name,
      code: location.code,
      city: location.city,
      state: location.state,
      country: location.country,
      address: location.address,
      postalCode: location.postal_code,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: location.timezone,
      facilities: location.facilities ? JSON.parse(location.facilities) : null,
      operatingHours: location.operating_hours ? JSON.parse(location.operating_hours) : null,
      contactPhone: location.contact_phone,
      contactEmail: location.contact_email,
      isActive: Boolean(location.is_active),
      terminalType: location.terminal_type
    }));
  }

  // Get location by ID
  static async getLocationById(locationId) {
    const query = `
      SELECT 
        id,
        name,
        code,
        city,
        state,
        country,
        address,
        postal_code,
        latitude,
        longitude,
        timezone,
        facilities,
        operating_hours,
        contact_phone,
        contact_email,
        is_active,
        terminal_type
      FROM locations
      WHERE id = ? AND is_active = 1
    `;
    
    const results = await executeQuery(query, [locationId]);
    if (results.length === 0) {
      return null;
    }
    
    const location = results[0];
    return {
      id: location.id,
      name: location.name,
      code: location.code,
      city: location.city,
      state: location.state,
      country: location.country,
      address: location.address,
      postalCode: location.postal_code,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: location.timezone,
      facilities: location.facilities ? JSON.parse(location.facilities) : null,
      operatingHours: location.operating_hours ? JSON.parse(location.operating_hours) : null,
      contactPhone: location.contact_phone,
      contactEmail: location.contact_email,
      isActive: Boolean(location.is_active),
      terminalType: location.terminal_type
    };
  }

  // Create a new location
  static async createLocation(locationData) {
    // Prepare facilities and operating hours as JSON if they are objects
    const facilities = locationData.facilities ? 
      (typeof locationData.facilities === 'string' ? locationData.facilities : JSON.stringify(locationData.facilities)) : 
      null;
      
    const operatingHours = locationData.operatingHours ? 
      (typeof locationData.operatingHours === 'string' ? locationData.operatingHours : JSON.stringify(locationData.operatingHours)) : 
      null;

    const query = `
      INSERT INTO locations (
        name, 
        code, 
        city, 
        state, 
        country, 
        address, 
        postal_code, 
        latitude, 
        longitude, 
        timezone, 
        facilities, 
        operating_hours, 
        contact_phone, 
        contact_email, 
        is_active,
        terminal_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await executeQuery(query, [
      locationData.name,
      locationData.code,
      locationData.city,
      locationData.state,
      locationData.country || 'Malaysia',
      locationData.address,
      locationData.postalCode,
      locationData.latitude,
      locationData.longitude,
      locationData.timezone || 'Asia/Kuala_Lumpur',
      facilities,
      operatingHours,
      locationData.contactPhone,
      locationData.contactEmail,
      locationData.isActive !== undefined ? locationData.isActive : true,
      locationData.terminalType || 'bus_terminal'
    ]);

    // Get the created location by querying back since we use UUID
    const createdLocation = await executeQuery(
      'SELECT * FROM locations WHERE name = ? AND city = ? AND state = ? ORDER BY created_at DESC LIMIT 1',
      [locationData.name, locationData.city, locationData.state]
    );

    if (createdLocation.length > 0) {
      const location = createdLocation[0];
      return {
        id: location.id,
        name: location.name,
        code: location.code,
        city: location.city,
        state: location.state,
        country: location.country,
        address: location.address,
        postalCode: location.postal_code,
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: location.timezone,
        contactPhone: location.contact_phone,
        contactEmail: location.contact_email,
        terminalType: location.terminal_type,
        isActive: Boolean(location.is_active)
      };
    }

    return {
      id: null,
      ...locationData
    };
  }

  // Update an existing location
  static async updateLocation(locationId, locationData) {
    // First check if location exists
    const existingLocation = await this.getLocationById(locationId);
    if (!existingLocation) {
      throw new Error('Location not found');
    }

    // Prepare facilities and operating hours as JSON if they are objects
    if (locationData.facilities && typeof locationData.facilities !== 'string') {
      locationData.facilities = JSON.stringify(locationData.facilities);
    }
    
    if (locationData.operatingHours && typeof locationData.operatingHours !== 'string') {
      locationData.operatingHours = JSON.stringify(locationData.operatingHours);
    }

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];

    // Map camelCase properties to snake_case database fields
    const fieldMapping = {
      name: 'name',
      code: 'code',
      city: 'city',
      state: 'state',
      country: 'country',
      address: 'address',
      postalCode: 'postal_code',
      latitude: 'latitude',
      longitude: 'longitude',
      timezone: 'timezone',
      facilities: 'facilities',
      operatingHours: 'operating_hours',
      contactPhone: 'contact_phone',
      contactEmail: 'contact_email',
      isActive: 'is_active',
      terminalType: 'terminal_type'
    };

    // Build update parts
    for (const [key, value] of Object.entries(locationData)) {
      if (fieldMapping[key]) {
        updateFields.push(`${fieldMapping[key]} = ?`);
        updateValues.push(value);
      }
    }

    if (updateFields.length === 0) {
      return existingLocation; // Nothing to update
    }

    // Add locationId to values array
    updateValues.push(locationId);

    const query = `
      UPDATE locations 
      SET ${updateFields.join(', ')} 
      WHERE id = ?
    `;

    await executeQuery(query, updateValues);
    
    // Return updated location
    return await this.getLocationById(locationId);
  }

  // Delete a location (soft delete by setting is_active to false)
  static async deleteLocation(locationId) {
    // First check if location exists
    const existingLocation = await this.getLocationById(locationId);
    if (!existingLocation) {
      throw new Error('Location not found');
    }

    // Check if location is used in any routes
    const routeCheckQuery = `
      SELECT COUNT(*) as count 
      FROM routes 
      WHERE origin_id = ? OR destination_id = ?
    `;
    
    const routeStopCheckQuery = `
      SELECT COUNT(*) as count 
      FROM route_stops 
      WHERE location_id = ?
    `;

    const routeResults = await executeQuery(routeCheckQuery, [locationId, locationId]);
    const routeStopResults = await executeQuery(routeStopCheckQuery, [locationId]);

    if (routeResults[0].count > 0 || routeStopResults[0].count > 0) {
      throw new Error('Cannot delete location as it is used in routes');
    }

    // Soft delete by setting is_active to false
    const query = `
      UPDATE locations 
      SET is_active = false 
      WHERE id = ?
    `;

    await executeQuery(query, [locationId]);
    return true;
  }
}

module.exports = Location; 