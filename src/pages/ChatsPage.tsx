
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/context/MessageContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { LogOut, Lock, MessageSquare, Search } from "lucide-react";

const ChatsPage = () => {
  const { logout, user } = useAuth();
  const { chats, setCurrentChat } = useMessages();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredChats = chats.filter(chat => 
    chat.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleChatClick = (chatId: string) => {
    setCurrentChat(chatId);
    navigate(`/chat/${chatId}`);
  };
  
  const handleHiddenSectionClick = () => {
    navigate("/hidden");
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">SealMsg</h1>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleHiddenSectionClick}
            className="text-primary"
          >
            <Lock className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => logout()}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      {/* User Info */}
      <div className="p-4 bg-secondary/50">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>
      </div>
      
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full pl-10 py-2 bg-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className="p-4 hover:bg-secondary/30 cursor-pointer transition-colors"
                onClick={() => handleChatClick(chat.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {chat.participantName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold truncate">{chat.participantName}</h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {/* This would be the timestamp of the last message in a real app */}
                        {formatDistanceToNow(new Date(Date.now() - Math.random() * 1000000000), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <Badge className="bg-primary text-primary-foreground">
                      {chat.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-4 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No chats found</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm ? "Try a different search term" : "Start a new conversation"}
            </p>
          </div>
        )}
      </div>
      
      {/* New Chat Button */}
      <div className="p-4 border-t border-border">
        <Button className="w-full">New Chat</Button>
      </div>
    </div>
  );
};

export default ChatsPage;
