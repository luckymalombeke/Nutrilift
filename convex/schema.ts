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
});
