import React from "react";
import { CalendarDays, Shield, Award, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 text-center">
      Welcome to Daily Challenges
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarDays className="mr-2" />
            Daily Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-700 dark:text-zinc-300">
            Every day, a new challenge is released. Be the first to solve it.
          </p>
          <Button className="mt-4" onClick={() => navigate("/challenges")}>
            View All Challenges
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-700 dark:text-zinc-300">
            Compete with other participants and climb the ranks.
          </p>
          <Button className="mt-4" onClick={() => navigate("/leaderboard")}>
            Check Leaderboard
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>

    <Alert>
      <AlertTitle className="flex items-center">
      <Shield className="h-4 w-4 mr-2" />
      Competition Rules
        </AlertTitle>
      <AlertDescription>
        <ul className="list-disc list-inside mt-2">
          <li>Do not attack the competition infrastructure. DDoSing is strictly prohibited.</li>
          <li>Brute-forcing flags is not allowed, and not the intended way to solve challenges.</li>
          <li>Solve challenges independently. Sharing flags is prohibited.</li>
          <li>If you encounter any issues, contact the organizers immediately.</li>
        </ul>
      </AlertDescription>
    </Alert>
  </div>
);
};
