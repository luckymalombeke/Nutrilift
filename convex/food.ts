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

// UC-04: Kamus Makanan Bersama
export const getAllFoodItems = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("foodDictionary").collect();
  },
});

export const searchFoodDictionary = query({
  args: { queryText: v.string() },
  handler: async (ctx, args) => {
    if (args.queryText.length < 2) return [];
    
    // Simple substring search (case sensitive manually or just collect)
    // Convex doesn't have native case-insensitive regex in filters yet for large datasets, 
    // but for a small dictionary filter is fine.
    const lowerQuery = args.queryText.toLowerCase();
    const all = await ctx.db.query("foodDictionary").collect();
    
    return all.filter(food => 
      food.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 5); // Limit to top 5 matches
  },
});

export const seedFoodDictionary = mutation({
  args: { 
    foods: v.array(v.object({
      name: v.string(),
      cal: v.number(),
      prot: v.number(),
      carb: v.number(),
      fat: v.number(),
    }))
  },
  handler: async (ctx, args) => {
    for (const food of args.foods) {
      const existing = await ctx.db
        .query("foodDictionary")
        .withIndex("by_name", (q) => q.eq("name", food.name))
        .unique();
      
      if (!existing) {
        await ctx.db.insert("foodDictionary", food);
      }
    }
  },
});
