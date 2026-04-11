import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * BACKEND REMINDER LOGIC (UC-08)
 */

// Simpan pengingat baru
export const addReminder = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    time: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reminders", {
      ...args,
      isActive: true,
    });
  },
});

// Ambil semua pengingat user
export const getReminders = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reminders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Update status pengingat
export const toggleReminder = mutation({
  args: { id: v.id("reminders"), isActive: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isActive: args.isActive });
  },
});
