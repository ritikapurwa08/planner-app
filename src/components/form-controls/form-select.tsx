import {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
} from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
  defaultValue?: PathValue<T, FieldPath<T>>;
  disabled?: boolean;
}

export default function FormSelect<T extends FieldValues>({
  control,
  label,
  name,
  disabled,
  options,
  placeholder,
  defaultValue,
}: Readonly<FormSelectProps<T>>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control, defaultValue });

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Select
          disabled={disabled}
          onValueChange={field.onChange} // Connect React Hook Form's onChange
          defaultValue={defaultValue as string} // Set the default value
        >
          <SelectTrigger className={cn("")}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
      {fieldError?.message && (
        <FormMessage className="text-red-500 text-xs">
          {fieldError.message}
        </FormMessage>
      )}
    </FormItem>
  );
}
