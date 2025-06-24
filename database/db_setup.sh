#!/bin/bash

# ========================================
# TWT Transport Booking System - Database Setup Script
# ========================================

# Text colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default settings
DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="TWT_Transport_System"
DB_USER="root"
DB_PASS=""

# Display help function
show_help() {
    echo -e "${GREEN}TWT Transport Booking System - Database Setup Script${NC}"
    echo
    echo -e "Usage: $0 [options]"
    echo
    echo -e "Options:"
    echo -e "  -h, --host HOST       MySQL host (default: localhost)"
    echo -e "  -P, --port PORT       MySQL port (default: 3306)"
    echo -e "  -u, --user USER       MySQL username (default: root)"
    echo -e "  -p, --password PASS   MySQL password"
    echo -e "  -d, --database NAME   Database name (default: TWT_Transport_System)"
    echo -e "  --schema-only         Only apply the schema, skip data import"
    echo -e "  --data-only           Only import data, skip schema creation"
    echo -e "  --verify              Verify database integrity after setup"
    echo -e "  --help                Display this help message"
    echo
    exit 0
}

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}TWT Transport Booking System - Database Setup${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if MySQL client is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}MySQL client not found. Please install MySQL client first.${NC}"
    exit 1
fi

# Flags for schema and data import
APPLY_SCHEMA=true
IMPORT_DATA=true
VERIFY_DB=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -h|--host)
            DB_HOST="$2"
            shift 2
            ;;
        -P|--port)
            DB_PORT="$2"
            shift 2
            ;;
        -u|--user)
            DB_USER="$2"
            shift 2
            ;;
        -p|--password)
            DB_PASS="$2"
            shift 2
            ;;
        -d|--database)
            DB_NAME="$2"
            shift 2
            ;;
        --schema-only)
            IMPORT_DATA=false
            shift
            ;;
        --data-only)
            APPLY_SCHEMA=false
            shift
            ;;
        --verify)
            VERIFY_DB=true
            shift
            ;;
        --help)
            show_help
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo -e "Use --help for usage information."
            exit 1
            ;;
    esac
done

# Prompt for password if not provided
if [ -z "$DB_PASS" ]; then
    read -sp "Enter MySQL password for user $DB_USER: " DB_PASS
    echo ""
fi

# Function to execute MySQL commands
run_mysql_command() {
    if [ -z "$DB_PASS" ]; then
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$@"
    else
        mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$@"
    fi
}

# Create database if it doesn't exist
echo -e "${YELLOW}Creating database if it doesn't exist...${NC}"
run_mysql_command -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to create database. Please check your credentials and try again.${NC}"
    exit 1
fi

# Disable foreign key checks to prevent constraint errors
echo -e "${YELLOW}Disabling foreign key checks...${NC}"
run_mysql_command "$DB_NAME" -e "SET FOREIGN_KEY_CHECKS = 0;"

# Apply schema if requested
if [ "$APPLY_SCHEMA" = true ]; then
    echo -e "${YELLOW}Applying database schema...${NC}"
    run_mysql_command "$DB_NAME" < schema.sql

    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to apply schema. Please check the schema.sql file and try again.${NC}"
        exit 1
    fi
fi

# Import data if requested
if [ "$IMPORT_DATA" = true ]; then
    echo -e "${YELLOW}Importing table data...${NC}"
    
    # Array of table files in the correct order for foreign key constraints
    TABLE_FILES=(
        "users.sql"
        "locations.sql"
        "vehicle_types.sql"
        "vehicles.sql"
        "routes.sql"
        "route_stops.sql"
        "seat_types.sql"
        "schedules.sql"
        "trips.sql"
        "trip_seats.sql"
        "bookings.sql"
        "payments.sql"
    )
    
    # Import each table file in order
    for TABLE_FILE in "${TABLE_FILES[@]}"; do
        if [ -f "$TABLE_FILE" ]; then
            echo -e "${YELLOW}Importing $TABLE_FILE...${NC}"
            
            # Handle phpMyAdmin exports by removing any CREATE TABLE statements
            # This prevents conflicts with the schema we already applied
            echo -e "${YELLOW}Processing $TABLE_FILE to ensure compatibility...${NC}"
            TMP_FILE=$(mktemp)
            cat "$TABLE_FILE" | grep -v "CREATE TABLE" | grep -v "DROP TABLE" > "$TMP_FILE"
            
            run_mysql_command "$DB_NAME" < "$TMP_FILE"
            IMPORT_RESULT=$?
            
            rm "$TMP_FILE"
            
            if [ $IMPORT_RESULT -ne 0 ]; then
                echo -e "${RED}Failed to import $TABLE_FILE. Please check the file and try again.${NC}"
                exit 1
            fi
        else
            echo -e "${YELLOW}Warning: $TABLE_FILE not found, skipping...${NC}"
        fi
    done
