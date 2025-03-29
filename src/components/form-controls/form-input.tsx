import { LucideIcon } from "lucide-react";
import {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
} from "react-hook-form";
import { IconType } from "react-icons";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  label: string;
  placeholder?: string;
  icon?: IconType | LucideIcon;
  defaultValue?: PathValue<T, FieldPath<T>>;
  disabled?: boolean;
  type?: React.HTMLInputTypeAttribute; // Add type prop
}

export default function FormInput<T extends FieldValues>({
  control,
  label,
  name,
  disabled,
  icon: Icon,
  onChange,
  placeholder,
  defaultValue,
  type = "text", // Default type is text
}: Readonly<FormInputProps<T>>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name, control, defaultValue });
  return (
    <FormItem className="">
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div id="icon_input_div" className="relative ">
          <div id="icon">{Icon && <Icon className="" size={""} />}</div>
          <div id="input">
            <Input
              id={`${name}-input`}
              {...field}
              disabled={disabled}
              placeholder={placeholder}
              className={cn("")}
              onChange={(e) => {
                field.onChange(e);
                onChange?.(e);
              }}
            />
          </div>
        </div>
      </FormControl>

      {fieldError?.message && (
        <FormMessage className="text-red-500 text-xs">
          {fieldError.message}
        </FormMessage>
      )}
    </FormItem>
  );
}
