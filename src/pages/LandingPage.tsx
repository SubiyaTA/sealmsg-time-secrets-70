
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Clock, Lock, MessageSquare } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col">
      {/* Hero Section */}
      <header className="container mx-auto pt-20 pb-12 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            SealMsg
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Secure messaging with timed disappearing messages.
            Take control of your privacy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-primary hover:bg-primary/90 text-lg py-6 px-8"
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              className="text-lg py-6 px-8 border-primary text-primary hover:bg-primary/10"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        </motion.div>
      </header>

      {/* Feature Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose <span className="text-primary">SealMsg</span>?
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<MessageSquare className="w-10 h-10 text-primary" />}
            title="Familiar Chat"
            description="Enjoy a familiar chat experience similar to your favorite messaging apps."
          />
          <FeatureCard 
            icon={<Clock className="w-10 h-10 text-primary" />}
            title="Timed Messages"
            description="Set custom timers for when messages should disappear."
          />
          <FeatureCard 
            icon={<Lock className="w-10 h-10 text-primary" />}
            title="Hidden Section"
            description="Access your hidden messages with a secure password."
          />
          <FeatureCard 
            icon={<Shield className="w-10 h-10 text-primary" />}
            title="Privacy First"
            description="Your privacy is our priority with end-to-end encrypted messages."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto py-16 px-4 bg-secondary/50 rounded-lg my-10">
        <h2 className="text-3xl font-bold text-center mb-12">
          How It Works
        </h2>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            <Step 
              number={1} 
              title="Sign Up"
              description="Create your account with a username and password. Set a separate password for your hidden messages section."
            />
            <Step 
              number={2} 
              title="Start Chatting"
              description="Send messages to your contacts just like any other messaging app."
            />
            <Step 
              number={3} 
              title="Set Timers"
              description="Choose which messages should disappear and set a custom timer for when they should hide."
            />
            <Step 
              number={4} 
              title="Access Hidden Messages"
              description="Use your hidden section password to access your disappeared messages anytime."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-400">
        <p>© 2025 SealMsg. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Helper Components
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <motion.div 
      className="bg-secondary p-6 rounded-lg"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
};

const Step = ({ number, title, description }: { number: number; title: string; description: string }) => {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default LandingPage;
