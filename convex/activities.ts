import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * BACKEND ACTIVITY LOGIC (UC-05)
 */

// Catat aktivitas baru
export const addActivity = mutation({
  args: {
    userId: v.id("users"),
    activityName: v.string(),
    duration: v.number(),
    caloriesBurned: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activities", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

// Ambil riwayat aktivitas user hari ini
export const getTodayActivities = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    return await ctx.db
      .query("activities")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.gte(q.field("timestamp"), startOfDay))
      .collect();
  },
});
