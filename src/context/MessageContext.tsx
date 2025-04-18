
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

type Message = {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp: number;
  isHidden: boolean;
  hideAfter: number | null; // timestamp when message should hide
};

type Chat = {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  unreadCount: number;
};

type MessageContextType = {
  chats: Chat[];
  messages: Record<string, Message[]>;
  hiddenMessages: Message[];
  currentChat: string | null;
  setCurrentChat: (chatId: string | null) => void;
  sendMessage: (text: string, receiverId: string, hideAfter: number | null) => void;
  checkHiddenSectionPassword: (password: string) => boolean;
};

const MessageContext = createContext<MessageContextType | undefined>(undefined);

// Mock data
const mockChats: Chat[] = [
  {
    id: 'chat1',
    participantId: 'user1',
    participantName: 'Alice',
    lastMessage: 'Hey, how are you?',
    unreadCount: 2,
  },
  {
    id: 'chat2',
    participantId: 'user2',
    participantName: 'Bob',
    lastMessage: 'Can we meet tomorrow?',
    unreadCount: 0,
  },
  {
    id: 'chat3',
    participantId: 'user3',
    participantName: 'Charlie',
    lastMessage: 'That sounds great!',
    unreadCount: 5,
  },
];

const mockMessages: Record<string, Message[]> = {
  chat1: [
    {
      id: 'm1',
      text: 'Hey, how are you?',
      senderId: 'user1',
      receiverId: 'currentUser',
      timestamp: Date.now() - 3600000,
      isHidden: false,
      hideAfter: null,
    },
    {
      id: 'm2',
      text: 'I\'m good, thanks! How about you?',
      senderId: 'currentUser',
      receiverId: 'user1',
      timestamp: Date.now() - 3500000,
      isHidden: false,
      hideAfter: null,
    },
    {
      id: 'm3',
      text: 'This is a secret message that will disappear',
      senderId: 'user1',
      receiverId: 'currentUser',
      timestamp: Date.now() - 3400000,
      isHidden: true,
      hideAfter: Date.now() - 1000000,
    },
  ],
  chat2: [
    {
      id: 'm4',
      text: 'Can we meet tomorrow?',
      senderId: 'user2',
      receiverId: 'currentUser',
      timestamp: Date.now() - 86400000,
      isHidden: false,
      hideAfter: null,
    },
    {
      id: 'm5',
      text: 'Sure, what time works for you?',
      senderId: 'currentUser',
      receiverId: 'user2',
      timestamp: Date.now() - 80000000,
      isHidden: false,
      hideAfter: null,
    },
  ],
};

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [hiddenMessages, setHiddenMessages] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);

  // Load stored messages when component mounts
  useEffect(() => {
    const storedMessages = localStorage.getItem('sealMsgMessages');
    const storedChats = localStorage.getItem('sealMsgChats');
    const storedHiddenMessages = localStorage.getItem('sealMsgHiddenMessages');
    
    if (storedMessages) setMessages(JSON.parse(storedMessages));
    if (storedChats) setChats(JSON.parse(storedChats));
    if (storedHiddenMessages) setHiddenMessages(JSON.parse(storedHiddenMessages));
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem('sealMsgMessages', JSON.stringify(messages));
    localStorage.setItem('sealMsgChats', JSON.stringify(chats));
    localStorage.setItem('sealMsgHiddenMessages', JSON.stringify(hiddenMessages));
  }, [messages, chats, hiddenMessages]);

  // Check for messages that should be hidden based on timer
  useEffect(() => {
    const checkHiddenMessages = () => {
      const now = Date.now();
      let messagesUpdated = false;
      
      const updatedMessages = { ...messages };
      
      // Check each chat's messages
      Object.keys(updatedMessages).forEach(chatId => {
        updatedMessages[chatId] = updatedMessages[chatId].map(message => {
          // If message has a hide timer and it's time to hide it
          if (message.hideAfter && message.hideAfter <= now && !message.isHidden) {
            messagesUpdated = true;
            // Add to hidden messages
            setHiddenMessages(prev => [...prev, { ...message, isHidden: true }]);
            // Mark as hidden
            return { ...message, isHidden: true };
          }
          return message;
        });
      });
      
      if (messagesUpdated) {
        setMessages(updatedMessages);
      }
    };
    
    // Check every second
    const interval = setInterval(checkHiddenMessages, 1000);
    return () => clearInterval(interval);
  }, [messages]);

  const sendMessage = (text: string, receiverId: string, hideAfter: number | null) => {
    if (!user || !currentChat) return;
    
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      senderId: user.id,
      receiverId,
      timestamp: Date.now(),
      isHidden: false,
      hideAfter: hideAfter ? Date.now() + hideAfter : null,
    };
    
    // Update messages for current chat
    setMessages(prev => ({
      ...prev,
      [currentChat]: [...(prev[currentChat] || []), newMessage],
    }));
    
    // Update last message in chat list
    setChats(prev =>
      prev.map(chat =>
        chat.id === currentChat
          ? { ...chat, lastMessage: text }
          : chat
      )
    );
  };

  const checkHiddenSectionPassword = (password: string): boolean => {
    return user?.hiddenSectionPassword === password;
  };

  return (
    <MessageContext.Provider
      value={{
        chats,
        messages,
        hiddenMessages,
        currentChat,
        setCurrentChat,
        sendMessage,
        checkHiddenSectionPassword,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
