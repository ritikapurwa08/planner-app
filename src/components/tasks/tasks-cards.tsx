import React from "react";
import { Doc } from "../../../convex/_generated/dataModel";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarIcon,
  ClockIcon,
  GripVerticalIcon,
  InboxIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import TaskDialog from "./task-dialog";

interface TaskCardProps {
  task: Doc<"tasks">;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const {
    _creationTime,
    _id,
    taskName,
    taskStatus,
    tasksUserId,
    description,
    dueDate,
    priority,
    subjectId,
    updatedAt,
  } = task;

  const formattedDueDate = dueDate
    ? format(new Date(dueDate), "MMM dd, yyyy hh:mm aa")
    : "No due date";

  const statusColor =
    taskStatus === "Completed"
      ? "bg-green-500 text-white"
      : taskStatus === "In Progress"
        ? "bg-yellow-500 text-white"
        : "bg-gray-300 text-gray-700";

  const priorityColor =
    priority === "High"
      ? "text-red-500"
      : priority === "Medium"
        ? "text-orange-500"
        : priority === "Low"
          ? "text-green-500"
          : "text-gray-500";

  return (
    <Card key={_id} className="w-full shadow-md border">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-semibold truncate">
          {taskName}
        </CardTitle>
        <Badge className={statusColor}>{taskStatus}</Badge>
      </CardHeader>
      <CardContent className="grid gap-2 py-2">
        {description && (
          <CardDescription className="text-sm text-muted-foreground truncate">
            {description}
          </CardDescription>
        )}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>{formattedDueDate}</span>
        </div>
        {priority && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <GripVerticalIcon className={`h-4 w-4 ${priorityColor}`} />
            <span>Priority: {priority}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        <TaskDialog taskId={_id} type="update" />
        <TaskDialog taskId={_id} type="remove" />
      </CardFooter>
    </Card>
  );
};

export const TasksLoadingCard = () => {
  return (
    <Card className="w-full shadow-md border animate-pulse">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <Skeleton className="h-6 w-32 rounded-md" />
        <Skeleton className="h-4 w-16 rounded-md" />
      </CardHeader>
      <CardContent className="grid gap-2 py-2">
        <Skeleton className="h-4 w-64 rounded-md" />
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4 opacity-50" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <GripVerticalIcon className="h-4 w-4 opacity-50" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </CardFooter>
    </Card>
  );
};

export const NoTasksFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full  space-y-4">
      <InboxIcon className="h-16 w-16 text-gray-400" />
      <h1 className="text-2xl font-bold text-gray-700">No Tasks Found</h1>
      <p className="text-gray-500 text-center">
        Looks like you don't have any tasks yet. Click the button below to
        create one!
      </p>

      <TaskDialog taskId={undefined} type="create" />
    </div>
  );
};
