import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { api } from "../../../convex/_generated/api";

type MutationOpts<_TArgs, TResponse> = {
  onSuccess: (data: TResponse) => void;
  onError: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

type MutationState<TResponse> = {
  data: TResponse | null;
  error: Error | null;
  status: "success" | "error" | "settled" | "pending" | null;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const useMutationHook = <TArgs extends {}, TResponse>(
  mutationFn: (args: TArgs) => Promise<TResponse>
) => {
  const [state, setState] = useState<MutationState<TResponse>>({
    data: null,
    error: null,
    status: null,
  });
  const isPending = useMemo(() => state.status === "pending", [state.status]);
  const isSuccess = useMemo(() => state.status === "success", [state.status]);
  const isError = useMemo(() => state.status === "error", [state.status]);
  const isSettled = useMemo(() => state.status === "settled", [state.status]);
  const data = useMemo(() => state.data, [state.data]);
  const mutate = useCallback(
    async (values: TArgs, options?: MutationOpts<TArgs, TResponse>) => {
      try {
        setState({ data: null, error: null, status: "pending" });

        const response = await mutationFn(values);
        setState({ data: response, error: null, status: "success" });
        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        setState({ data: null, error: error as Error, status: "error" });
        options?.onError?.(error as Error);

        if (options?.throwError) {
          throw error;
        }
      } finally {
        setState((prev) => ({ ...prev, status: "settled" }));
        options?.onSettled?.();
      }
    },
    [mutationFn]
  );

  return {
    mutate,
    isPending,
    isError,
    isSuccess,
    isSettled,
    data,
    error: state.error,
  };
};

export const useCreateTaskMutation = () => {
  const createTask = useMutation(api.tasks.createTask);
  return useMutationHook(createTask);
};

export const useUpdateTaskMutation = () => {
  const updateTask = useMutation(api.tasks.updateTask);
  return useMutationHook(updateTask);
};

export const useRemoveTaskMutation = () => {
  const removeTask = useMutation(api.tasks.removeTask);
  return useMutationHook(removeTask);
};
