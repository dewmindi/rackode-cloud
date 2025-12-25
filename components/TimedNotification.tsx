
import { useState, useEffect } from "react";
import { X, Zap } from "lucide-react";
import { Button, Card } from "./UI";
import { useRouter } from "next/navigation";


export const TimedNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 5000); // Show after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleViewPlans = () => {
    setShowNotification(false);
    router.push("/plans");
  };

  const handleClose = () => {
    setShowNotification(false);
  };

  if (!showNotification) return null;

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 animate-in slide-in-from-top-2 duration-500">
      <Card className="w-full sm:w-80 max-w-sm p-4 shadow-lg border-2 bg-background ml-auto">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">New Release!</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-1">KVM VPS Plans Now Available!</h3>
          <p className="text-sm text-muted-foreground">
            Experience enhanced performance with our new KVM virtualization technology. Starting from just $10.96/year with full root access.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleViewPlans} className="flex-1 bg-primary hover:bg-primary/90">
            View Plans
          </Button>
          <Button variant="outline" onClick={handleClose} className="px-4">
            Later
          </Button>
        </div>
      </Card>
    </div>
  );
};
