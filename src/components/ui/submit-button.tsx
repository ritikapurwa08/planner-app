import { LoaderIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  loading: boolean;
  disable: boolean;
  loadingText: string;
  staticText: string;
  className: string;
}

export default function SubmitButton({
  disable,
  loading,
  loadingText,
  staticText,
  className,
}: SubmitButtonProps) {
  return (
    <Button
      disabled={disable}
      className={cn("hover:transition-all duration-200 ease-in-out", className)}
      type="submit"
    >
      {loading ? (
        <span className="flex flex-row space-x-1 ">
          {`${loadingText}`}
          <LoaderIcon className="animate-spin size-4.5 text-muted-foreground" />
        </span>
      ) : (
        <span>{staticText}</span>
      )}
    </Button>
  );
}
