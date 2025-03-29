import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const Tables = () => {
  const tasks = defineTable({
    tasksUserId: v.id("users"),
    taskName: v.string(),
    taskStatus: v.union(
      v.literal("Not Started"),
      v.literal("In Progress"),
      v.literal("Completed")
    ),
    description: v.optional(v.string()),
    dueDate: v.optional(v.string()), // Optional due date and time as a Unix timestamp (milliseconds)

    priority: v.optional(
      v.union(v.literal("High"), v.literal("Medium"), v.literal("Low"))
    ),
    updatedAt: v.optional(v.number()), // Optional update timestamp (Convex might handle this automatically)
    subjectId: v.optional(v.string()), // Optional reference to a subject (if you have a subjects table)
  })
    .index("by_user", ["tasksUserId"])
    .searchIndex("search_name", {
      searchField: "taskName",
      filterFields: ["taskStatus", "priority"],
    });

  return {
    tasks,
  };
};

const { tasks } = Tables();

const schema = defineSchema({
  ...authTables,
  tasks: tasks,
});

export default schema;
