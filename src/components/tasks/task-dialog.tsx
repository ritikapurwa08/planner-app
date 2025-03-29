"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useCreateTaskMutation,
  useRemoveTaskMutation,
  useUpdateTaskMutation,
} from "@/api/tasks/tasks-mutation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";
import { useGetTaskById } from "@/api/tasks/tasks-query";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Form } from "../ui/form";
import FormInput from "../form-controls/form-input";
import FormSelect from "../form-controls/form-select";
import SubmitButton from "../ui/submit-button";
import { FormDateTimePicker } from "../form-controls/form-date-picker";
import { cn } from "@/lib/utils";

interface TaskDialogProps {
  type: "create" | "update" | "remove";
  taskId: Id<"tasks"> | undefined;
}

const TaskDialog = ({ type, taskId }: TaskDialogProps) => {
  const { mutate: createTask, isPending: creatingTask } =
    useCreateTaskMutation();
  const { mutate: updateTaks, isPending: updatingTask } =
    useUpdateTaskMutation();
  const { mutate: removeTask, isPending: removingTask } =
    useRemoveTaskMutation();
  const [open, isOpen] = useState(false);
  const task = useGetTaskById({ taskId });
  useEffect(() => {}, [task]);

  const handleCreateUpdateTask = (data: TaskZodType) => {
    if (type === "create") {
      createTask(data, {
        onSuccess() {
          isOpen(false);
          toast.success("Task created successfully");
        },
        onError() {
          toast.error("Error creating task");
        },
      });
    } else if (type === "update" && task) {
      updateTaks({
        taskId: task._id,
        ...data,
      });
      isOpen(false);
      toast.success("Task updated successfully");
    }
  };

  const handleRemoveTask = () => {
    if (type === "remove" && task) {
      removeTask(
        {
          taskId: task._id,
        },
        {
          onSuccess() {
            isOpen(false);
            toast.success("Task deleted successfully");
          },
          onError({}) {
            toast.error("Error deleting task");
          },
        }
      );
    }
  };

  const { form } = TasksForm();
  const taskStatusOptions = [
    { value: "Not Started", label: "Not Started" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];
  const submitButtonText = type === "create" ? "Create Task" : "Update Task";

  return (
    <Dialog open={open} onOpenChange={isOpen}>
      <DialogTrigger asChild>
        <div>
          {type === "create" && <Button>Create Task</Button>}
          {type === "update" && <Button>Update</Button>}
          {type === "remove" && <Button>Remove Task</Button>}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {type === "create" && (
            <DialogTitle>create a task fill these</DialogTitle>
          )}
          {type === "update" && <DialogTitle>update Your Task </DialogTitle>}
          {type === "remove" && <DialogTitle>FRemove this task </DialogTitle>}
          <DialogDescription>
            {`Make changes to your profile here. Click save when you're done.`}
          </DialogDescription>
        </DialogHeader>

        {type === "create" || type === "update" ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreateUpdateTask)}
              className="grid gap-4 py-4"
            >
              <FormInput
                control={form.control}
                label="Task Name"
                name="taskName"
                defaultValue={type === "update" ? task?.taskName : ""}
              />
              <FormSelect
                options={taskStatusOptions}
                control={form.control}
                label="Status"
                name="taskStatus"
                defaultValue={
                  type === "update" ? task?.taskStatus : "Not Completed"
                }
              />
              <FormInput
                control={form.control}
                label="Description"
                name="description"
                defaultValue={type === "update" ? task?.description : ""}
              />
              <FormDateTimePicker
                control={form.control}
                name="dueDate"
                label="Due Date and Time"
                defaultValue={type === "update" ? task?.dueDate : ""}
              />
              <FormSelect
                options={priorityOptions}
                control={form.control}
                label="Priority"
                name="priority"
                defaultValue={type === "update" ? task?.priority : "high"}
              />
              <FormInput
                control={form.control}
                label="Subject ID"
                name="subjectId"
                defaultValue={type === "update" ? task?.subjectId : "hello"}
              />

              <DialogFooter>
                <DialogClose>Cancel</DialogClose>
                <SubmitButton
                  className={cn(
                    "w-32",
                    type === "create" ? "bg-green-500" : "bg-blue-500"
                  )}
                  loading={creatingTask || updatingTask}
                  disable={creatingTask || updatingTask}
                  loadingText={creatingTask ? "Creating..." : "Updating..."}
                  staticText={submitButtonText}
                />
              </DialogFooter>
            </form>
          </Form>
        ) : type === "remove" && task ? (
          <div className="py-4">
            <p>{`Are you sure you want to remove the task "${task.taskName}"?`}</p>
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <Button
                variant="destructive"
                onClick={handleRemoveTask}
                disabled={removingTask}
              >
                {removingTask ? "Removing..." : "Remove Task"}
              </Button>
            </DialogFooter>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;

const TaskZodSchema = z.object({
  taskName: z.string().min(1, "Task name is required"),
  taskStatus: z.enum(["Not Started", "In Progress", "Completed"]),
  description: z.string().optional(),
  dueDate: z.string().optional(), // Unix timestamp (milliseconds)
  priority: z.enum(["High", "Medium", "Low"]).optional(),
  subjectId: z.string().optional(), // Convex Id<"subjects"> will be a string
});

type TaskZodType = z.infer<typeof TaskZodSchema>;

const TasksForm = () => {
  const form = useForm<TaskZodType>({
    resolver: zodResolver(TaskZodSchema),
  });

  return { form };
};
