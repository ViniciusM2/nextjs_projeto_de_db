"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function AppBar() {
  const { isLoggedIn, userEmail, logout } = useAuth();

  if (!isLoggedIn || !userEmail) return null;

  return (
    <div className="flex items-center space-x-4 p-4">
      <div className="grow"></div>
      <div className="flex items-center space-x-2">
        <Avatar>
          <AvatarImage
            src={`https://www.gravatar.com/avatar/${userEmail}?d=mp`}
          />
          <AvatarFallback>{userEmail[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{userEmail}</span>
      </div>
      <Button variant="outline" size="sm" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}
