import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * BACKEND FOOD LOGIC (UC-04)
 * File ini berisi fungsi-fungsi untuk mengelola data makanan di database.
 */

// FUNGSI SIMPAN: Menambahkan catatan makanan baru ke tabel 'foodLogs'
export const addFoodLog = mutation({
  args: {
    userId: v.id("users"),
    foodName: v.string(),
    calories: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
    portion: v.number(),
  },
  handler: async (ctx, args) => {
    // Memasukkan data ke database dengan tambahan timestamp (waktu saat ini)
    const logId = await ctx.db.insert("foodLogs", {
      ...args,
      timestamp: Date.now(),
    });
    return logId;
  },
});

// FUNGSI TARIK DATA: Mengambil catatan makanan khusus untuk hari ini
export const getTodayLogs = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Mencari rentang waktu mulai dari jam 00:00 hari ini
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    // Mengambil semua data foodLogs milik user ini yang waktunya >= jam 00:00 tadi
    const logs = await ctx.db
      .query("foodLogs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.gte(q.field("timestamp"), startOfDay))
      .collect();
    
    return logs;
  },
});
