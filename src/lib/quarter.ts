export type Season = "Winter" | "Spring" | "Summer" | "Fall";

export interface QuarterMeta {
    season: Season;
    year: number;
}

const FULL_SEASONS: Season[] = ["Winter", "Spring", "Summer", "Fall"];

// Parse the current date into academic quarter meta
export function getQuarterForDate(date: Date = new Date()): QuarterMeta {
    const month = date.getMonth() + 1; // 0-based -> 1-based
    const year = date.getFullYear();

    let season: Season;
    if (month >= 9) {
        season = "Fall";
    } else if (month >= 7) {
        season = "Summer";
    } else if (month >= 4) {
        season = "Spring";
    } else {
        season = "Winter";
    }

    return { season, year };
}

// Shift a quarter forward (+) or backward (–) by N steps (quarters)
export function shiftQuarter(
    meta: QuarterMeta,
    offset: number,
    includeSummer = true
): QuarterMeta {
    if (offset === 0) return meta;

    // Helper to move one step forward/backward respecting summer flag
    const nextSeason = (current: Season, direction: 1 | -1): Season => {
        let idx = FULL_SEASONS.indexOf(current);
        while (true) {
            idx = (idx + direction + FULL_SEASONS.length) % FULL_SEASONS.length;
            const candidate = FULL_SEASONS[idx];
            if (includeSummer || candidate !== "Summer") {
                return candidate;
            }
        }
    };

    let { season, year } = meta;
    const direction: 1 | -1 = offset > 0 ? 1 : -1;
    let steps = Math.abs(offset);

    while (steps > 0) {
        const prevSeason = season;
        season = nextSeason(season, direction);

        // Adjust academic year when crossing Winter<->Fall boundary
        if (direction === 1 && prevSeason === "Fall") {
            year += 1;
        }
        if (direction === -1 && prevSeason === "Winter") {
            year -= 1;
        }

        steps -= 1;
    }

    return { season, year } as QuarterMeta;
}

// Build a full Quarter object used throughout the planner
import type { Quarter } from "./types";

export function buildQuarter(meta: QuarterMeta): Quarter {
    const { season, year } = meta;
    return {
        id: `${year}-${season}`,
        name: `${season} ${year}`,
        season,
        year,
        courses: [],
    } as Quarter;
} 