/**
 * Optimized Support Schedule Query Service
 * 
 * This service provides optimized queries for support schedules with:
 * - Database query optimization
 * - Result caching
 * - Efficient time-based lookups
 * - Batch operations
 */

const SupportSchedule = require('../models/SupportSchedule');
const User = require('../models/User');
const { Op } = require('sequelize');

// Simple in-memory cache for schedule queries
// In production, consider using Redis or similar
const scheduleCache = {
    data: new Map(),
    ttl: 5 * 60 * 1000, // 5 minutes TTL
    maxSize: 1000
};

/**
 * Generate cache key for schedule queries
 */
const getCacheKey = (supportTeamId, currentTime) => {
    return `schedule:${supportTeamId}:${currentTime}`;
};

/**
 * Clear expired cache entries
 */
const clearExpiredCache = () => {
    const now = Date.now();
    for (const [key, value] of scheduleCache.data.entries()) {
        if (now > value.expiresAt) {
            scheduleCache.data.delete(key);
        }
    }
    
    // If cache is too large, remove oldest entries
    if (scheduleCache.data.size > scheduleCache.maxSize) {
        const entries = Array.from(scheduleCache.data.entries())
            .sort((a, b) => a[1].expiresAt - b[1].expiresAt);
        const toRemove = entries.slice(0, scheduleCache.data.size - scheduleCache.maxSize);
        toRemove.forEach(([key]) => scheduleCache.data.delete(key));
    }
};

/**
 * Get cached schedule data
 */
const getCached = (key) => {
    clearExpiredCache();
    const cached = scheduleCache.data.get(key);
    if (cached && Date.now() < cached.expiresAt) {
        return cached.data;
    }
    if (cached) {
        scheduleCache.data.delete(key);
    }
    return null;
};

/**
 * Set cache data
 */
const setCache = (key, data) => {
    clearExpiredCache();
    scheduleCache.data.set(key, {
        data,
        expiresAt: Date.now() + scheduleCache.ttl
    });
};

/**
 * Optimized function to find matching support schedules
 * Uses indexes and caching for better performance
 * 
 * @param {number} supportTeamId - The support team ID
 * @param {string} currentTime - Current time in HH:MM:SS format
 * @param {object} options - Query options
 * @param {boolean} options.useCache - Whether to use cache (default: true)
 * @param {boolean} options.includeUser - Whether to include user data (default: true)
 * @param {number[]} options.escalationLevels - Filter by specific escalation levels
 * @returns {Promise<Array>} Array of matching support schedules
 */
const findMatchingSchedules = async (supportTeamId, currentTime, options = {}) => {
    const {
        useCache = true,
        includeUser = true,
        escalationLevels = null
    } = options;

    try {
        // Check cache first
        const cacheKey = getCacheKey(supportTeamId, currentTime);
        if (useCache) {
            const cached = getCached(cacheKey);
            if (cached) {
                return cached;
            }
        }

        // Build optimized query
        const whereClause = {
            SupportTeamId: supportTeamId,
            [Op.and]: [
                { startTime: { [Op.lte]: currentTime } },
                { endTime: { [Op.gte]: currentTime } }
            ]
        };

        // Add escalation level filter if specified
        if (escalationLevels && Array.isArray(escalationLevels)) {
            whereClause.escalationLevel = { [Op.in]: escalationLevels };
        }

        // Build include options
        const includeOptions = [];
        if (includeUser) {
            includeOptions.push({
                model: User,
                attributes: ['id', 'name', 'email', 'phoneNumber'], // Only select needed fields
                required: true
            });
        }

        // Execute optimized query with indexes
        const schedules = await SupportSchedule.findAll({
            where: whereClause,
            include: includeOptions,
            order: [['escalationLevel', 'ASC']],
            // Use raw query hints for better performance (MySQL specific)
            // raw: true, // Uncomment if you want raw results
        });

        // Cache results
        if (useCache) {
            setCache(cacheKey, schedules);
        }

        return schedules;
    } catch (error) {
        console.error("Error finding matching schedules:", error);
        return [];
    }
};

/**
 * Find schedules for a support team (all schedules, not time-filtered)
 * Optimized for bulk operations
 * 
 * @param {number} supportTeamId - The support team ID
 * @param {object} options - Query options
 * @returns {Promise<Array>} Array of schedules
 */
