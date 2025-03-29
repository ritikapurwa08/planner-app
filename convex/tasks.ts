import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const createTask = mutation({
  args: {
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
    subjectId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Error from tasks create tasks userid not found ");
    }

    // Get the Convex user ID

    const taskId = await ctx.db.insert("tasks", {
      tasksUserId: userId,
      taskName: args.taskName,
      taskStatus: args.taskStatus,
      description: args.description,
      dueDate: args.dueDate,
      priority: args.priority,
      subjectId: args.subjectId,
    });

    return taskId;
  },
});

export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    taskName: v.optional(v.string()),
    taskStatus: v.optional(
      v.union(
        v.literal("Not Started"),
        v.literal("In Progress"),
        v.literal("Completed")
      )
    ),
    description: v.optional(v.string()),
    dueDate: v.optional(v.string()), // Optional due date and time as a Unix timestamp (milliseconds)
    dueTime: v.optional(v.string()), // Optional due time in "HH:MM" format (e.g., "12:00")
    priority: v.optional(
      v.union(v.literal("High"), v.literal("Medium"), v.literal("Low"))
    ),
    subjectId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Error from tasks updateTask: User not authenticated");
    }

    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Error from tasks updateTask: Task not found");
    }

    if (task.tasksUserId !== userId) {
      throw new Error(
        "Error from tasks updateTask: Task does not belong to this user"
      );
    }

    const { taskId, ...updates } = args;

    await ctx.db.patch(taskId, updates);

    return taskId;
  },
});

export const removeTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Error from tasks removeTask: User not authenticated");
    }

    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Error from tasks removeTask: Task not found");
    }

    if (task.tasksUserId !== userId) {
      throw new Error(
        "Error from tasks removeTask: Task does not belong to this user"
      );
    }

    await ctx.db.delete(args.taskId);

    return args.taskId;
  },
});

export const getAllTasks = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return; // Or you could throw an error: throw new Error("User not authenticated");
    }

    const tasks = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("tasksUserId"), userId))
      .collect();

    return tasks;
  },
});
export const getTaskById = query({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null; // Or throw new Error("User not authenticated");
    }

    const task = await ctx.db.get(args.taskId);

    if (!task) {
      return null; // Or throw new Error("Task not found");
    }

    if (task.tasksUserId !== userId) {
      return null; // Or throw new Error("Task does not belong to this user");
    }

    return task;
  },
});

export const searchTasks = query({
  args: {
    userId: v.id("users"),
    searchQuery: v.string(),
    status: v.optional(
      v.union(
        v.literal("Not Started"),
        v.literal("In Progress"),
        v.literal("Completed")
      )
    ),
    priority: v.optional(
      v.union(v.literal("High"), v.literal("Medium"), v.literal("Low"))
    ),
  },
  handler: async (ctx, args) => {
    let taskQuery = ctx.db
      .query("tasks")
      .withSearchIndex("search_name", (q) => {
        let builder = q.search("taskName", args.searchQuery);

        // Add status filter if provided
        if (args.status) {
          builder = builder.eq("taskStatus", args.status);
        }

        // Add priority filter if provided
        if (args.priority) {
          builder = builder.eq("priority", args.priority);
        }

        return builder;
      })
      .filter((q) => q.eq(q.field("tasksUserId"), args.userId));

    return await taskQuery.collect();
  },
});

export const searchTasksPaginated = query({
  args: {
    userId: v.id("users"),
    searchQuery: v.string(),
    status: v.optional(
      v.union(
        v.literal("Not Started"),
        v.literal("In Progress"),
        v.literal("Completed")
      )
    ),
    priority: v.optional(
      v.union(v.literal("High"), v.literal("Medium"), v.literal("Low"))
    ),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    let taskQuery = ctx.db
      .query("tasks")
      .withSearchIndex("search_name", (q) => {
        let builder = q.search("taskName", args.searchQuery);

        // Add status filter if provided
        if (args.status) {
          builder = builder.eq("taskStatus", args.status);
        }

        // Add priority filter if provided
        if (args.priority) {
          builder = builder.eq("priority", args.priority);
        }

        return builder;
      })
      .filter((q) => q.eq(q.field("tasksUserId"), args.userId));

    return await taskQuery.paginate(args.paginationOpts);
  },
});

export const paginatedTasksQuery = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("tasksUserId", args.userId))
      .paginate(args.paginationOpts);

    return tasks;
  },
});
