"use client";

import * as React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CalendarIcon } from "lucide-react";
import {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
} from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";

interface FormDateTimePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  defaultValue?: PathValue<T, FieldPath<T>>;
  disabled?: boolean;
}

export function FormDateTimePicker<T extends FieldValues>({
  control,
  name,
  label,
  defaultValue,
  disabled,
}: Readonly<FormDateTimePickerProps<T>>) {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({
    name,
    control,
    defaultValue,
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    field.value ? new Date(field.value as string) : undefined
  );

  React.useEffect(() => {
    if (field.value) {
      setInternalDate(new Date(field.value as string));
    }
  }, [field.value]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setInternalDate(selectedDate);
      const formatted = format(selectedDate, "MM/dd/yyyy hh:mm aa");
      field.onChange(formatted);
    }
  };

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    value: string
  ) => {
    if (internalDate) {
      const newDate = new Date(internalDate);
      if (type === "hour") {
        newDate.setHours(
          (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0)
        );
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      } else if (type === "ampm") {
        const currentHours = newDate.getHours();
        newDate.setHours(
          value === "PM" ? currentHours + 12 : currentHours - 12
        );
      }
      setInternalDate(newDate);
      const formatted = format(newDate, "MM/dd/yyyy hh:mm aa");
      field.onChange(formatted);
    }
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !internalDate && "text-muted-foreground"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {internalDate ? (
                format(internalDate, "MM/dd/yyyy hh:mm aa")
              ) : (
                <span>MM/DD/YYYY hh:mm aa</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <div className="sm:flex">
              <Calendar
                mode="single"
                selected={internalDate}
                onSelect={handleDateSelect}
                initialFocus
              />
              <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                <ScrollArea className="w-64 sm:w-auto">
                  <div className="flex sm:flex-col p-2">
                    {hours.reverse().map((hour) => (
                      <Button
                        key={hour}
                        size="icon"
                        variant={
                          internalDate &&
                          internalDate.getHours() % 12 === hour % 12
                            ? "default"
                            : "ghost"
                        }
                        className="sm:w-full shrink-0 aspect-square"
                        onClick={() =>
                          handleTimeChange("hour", hour.toString())
                        }
                      >
                        {hour}
                      </Button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" className="sm:hidden" />
                </ScrollArea>
                <ScrollArea className="w-64 sm:w-auto">
                  <div className="flex sm:flex-col p-2">
                    {Array.from({ length: 12 }, (_, i) => i * 5).map(
                      (minute) => (
                        <Button
                          key={minute}
                          size="icon"
                          variant={
                            internalDate && internalDate.getMinutes() === minute
                              ? "default"
                              : "ghost"
                          }
                          className="sm:w-full shrink-0 aspect-square"
                          onClick={() =>
                            handleTimeChange("minute", minute.toString())
                          }
                        >
                          {minute}
                        </Button>
                      )
                    )}
                  </div>
                  <ScrollBar orientation="horizontal" className="sm:hidden" />
                </ScrollArea>
                <ScrollArea className="">
                  <div className="flex sm:flex-col p-2">
                    {["AM", "PM"].map((ampm) => (
                      <Button
                        key={ampm}
                        size="icon"
                        variant={
                          internalDate &&
                          ((ampm === "AM" && internalDate.getHours() < 12) ||
                            (ampm === "PM" && internalDate.getHours() >= 12))
                            ? "default"
                            : "ghost"
                        }
                        className="sm:w-full shrink-0 aspect-square"
                        onClick={() => handleTimeChange("ampm", ampm)}
                      >
                        {ampm}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </FormControl>
      {fieldError?.message && (
        <FormMessage className="text-red-500 text-xs">
          {fieldError.message}
        </FormMessage>
      )}
    </FormItem>
  );
}