const findSchedulesByTeam = async (supportTeamId, options = {}) => {
    const {
        includeUser = true,
        includeTeam = false,
        escalationLevels = null
    } = options;

    try {
        const whereClause = {
            SupportTeamId: supportTeamId
        };

        if (escalationLevels && Array.isArray(escalationLevels)) {
            whereClause.escalationLevel = { [Op.in]: escalationLevels };
        }

        const includeOptions = [];
        if (includeUser) {
            includeOptions.push({
                model: User,
                attributes: ['id', 'name', 'email'],
                required: false
            });
        }
        if (includeTeam) {
            includeOptions.push({
                model: require('../models/SupportTeam'),
                attributes: ['id', 'name'],
                required: false
            });
        }

        return await SupportSchedule.findAll({
            where: whereClause,
            include: includeOptions,
            order: [['escalationLevel', 'ASC'], ['startTime', 'ASC']]
        });
    } catch (error) {
        console.error("Error finding schedules by team:", error);
        return [];
    }
};

/**
 * Find schedules for multiple teams efficiently (batch query)
 * 
 * @param {number[]} supportTeamIds - Array of support team IDs
 * @param {string} currentTime - Current time in HH:MM:SS format
 * @returns {Promise<Map>} Map of teamId -> schedules array
 */
const findMatchingSchedulesBatch = async (supportTeamIds, currentTime) => {
    try {
        if (!supportTeamIds || supportTeamIds.length === 0) {
            return new Map();
        }

        // Single query for all teams
        const schedules = await SupportSchedule.findAll({
            where: {
                SupportTeamId: { [Op.in]: supportTeamIds },
                [Op.and]: [
                    { startTime: { [Op.lte]: currentTime } },
                    { endTime: { [Op.gte]: currentTime } }
                ]
            },
            include: [{
                model: User,
                attributes: ['id', 'name', 'email'],
                required: true
            }],
            order: [['SupportTeamId', 'ASC'], ['escalationLevel', 'ASC']]
        });

        // Group by team ID
        const result = new Map();
        schedules.forEach(schedule => {
            const teamId = schedule.SupportTeamId;
            if (!result.has(teamId)) {
                result.set(teamId, []);
            }
            result.get(teamId).push(schedule);
        });

        return result;
    } catch (error) {
        console.error("Error finding matching schedules batch:", error);
        return new Map();
    }
};

/**
 * Find user at specific escalation level for a team at current time
 * Optimized single-user lookup
 * 
 * @param {number} supportTeamId - The support team ID
 * @param {number} escalationLevel - Escalation level (1, 2, or 3)
 * @param {string} currentTime - Current time in HH:MM:SS format
 * @returns {Promise<User|null>} User object or null
 */
const findUserAtLevel = async (supportTeamId, escalationLevel, currentTime) => {
    try {
        const schedules = await findMatchingSchedules(supportTeamId, currentTime, {
            escalationLevels: [escalationLevel],
            includeUser: true,
            useCache: true
        });

        if (schedules.length > 0) {
            return schedules[0].User || schedules[0].user;
        }

        return null;
    } catch (error) {
        console.error("Error finding user at level:", error);
        return null;
    }
};

/**
 * Clear schedule cache (useful when schedules are updated)
 * 
 * @param {number} supportTeamId - Optional team ID to clear specific cache
 */
const clearScheduleCache = (supportTeamId = null) => {
    if (supportTeamId) {
        // Clear cache entries for specific team
        const keysToDelete = [];
        for (const key of scheduleCache.data.keys()) {
            if (key.startsWith(`schedule:${supportTeamId}:`)) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach(key => scheduleCache.data.delete(key));
    } else {
        // Clear all cache
        scheduleCache.data.clear();
    }
};

/**
 * Get cache statistics (for monitoring)
 */
const getCacheStats = () => {
    clearExpiredCache();
    return {
        size: scheduleCache.data.size,
        maxSize: scheduleCache.maxSize,
        ttl: scheduleCache.ttl,
        entries: Array.from(scheduleCache.data.keys())
    };
};

module.exports = {
    findMatchingSchedules,
    findSchedulesByTeam,
    findMatchingSchedulesBatch,
    findUserAtLevel,
    clearScheduleCache,
    getCacheStats
};
