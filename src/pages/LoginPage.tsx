
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Lock, LogIn, UserPlus } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  
  // Login form state
  const [loginForm, setLoginForm] = useState({
    name: "",
    password: "",
  });
  
  // Signup form state
  const [signupForm, setSignupForm] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    hiddenSectionPassword: "",
    confirmHiddenPassword: "",
  });
  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!loginForm.name || !loginForm.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // In a real app, we'd verify against stored credentials
      // For demo, we'll just use whatever is entered
      await login(loginForm.name, loginForm.password, "password123");
      
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login. Please check your credentials.",
        variant: "destructive",
      });
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (
      !signupForm.name ||
      !signupForm.password ||
      !signupForm.confirmPassword ||
      !signupForm.hiddenSectionPassword ||
      !signupForm.confirmHiddenPassword
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    if (signupForm.hiddenSectionPassword !== signupForm.confirmHiddenPassword) {
      toast({
        title: "Error",
        description: "Hidden section passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await login(signupForm.name, signupForm.password, signupForm.hiddenSectionPassword);
      
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">SealMsg</h1>
          <p className="text-gray-400">Secure messaging with timed disappearing messages</p>
        </div>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="text-base">Login</TabsTrigger>
            <TabsTrigger value="signup" className="text-base">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  <span>Login to your account</span>
                </CardTitle>
                <CardDescription>Enter your username and password to access your account</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Username</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="Enter your username" 
                      value={loginForm.name}
                      onChange={handleLoginChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      placeholder="Enter your password" 
                      value={loginForm.password}
                      onChange={handleLoginChange}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">Login</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  <span>Create a new account</span>
                </CardTitle>
                <CardDescription>Set up your account details including a separate password for hidden messages</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Username</Label>
                    <Input 
                      id="signup-name" 
                      name="name" 
                      placeholder="Choose a username" 
                      value={signupForm.name}
                      onChange={handleSignupChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      name="password" 
                      type="password" 
                      placeholder="Create a password" 
                      value={signupForm.password}
                      onChange={handleSignupChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input 
                      id="confirm-password" 
                      name="confirmPassword" 
                      type="password" 
                      placeholder="Confirm your password" 
                      value={signupForm.confirmPassword}
                      onChange={handleSignupChange}
                    />
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2 mb-4">
                      <Lock className="h-4 w-4 text-primary" />
                      <h3 className="font-medium">Hidden Section Password</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      This separate password will be used to access your hidden messages section.
                    </p>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hidden-password">Hidden Section Password</Label>
                      <Input 
                        id="hidden-password" 
                        name="hiddenSectionPassword" 
                        type="password" 
                        placeholder="Create a password for hidden messages" 
                        value={signupForm.hiddenSectionPassword}
                        onChange={handleSignupChange}
                      />
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="confirm-hidden-password">Confirm Hidden Section Password</Label>
                      <Input 
                        id="confirm-hidden-password" 
                        name="confirmHiddenPassword" 
                        type="password" 
                        placeholder="Confirm hidden section password" 
                        value={signupForm.confirmHiddenPassword}
                        onChange={handleSignupChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">Create Account</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center">
          <Button 
            variant="link" 
            className="text-primary"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
