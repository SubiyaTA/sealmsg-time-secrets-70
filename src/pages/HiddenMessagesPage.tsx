
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/context/MessageContext";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ArrowLeft, Eye, Lock } from "lucide-react";

const HiddenMessagesPage = () => {
  const { user } = useAuth();
  const { hiddenMessages, chats, checkHiddenSectionPassword } = useMessages();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleBackClick = () => {
    navigate("/chats");
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (checkHiddenSectionPassword(password)) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
      toast({
        title: "Authentication Failed",
        description: "Incorrect password for hidden section",
        variant: "destructive",
      });
    }
  };
  
  // Get chat participant name from the chat ID
  const getParticipantName = (receiverId: string) => {
    const chat = chats.find(c => c.participantId === receiverId);
    return chat?.participantName || "Unknown";
  };
  
  // Group messages by chat/participant
  const groupedMessages = hiddenMessages.reduce<Record<string, typeof hiddenMessages>>((acc, message) => {
    const key = message.receiverId;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(message);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBackClick}
          className="mr-1"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="font-semibold">Hidden Messages</h2>
          <p className="text-xs text-muted-foreground">
            View your disappeared messages
          </p>
        </div>
      </header>
      
      {/* Content */}
      <div className="container max-w-md mx-auto p-4">
        {!isAuthenticated ? (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <span>Hidden Section</span>
              </CardTitle>
              <CardDescription>
                Enter your hidden section password to access disappeared messages
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    type="password"
                    placeholder="Enter your hidden section password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={error ? "border-destructive" : ""}
                  />
                  {error && (
                    <p className="text-destructive text-sm mt-1">{error}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Unlock</Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <div className="space-y-6 mt-4">
            {Object.keys(groupedMessages).length > 0 ? (
              Object.entries(groupedMessages).map(([receiverId, messages]) => (
                <div key={receiverId} className="bg-secondary/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        {getParticipantName(receiverId).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold">{getParticipantName(receiverId)}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div key={message.id} className="bg-secondary p-3 rounded-lg">
                        <p>{message.text}</p>
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span>
                            Disappeared: {format(new Date(message.hideAfter || 0), "MMM d, yyyy h:mm a")}
                          </span>
                          <span>
                            Sent: {format(new Date(message.timestamp), "MMM d, yyyy h:mm a")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No hidden messages</h3>
                <p className="text-muted-foreground mt-1">
                  Messages that disappear will appear here
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HiddenMessagesPage;
