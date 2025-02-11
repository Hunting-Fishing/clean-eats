
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8"
};

export function LoadingSpinner({ 
  size = "md", 
  message, 
  className 
}: LoadingSpinnerProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-4 space-y-2",
      className
    )}>
      <Loader2 className={cn(
        sizeClasses[size],
        "animate-spin text-primary"
      )} />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
