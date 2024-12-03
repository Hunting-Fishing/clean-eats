import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { AssistantHeader } from "./AssistantHeader";
import { AIVisualization } from "./AIVisualization";
import { HealthDataView } from "./health-analysis/HealthDataView";
import { useConversation } from "./useConversation";
import { useToast } from "@/hooks/use-toast";
import { useAI } from "./AIContext";
import { Loader2, Search, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function AIAssistant() {
  const { message, setMessage, sendMessage, messages, isLoading, retryMessage } = useConversation();
  const { assistantType } = useAI();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showFilters, setShowFilters] = React.useState(false);
  const [filterType, setFilterType] = React.useState<"all" | "user" | "ai">("all");
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Virtualized list for performance
  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 100,
    overscan: 5
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowFilters(false);
      }
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        setShowFilters(true);
      }
      // Add arrow key navigation for messages
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const messageElements = document.querySelectorAll('[role="listitem"]');
        const currentFocus = document.activeElement;
        const currentIndex = Array.from(messageElements).indexOf(currentFocus as Element);
        
        if (currentIndex !== -1) {
          e.preventDefault();
          const nextIndex = e.key === 'ArrowUp' ? 
            Math.max(0, currentIndex - 1) : 
            Math.min(messageElements.length - 1, currentIndex + 1);
          (messageElements[nextIndex] as HTMLElement).focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    try {
      await sendMessage();
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Failed to send message. Click to retry.",
        variant: "destructive",
        action: (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => retryMessage()}
            aria-label="Retry sending message"
          >
            Retry
          </Button>
        ),
      });
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" ? true : msg.role === filterType;
    return matchesSearch && matchesType;
  });

  if (assistantType === 'health-analysis') {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-6xl mx-auto p-4 animate-fade-in">
        <Card className="flex-1 p-6 space-y-4 overflow-hidden shadow-lg border-2 bg-gradient-to-b from-gray-900/50 to-black/50">
          <AssistantHeader />
          <AIVisualization />
          <HealthDataView />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-4 animate-fade-in">
      <Card className="flex-1 p-6 space-y-4 overflow-hidden shadow-lg border-2 bg-gradient-to-b from-gray-900/50 to-black/50 relative">
        <AssistantHeader />
        <AIVisualization />
        
        <div className="flex flex-col h-full space-y-4">
          {showFilters && (
            <div className="flex items-center gap-2 p-2 bg-background/95 rounded-lg animate-fade-in">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
                aria-label="Search messages"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      filterType !== "all" && "text-primary"
                    )}
                    aria-label="Filter messages"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterType("all")}>
                    All Messages
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("user")}>
                    User Messages
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("assistant")}>
                    AI Responses
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(false)}
                aria-label="Close search"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div 
            ref={containerRef}
            className="flex-1 overflow-auto"
            role="log"
            aria-label="Message history"
            aria-live="polite"
          >
            <MessageList 
              messages={filteredMessages}
              virtualizer={rowVirtualizer}
            />
          </div>
          
          <div className="pt-4 border-t border-gray-800">
            <MessageInput
              message={message}
              onChange={setMessage}
              onSend={handleSend}
              isLoading={isLoading}
            />
          </div>
        </div>

        {isLoading && (
          <div 
            className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300"
            role="progressbar"
            aria-label="Processing request"
          >
            <div className="bg-background/95 p-4 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing your request...</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}