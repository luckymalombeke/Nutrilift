import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(), // In a real app, use Clerk or similar for auth. For this demo, simple storage.
    tokenIdentifier: v.optional(v.string()), // For future auth integration
    
    // Health Profile (UC-02)
    age: v.optional(v.number()),
    weight: v.optional(v.number()),
    height: v.optional(v.number()),
    activityLevel: v.optional(v.string()), // e.g., sedentary, active
    healthGoals: v.optional(v.array(v.string())),
    dietaryPreferences: v.optional(v.array(v.string())),
    
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  foodLogs: defineTable({
    userId: v.id("users"),
    foodName: v.string(),
    calories: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
    portion: v.number(), // in grams or servings
    timestamp: v.number(),
  }).index("by_user", ["userId"]),

  // UC-08: Reminder Pengingat
  reminders: defineTable({
    userId: v.id("users"),
    title: v.string(), // Misal: "Minum Air", "Makan Siang"
    time: v.string(), // Format "HH:mm"
    isActive: v.boolean(),
    type: v.string(), // e.g., "makan", "minum", "olahraga"
  }).index("by_user", ["userId"]),

  // UC-05: Tracking Aktivitas
  activities: defineTable({
    userId: v.id("users"),
    activityName: v.string(), // Misal: "Lari Pagi", "Gym"
    duration: v.number(), // dalam menit
    caloriesBurned: v.number(),
    timestamp: v.number(),
  }).index("by_user", ["userId"]),
});
