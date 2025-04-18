
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/context/MessageContext";
import { format } from "date-fns";
import { ArrowLeft, Clock, Send } from "lucide-react";

const ChatDetailPage = () => {
  const { chatId } = useParams();
  const { user } = useAuth();
  const { messages, sendMessage, chats } = useMessages();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [hideTimer, setHideTimer] = useState<number | null>(null);
  const [showHideOptions, setShowHideOptions] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const currentChat = chats.find(chat => chat.id === chatId);
  const chatMessages = chatId ? messages[chatId] || [] : [];
  
  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);
  
  if (!chatId || !currentChat) {
    navigate("/chats");
    return null;
  }
  
  const handleBackClick = () => {
    navigate("/chats");
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    sendMessage(newMessage, currentChat.participantId, hideTimer);
    setNewMessage("");
    setHideTimer(null);
    setShowHideOptions(false);
  };
  
  const formatMessageTime = (timestamp: number) => {
    return format(new Date(timestamp), "h:mm a");
  };
  
  const formatHideTimer = (milliseconds: number) => {
    if (milliseconds < 60000) {
      return `${Math.round(milliseconds / 1000)}s`;
    } else if (milliseconds < 3600000) {
      return `${Math.round(milliseconds / 60000)}m`;
    } else if (milliseconds < 86400000) {
      return `${Math.round(milliseconds / 3600000)}h`;
    } else {
      return `${Math.round(milliseconds / 86400000)}d`;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Chat Header */}
      <header className="border-b border-border p-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBackClick}
          className="mr-1"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar>
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            {currentChat.participantName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-semibold">{currentChat.participantName}</h2>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
      </header>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message) => {
          const isSentByMe = message.senderId === user?.id;
          
          // Skip showing hidden messages unless they were sent by the current user
          if (message.isHidden && !isSentByMe) return null;
          
          return (
            <div
              key={message.id}
              className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  ${isSentByMe ? "chat-bubble-sent" : "chat-bubble-received"}
                  ${message.isHidden ? "opacity-50" : ""}
                `}
              >
                <p>{message.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  {message.hideAfter && (
                    <Clock className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatMessageTime(message.timestamp)}
                  </span>
                </div>
                
                {message.hideAfter && (
                  <div className="mt-1 text-xs text-muted-foreground italic">
                    {message.isHidden
                      ? "This message is hidden"
                      : `Hides ${formatDistanceToNow(new Date(message.hideAfter))}`}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>
      
      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Popover open={showHideOptions} onOpenChange={setShowHideOptions}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant={hideTimer ? "default" : "outline"}
                size="icon"
                className={hideTimer ? "bg-primary text-primary-foreground" : ""}
              >
                <Clock className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Set message visibility timer</h4>
                <p className="text-sm text-muted-foreground">
                  Message will disappear after the selected time
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Timer:</span>
                    <span className="text-sm font-medium">
                      {hideTimer ? formatHideTimer(hideTimer) : "Off"}
                    </span>
                  </div>
                  
                  <Slider
                    value={[hideTimer || 0]}
                    min={0}
                    max={86400000} // 24 hours
                    step={60000} // 1 minute
                    onValueChange={(value) => setHideTimer(value[0] || null)}
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Off</span>
                    <span>1m</span>
                    <span>1h</span>
                    <span>24h</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setHideTimer(null);
                      setShowHideOptions(false);
                    }}
                  >
                    Turn Off
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowHideOptions(false)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        
        {hideTimer && (
          <div className="mt-2 text-xs flex items-center gap-1 text-primary">
            <Clock className="h-3 w-3" />
            <span>Message will disappear after {formatHideTimer(hideTimer)}</span>
          </div>
        )}
      </form>
    </div>
  );
};

// Helper function for time formatting
function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return "now";
  }
  
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) {
    return `in ${seconds} second${seconds !== 1 ? "s" : ""}`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `in ${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `in ${hours} hour${hours !== 1 ? "s" : ""}`;
  }
  
  const days = Math.floor(hours / 24);
  return `in ${days} day${days !== 1 ? "s" : ""}`;
}

export default ChatDetailPage;
