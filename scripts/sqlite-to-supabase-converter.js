#!/usr/bin/env node

/**
 * SQLite to Supabase Data Converter
 *
 * This script extracts all data from the SQLite database and converts it
 * to PostgreSQL-compatible INSERT statements for Supabase.
 */

import Database from "better-sqlite3";
import fs from "fs";

// Configuration
const SQLITE_DB_PATH = "../university_catalog.db";
const OUTPUT_FILE = "../supabase/seed.sql";
const BACKUP_FILE = "../supabase/seed_backup.sql";

// Table mapping: SQLite table name -> Supabase table name
const TABLE_MAPPING = {
  Schools: "schools",
  DeptsAndPrograms: "departments_and_programs",
  Majors: "majors",
  Emphases: "emphasis_areas_enhanced",
  Courses: "courses",
  CoreCurriculumRequirements: "core_curriculum_requirements",
  CoreCurriculumPathways: "core_curriculum_pathways",
};

// Column mapping for data transformation
const COLUMN_MAPPINGS = {
  schools: {
    name: "name",
    description: "description",
    courseRequirementsExpression: "course_requirements_expression",
    unitRequirements: "unit_requirements",
    otherRequirements: "other_requirements",
    src: "src",
  },
  departments_and_programs: {
    name: "name",
    description: "description",
    majors: "majors_offered",
    minors: "minors_offered",
    emphases: "emphases",
    school: "school_name",
    src: "src",
  },
  majors: {
    name: "name",
    description: "description",
    deptCode: "department_code",
    requiresEmphasis: "requires_emphasis",
    courseRequirementsExpression: "course_requirements_expression",
    unitRequirements: "unit_requirements",
    otherRequirements: "other_requirements",
    otherNotes: "other_notes",
    src: "src",
  },
  emphasis_areas_enhanced: {
    name: "name",
    description: "description",
    appliesTo: "applies_to",
    nameOfWhichItAppliesTo: "name_of_which_it_applies_to",
    deptCode: "department_code",
    courseRequirementsExpression: "course_requirements_expression",
    unitRequirements: "unit_requirements",
    otherRequirements: "other_requirements",
    otherNotes: "other_notes",
    src: "src",
  },
  courses: {
    courseCode: "code",
    name: "title",
    description: "description",
    numUnits: "units",
    prerequisiteCourses: "prerequisites",
    corequisiteCourses: "corequisites",
    offeringSchedule: "quarters_offered",
    historicalBestProfessors: "professor",
    src: "src",
  },
  core_curriculum_requirements: {
    name: "name",
    description: "description",
    appliesTo: "applies_to",
    fulfilledBy: "fulfilled_by",
    src: "src",
  },
  core_curriculum_pathways: {
    name: "name",
    description: "description",
    associatedCourses: "associated_courses",
    src: "src",
  },
};

// Validation rules for data integrity
const VALIDATION_RULES = {
  courses: {
    code: (value) => /^[A-Z]{2,5}\s*\d+[A-Z]{0,2}$/.test(value),
    units: (value) =>
      value === null ||
      /^(\d+(\.\d+)?|\d+-\d+|\d+(\.\d+)?-\d+(\.\d+)?)$/.test(value),
    title: (value) => value && value.length > 0,
  },
  plans: {
    name: (value) => value && value.length > 0,
    graduation_year: (value) =>
      value === null || (value >= 2020 && value <= 2050),
  },
  planned_courses: {
    course_code: (value) => /^[A-Z]{2,5}\s*\d+[A-Z]{0,2}$/.test(value),
    units: (value) =>
      value === null ||
      /^(\d+(\.\d+)?|\d+-\d+|\d+(\.\d+)?-\d+(\.\d+)?)$/.test(value),
    year: (value) => value >= 2020 && value <= 2050,
  },
};

class SQLiteToSupabaseConverter {
  constructor() {
    this.db = null;
    this.outputSQL = "";
    this.stats = {
      totalTables: 0,
      totalRows: 0,
      errors: [],
      warnings: [],
      unitsConversions: {
        naToZero: 0,
        variableToRange: 0,
      },
    };
  }

  async initialize() {
    try {
      console.log("🔗 Connecting to SQLite database...");

      // Check if source database exists
      if (!fs.existsSync(SQLITE_DB_PATH)) {
        throw new Error(`SQLite database not found at: ${SQLITE_DB_PATH}`);
      }

      this.db = new Database(SQLITE_DB_PATH, { readonly: true });
      console.log("✅ Successfully connected to SQLite database");

      // Create backup of existing seed file if it exists
      if (fs.existsSync(OUTPUT_FILE)) {
        console.log("📁 Creating backup of existing seed file...");
        fs.copyFileSync(OUTPUT_FILE, BACKUP_FILE);
        console.log(`✅ Backup created: ${BACKUP_FILE}`);
      }

      return true;
    } catch (error) {
      console.error("❌ Failed to initialize:", error.message);
      this.stats.errors.push(`Initialization failed: ${error.message}`);
      return false;
    }
  }