fi

# Re-enable foreign key checks
echo -e "${YELLOW}Re-enabling foreign key checks...${NC}"
run_mysql_command "$DB_NAME" -e "SET FOREIGN_KEY_CHECKS = 1;"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Database setup completed successfully!${NC}"
echo -e "${GREEN}Database: $DB_NAME${NC}"
echo -e "${GREEN}========================================${NC}"

# Show tables
echo -e "${YELLOW}Database tables:${NC}"
run_mysql_command -e "USE \`$DB_NAME\`; SHOW TABLES;"

# Count records in each table
echo -e "${YELLOW}Record counts:${NC}"
for TABLE in $(run_mysql_command -N -e "USE \`$DB_NAME\`; SHOW TABLES;"); do
    COUNT=$(run_mysql_command -N -e "USE \`$DB_NAME\`; SELECT COUNT(*) FROM \`$TABLE\`;")
    echo -e "${GREEN}$TABLE:${NC} $COUNT records"
done

# Verify database integrity if requested
if [ "$VERIFY_DB" = true ]; then
    echo -e "${YELLOW}Verifying database integrity...${NC}"
    
    # Check for missing foreign keys
    echo -e "${YELLOW}Checking foreign key relationships...${NC}"
    
    # Check trips table foreign keys
    echo -e "${YELLOW}Checking trips table...${NC}"
    ORPHANED_TRIPS=$(run_mysql_command -N -e "
        USE \`$DB_NAME\`;
        SELECT COUNT(*) FROM trips t 
        LEFT JOIN routes r ON t.route_id = r.id 
        WHERE r.id IS NULL AND t.route_id IS NOT NULL;
    ")
    
    if [ "$ORPHANED_TRIPS" -gt 0 ]; then
        echo -e "${RED}Warning: Found $ORPHANED_TRIPS trips with invalid route_id references${NC}"
    else
        echo -e "${GREEN}Trips table foreign keys are valid${NC}"
    fi
    
    # Check vehicles foreign keys
    echo -e "${YELLOW}Checking vehicles table...${NC}"
    ORPHANED_VEHICLES=$(run_mysql_command -N -e "
        USE \`$DB_NAME\`;
        SELECT COUNT(*) FROM vehicles v
        LEFT JOIN vehicle_types vt ON v.vehicle_type_id = vt.id
        WHERE vt.id IS NULL AND v.vehicle_type_id IS NOT NULL;
    ")
    
    if [ "$ORPHANED_VEHICLES" -gt 0 ]; then
        echo -e "${RED}Warning: Found $ORPHANED_VEHICLES vehicles with invalid vehicle_type_id references${NC}"
    else
        echo -e "${GREEN}Vehicles table foreign keys are valid${NC}"
    fi
    
    # Check routes foreign keys
    echo -e "${YELLOW}Checking routes table...${NC}"
    ORPHANED_ROUTES=$(run_mysql_command -N -e "
        USE \`$DB_NAME\`;
        SELECT COUNT(*) FROM routes r
        LEFT JOIN locations origin ON r.origin_id = origin.id
        LEFT JOIN locations dest ON r.destination_id = dest.id
        WHERE (origin.id IS NULL AND r.origin_id IS NOT NULL) OR
              (dest.id IS NULL AND r.destination_id IS NOT NULL);
    ")
    
    if [ "$ORPHANED_ROUTES" -gt 0 ]; then
        echo -e "${RED}Warning: Found $ORPHANED_ROUTES routes with invalid location references${NC}"
    else
        echo -e "${GREEN}Routes table foreign keys are valid${NC}"
    fi
fi

echo -e "${GREEN}Setup complete! The TWT Transport Booking System database is ready.${NC}"
exit 0 