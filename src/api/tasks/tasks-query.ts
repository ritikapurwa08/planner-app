import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useState } from "react";

export const useGetAllTaks = () => {
  const tasks = useQuery(api.tasks.getAllTasks);
  return tasks;
};

export const useGetTaskById = ({
  taskId,
}: {
  taskId: Id<"tasks"> | undefined;
}) => {
  const task = useQuery(api.tasks.getTaskById, taskId ? { taskId } : "skip");
  return task;
};

// hooks/use-get-paginated-tasks.ts (Assuming you'll place it in a 'hooks' directory)

export const useGetPaginatedTasks = ({
  userId,
}: {
  userId: Id<"users"> | undefined;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState<
    "Not Started" | "In Progress" | "Completed" | undefined
  >(undefined);
  const [priority, setPriority] = useState<
    "High" | "Medium" | "Low" | undefined
  >(undefined);

  const queryArgs = userId
    ? {
        userId: userId,
        searchQuery: searchQuery,
        priority: priority,
        status: status,
      }
    : "skip";

  const {
    results,
    status: paginationStatus,
    loadMore,
    isLoading,
  } = usePaginatedQuery(api.tasks.searchTasksPaginated, queryArgs, {
    initialNumItems: 10,
  });

  const CanLoadMore = paginationStatus === "CanLoadMore";
  const Exhausted = paginationStatus === "Exhausted";
  const LoadingFirstPage = paginationStatus === "LoadingFirstPage";
  const LoadingMore = paginationStatus === "LoadingMore";
  const IsSearching = searchQuery !== "" && paginationStatus === "LoadingMore"; // Define a searching state

  return {
    results,
    Exhausted,
    LoadingFirstPage,
    CanLoadMore,
    LoadingMore,
    loadMore,
    isLoading,
    searchQuery,
    setSearchQuery,
    status,
    setStatus,
    priority,
    setPriority,
    IsSearching,
  };
};