  validateTableExists(tableName) {
    try {
      const result = this.db
        .prepare(
          `
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name=?
      `
        )
        .get(tableName);

      return !!result;
    } catch (error) {
      console.warn(`⚠️ Error checking table ${tableName}: ${error.message}`);
      return false;
    }
  }

  validateRowData(tableName, row) {
    const rules = VALIDATION_RULES[tableName];
    if (!rules) return { valid: true, errors: [] };

    const errors = [];
    for (const [field, validator] of Object.entries(rules)) {
      if (row.hasOwnProperty(field) && !validator(row[field])) {
        errors.push(`Invalid ${field}: ${row[field]}`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  convertTable(tableName) {
    const supabaseTableName = TABLE_MAPPING[tableName];

    if (!supabaseTableName) {
      console.warn(`⚠️ No mapping found for table: ${tableName}`);
      this.stats.warnings.push(`No mapping for table: ${tableName}`);
      return "";
    }

    console.log(`📊 Converting table: ${tableName} -> ${supabaseTableName}`);

    try {
      // Validate table exists
      if (!this.validateTableExists(tableName)) {
        console.warn(`⚠️ Table ${tableName} does not exist in SQLite database`);
        this.stats.warnings.push(`Table ${tableName} not found`);
        return "";
      }

      // Get row count for validation
      const countResult = this.db
        .prepare(`SELECT COUNT(*) as count FROM ${tableName}`)
        .get();
      const expectedRowCount = countResult.count;
      console.log(`   📈 Expected rows: ${expectedRowCount}`);

      if (expectedRowCount === 0) {
        console.log(`   ⚠️ Table ${tableName} is empty, skipping...`);
        return "";
      }

      // Get all rows
      const rows = this.db.prepare(`SELECT * FROM ${tableName}`).all();

      // Verify row count matches
      if (rows.length !== expectedRowCount) {
        throw new Error(
          `Row count mismatch! Expected: ${expectedRowCount}, Got: ${rows.length}`
        );
      }

      console.log(`   ✅ Retrieved ${rows.length} rows successfully`);

      if (rows.length === 0) {
        return "";
      }

      // Convert rows with validation
      const columnMapping = COLUMN_MAPPINGS[supabaseTableName] || {};
      const convertedRows = [];
      let validationErrors = 0;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const convertedRow = this.convertRowData(row, columnMapping);

        // Validate converted row
        const validation = this.validateRowData(
          supabaseTableName,
          convertedRow
        );
        if (!validation.valid) {
          console.warn(
            `   ⚠️ Row ${convertedRow.code} validation failed:`,
            validation.errors
          );
          this.stats.warnings.push(
            `${tableName} row ${convertedRow.code || i + 1}: ${validation.errors.join(", ")}`
          );
          validationErrors++;
        }

        convertedRows.push(convertedRow);
      }

      if (validationErrors > 0) {
        console.warn(`   ⚠️ ${validationErrors} rows had validation warnings`);
      }

      // Generate SQL
      const sql = this.generateInsertSQL(supabaseTableName, convertedRows);

      this.stats.totalTables++;
      this.stats.totalRows += rows.length;

      console.log(`   ✅ Successfully converted ${rows.length} rows`);

      return sql;
    } catch (error) {
      console.error(`❌ Error converting table ${tableName}:`, error.message);
      this.stats.errors.push(`Table ${tableName}: ${error.message}`);
      return "";
    }
  }

  convertRowData(row, columnMapping) {
    const converted = {};

    for (const [originalCol, newCol] of Object.entries(columnMapping)) {
      if (row.hasOwnProperty(originalCol)) {
        let value = row[originalCol];

        // Handle special data type conversions
        if (this.shouldConvertToJSON(newCol, value)) {
          value = this.convertToJSON(newCol, value);
        } else if (newCol === "units") {
          value = this.convertUnits(value, row);
        }

        converted[newCol] = value;
      }
    }

    return converted;
  }

  convertUnits(value, row) {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    // Convert to string and clean up
    const stringValue = String(value).trim();

    // Handle special cases first
    const lowerValue = stringValue.toLowerCase();

    // Handle N/A variations (N/A, n/a, NA, na, not applicable, etc.)
    if (
      lowerValue === "n/a" ||
      lowerValue === "na" ||
      lowerValue === "not applicable" ||
      lowerValue === "none"
    ) {
      console.log(
        `📝 Converting units '${stringValue}' → '0' for course: ${row.code || row.courseCode || "unknown"}`
      );
      this.stats.unitsConversions.naToZero++;
      return "0";
    }

    // Handle Variable variations (Variable, variable, varies, var, etc.)
    if (
      lowerValue === "variable" ||
      lowerValue === "varies" ||
      lowerValue === "var" ||
      lowerValue === "variable units"
    ) {
      console.log(
        `📝 Converting units '${stringValue}' → '2-5' for course: ${row.code || row.courseCode || "unknown"}`
      );
      this.stats.unitsConversions.variableToRange++;
      return "2-5";
    }

    // If it's already in a valid format, return as-is
    if (/^(\d+(\.\d+)?|\d+-\d+|\d+(\.\d+)?-\d+(\.\d+)?)$/.test(stringValue)) {
      return stringValue;
    }

    // Handle numeric values - convert to string
    const numericValue = parseFloat(stringValue);
    if (!isNaN(numericValue)) {
      // Format cleanly (remove unnecessary decimals)
      return numericValue % 1 === 0
        ? String(Math.floor(numericValue))
        : String(numericValue);
    }

    // Handle range formats that might have spaces or other characters
    const rangeMatch = stringValue.match(
      /(\d+(?:\.\d+)?)\s*[-–—]\s*(\d+(?:\.\d+)?)/
    );
    if (rangeMatch) {
      const min = parseFloat(rangeMatch[1]);
      const max = parseFloat(rangeMatch[2]);
      const minStr = min % 1 === 0 ? String(Math.floor(min)) : String(min);
      const maxStr = max % 1 === 0 ? String(Math.floor(max)) : String(max);
      return `${minStr}-${maxStr}`;
    }

    // If we can't parse it, log a warning and return null
    console.warn(
      `⚠️ Could not parse units value: "${value}" for course ${JSON.stringify(row)}`
    );
    return null;
  }

  shouldConvertToJSON(columnName, value) {
    const jsonbColumns = [
      "prerequisites",
      "corequisites",
      "quarters_offered",
      "unit_requirements",
      "other_requirements",
      "majors_offered",
      "minors_offered",
      "emphases",
    ];

    return jsonbColumns.includes(columnName) && value !== null;
  }

  convertToJSON(columnName, value) {
    try {
      // For prerequisites and corequisites, convert text to structured format
      if (columnName === "prerequisites" || columnName === "corequisites") {
        if (typeof value === "string" && value.trim()) {
          // Parse course codes from text
          const courseCodeRegex = /\b[A-Z]{2,5}\s*\d+[A-Z]{0,2}\b/g;
          const courses = value.match(courseCodeRegex) || [];

          return JSON.stringify([
            {
              type: "required",
              courses: courses.map((code) => code.replace(/\s+/g, " ").trim()),
              expression: value.trim(),
            },
          ]);
        }
        return JSON.stringify([]);
      }

      // For quarters_offered, convert text to array
      if (columnName === "quarters_offered") {
        if (typeof value === "string" && value.trim()) {
          const quarters = value
            .split(/[,;]/)
            .map((q) => q.trim())
            .filter((q) => ["Fall", "Winter", "Spring", "Summer"].includes(q));
          return JSON.stringify(quarters);
        }
        return JSON.stringify([]);
      }

      // For other JSONB fields, try to parse as JSON or convert to array
      if (typeof value === "string") {
        try {
          // Try parsing as JSON first
          JSON.parse(value);
          return value;
        } catch {
          // Convert to array if it looks like a delimited list
          if (value.includes(",") || value.includes(";")) {
            const items = value
              .split(/[,;]/)
              .map((item) => item.trim())
              .filter((item) => item);
            return JSON.stringify(items);
          }
          // Otherwise, wrap single value in array
          return JSON.stringify([value.trim()]);
        }
      }

      return JSON.stringify(value);
    } catch (error) {
      console.warn(
        `⚠️ JSON conversion failed for ${columnName}:`,
        error.message
      );
      return JSON.stringify([]);
    }
  }

  generateInsertSQL(tableName, rows) {
    if (rows.length === 0) return "";

    const columns = Object.keys(rows[0]);
    let sql = `\n-- ${tableName.toUpperCase()} DATA (${rows.length} records)\n`;
    sql += `INSERT INTO public.${tableName} (${columns.join(", ")}) VALUES\n`;

    const valueStrings = rows.map((row, index) => {
      const values = columns.map((col) => {
        const value = row[col];
        if (value === null || value === undefined) {
          return "NULL";
        }
        if (typeof value === "string") {
          return `'${value.replace(/'/g, "''")}'`;
        }
        if (typeof value === "boolean") {
          return value ? "true" : "false";
        }
        return value;
      });

      const result = `(${values.join(", ")})`;
      return index === rows.length - 1 ? result : result + ",";
    });

    sql += valueStrings.join("\n");
    sql += ";\n";

    return sql;
  }

  generateHeader() {
    return `-- seed.sql
-- Comprehensive seed script generated from SQLite database
-- Generated on: ${new Date().toISOString()}
-- Source: ${SQLITE_DB_PATH}

-- Clear existing data first (order matters due to foreign keys)
DELETE FROM public.core_curriculum_pathways;
DELETE FROM public.core_curriculum_requirements;
DELETE FROM public.courses;
DELETE FROM public.emphasis_areas_enhanced;
DELETE FROM public.majors;
DELETE FROM public.departments_and_programs;
DELETE FROM public.schools;

-- Reset sequences (if any)
-- ALTER SEQUENCE IF EXISTS schools_id_seq RESTART WITH 1;
`;
  }

  generateFooter() {
    return `
-- Conversion completed successfully
-- Total tables converted: ${this.stats.totalTables}
-- Total rows converted: ${this.stats.totalRows}
-- Warnings: ${this.stats.warnings.length}
-- Errors: ${this.stats.errors.length}
-- Generated on: ${new Date().toISOString()}
`;
  }

  async writeOutput() {
    try {
      console.log("💾 Writing output to file...");

      const finalSQL = this.outputSQL + this.generateFooter();
      fs.writeFileSync(OUTPUT_FILE, finalSQL);

      console.log(`✅ Successfully wrote ${OUTPUT_FILE}`);
      console.log(
        `📊 File size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`
      );

      return true;
    } catch (error) {
      console.error("❌ Failed to write output:", error.message);
      this.stats.errors.push(`File write failed: ${error.message}`);
      return false;
    }
  }

  printSummary() {
    console.log("\n" + "=".repeat(50));
    console.log("📈 CONVERSION SUMMARY");
    console.log("=".repeat(50));
    console.log(`✅ Tables converted: ${this.stats.totalTables}`);
    console.log(`📊 Total rows: ${this.stats.totalRows}`);
    console.log(`⚠️ Warnings: ${this.stats.warnings.length}`);
    console.log(`❌ Errors: ${this.stats.errors.length}`);

    // Units conversion statistics
    const totalUnitsConversions =
      this.stats.unitsConversions.naToZero +
      this.stats.unitsConversions.variableToRange;
    if (totalUnitsConversions > 0) {
      console.log(`\n📝 UNITS CONVERSIONS:`);
      console.log(`   'N/A' → '0': ${this.stats.unitsConversions.naToZero}`);
      console.log(
        `   'Variable' → '2-5': ${this.stats.unitsConversions.variableToRange}`
      );
      console.log(`   Total: ${totalUnitsConversions}`);
    }

    if (this.stats.warnings.length > 0) {
      console.log("\n⚠️ WARNINGS:");
      this.stats.warnings.forEach((warning) => console.log(`   ${warning}`));
    }

    if (this.stats.errors.length > 0) {
      console.log("\n❌ ERRORS:");
      this.stats.errors.forEach((error) => console.log(`   ${error}`));
    }

    if (this.stats.errors.length === 0) {
      console.log("\n🎉 Conversion completed successfully!");
    } else {
      console.log("\n💥 Conversion completed with errors!");
    }
  }

  cleanup() {
    try {
      if (this.db) {
        this.db.close();
        console.log("🔌 Database connection closed");
      }
    } catch (error) {
      console.warn("⚠️ Error closing database:", error.message);
    }
  }

  async convert() {
    console.log("🚀 Starting SQLite to Supabase conversion...");

    try {
      // Initialize
      if (!(await this.initialize())) {
        return false;
      }

      // Generate header
      this.outputSQL = this.generateHeader();

      // Convert tables in dependency order (parents first)
      const tableOrder = [
        "Schools",
        "DeptsAndPrograms",
        "Majors",
        "Emphases",
        "CoreCurriculumRequirements",
        "CoreCurriculumPathways",
        "Courses", // Courses last as they might reference other tables
      ];

      for (const tableName of tableOrder) {
        this.outputSQL += this.convertTable(tableName);
      }

      // Write output
      const writeSuccess = await this.writeOutput();

      // Print summary
      this.printSummary();

      return writeSuccess && this.stats.errors.length === 0;
    } catch (error) {
      console.error("💥 Fatal error during conversion:", error.message);
      this.stats.errors.push(`Fatal error: ${error.message}`);
      return false;
    } finally {
      this.cleanup();
    }
  }
}

// Main execution
async function main() {
  const converter = new SQLiteToSupabaseConverter();
  const success = await converter.convert();

  process.exit(success ? 0 : 1);
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("💥 Unhandled error:", error);
    process.exit(1);
  });
}
