"use client";

import { useGetCurrentUser } from "@/api/users/user-query";
import TaskDialog from "@/components/tasks/task-dialog";
import {
  NoTasksFound,
  TaskCard,
  TasksLoadingCard,
} from "@/components/tasks/tasks-cards";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader, SearchIcon } from "lucide-react"; // Import Lucide icon
import { useGetPaginatedTasks } from "@/api/tasks/tasks-query";
// Assuming the hook is in the same directory

const TasksPage = () => {
  const currentUser = useGetCurrentUser();
  const userId = currentUser?._id;

  const {
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
  } = useGetPaginatedTasks({ userId });

  return (
    <div className="   w-full p-4  mx-auto flex flex-col">
      <div
        id="tasks-page-header"
        className="flex flex-row justify-between w-full  space-x-2"
      >
        <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
        <div
          id="header-search-input"
          className="relative flex w-3/5 mx-4 max-w-3/5"
        >
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            className=" pl-7"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute transform -translate-y-1/2 left-2 top-1/2">
            <SearchIcon className="size-4" />
          </span>
        </div>
        <div id="filter-buttons" className="flex flex-row space-x-2">
          <StatusSelectButton status={status} setStatus={setStatus} />
          <PriortySelectButton priorty={priority} setPriority={setPriority} />
        </div>
        <div className="task-create-button">
          <TaskDialog taskId={undefined} type="create" />
        </div>
      </div>

      <div className="flex items-center space-x-2"></div>

      <div className="">
        <div
          id="loading-cards"
          className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {LoadingFirstPage &&
            Array.from({ length: 3 }).map((_, index) => (
              <TasksLoadingCard key={`loading-${index}`} />
            ))}
        </div>

        <div id="">
          <div className="">
            {Exhausted && results && results.length > 0 ? (
              results.map((task) => (
                <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <TaskCard key={task._id} task={task} />
                </div>
              ))
            ) : LoadingFirstPage && (!results || results.length === 0) ? (
              <div className="flex w-full justify-center items-center pt-20">
                {(!results || results.length === 0 || !IsSearching) && (
                  <div className="flex w-full justify-center">
                    <NoTasksFound />
                  </div>
                )}
              </div>
            ) : CanLoadMore && results ? (
              <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            ) : null}
          </div>

          {LoadingMore && (
            <div className="col-span-full flex justify-center items-center p-4">
              {" "}
              {/* Added padding */}
              Loading more... <Loader className="ml-2 h-4 w-4 animate-spin" />
            </div>
          )}
          {Exhausted && (!results || results.length === 0 || !IsSearching) && (
            <div className="flex w-full justify-center items-center pt-20">
              <NoTasksFound />
            </div>
          )}
        </div>
      </div>

      {CanLoadMore && !LoadingMore && (
        <div className="flex w-full pb-6 justify-center">
          <Button
            variant="outline"
            size="default"
            onClick={() => loadMore(6)}
            // Disable when loading more
          >
            <span>Load More</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default TasksPage;

interface SelectButtonProps {
  priorty: "High" | "Medium" | "Low" | undefined;
  setPriority: React.Dispatch<
    React.SetStateAction<"High" | "Medium" | "Low" | undefined>
  >;
}
const PriortySelectButton = ({ setPriority }: SelectButtonProps) => {
  return (
    <Select
      onValueChange={(value) =>
        setPriority(value === "all" ? undefined : (value as any))
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Priorities</SelectItem>
        <SelectItem value="High">High</SelectItem>
        <SelectItem value="Medium">Medium</SelectItem>
        <SelectItem value="Low">Low</SelectItem>
      </SelectContent>
    </Select>
  );
};
interface StatusSelectButton {
  status: "Not Started" | "In Progress" | "Completed" | undefined;
  setStatus: React.Dispatch<
    React.SetStateAction<
      "Not Started" | "In Progress" | "Completed" | undefined
    >
  >;
}
const StatusSelectButton = ({ setStatus, status }: StatusSelectButton) => {
  return (
    <Select
      onValueChange={(value) =>
        setStatus(value === "all" ? undefined : (value as any))
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="Not Started">Not Started</SelectItem>
        <SelectItem value="In Progress">In Progress</SelectItem>
        <SelectItem value="Completed">Completed</SelectItem>
      </SelectContent>
    </Select>
  );
};
