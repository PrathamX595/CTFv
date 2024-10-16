import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBackendURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type User = {
  email: string;
  rank: number;
  name: string;
  points: number;
  userId: string;
};

export const LeaderBoard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          getBackendURL() + "/api/challenges/leaderboard",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Login to view the leaderboard");
          } else {
            throw new Error("Failed to fetch leaderboard");
          }
        }

        const data = await response.json();

        const leaderboard = data.leaderboard.map(
          (
            user: {
              userId: string;
              username: string;
              totalPoints: number;
              email: string;
            },
            index: number,
          ) => ({
            rank: index + 1,
            name: user.username,
            points: user.totalPoints,
            userId: user.userId,
            email: user.email,
          }),
        );

        setLeaderboardData(leaderboard);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Error fetching leaderboard:", err);
        setError(
          "Error fetching leaderboard: " + (err.message || "An error occurred"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading leaderboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        Leaderboard
      </h1>
      {leaderboardData.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Name</TableHead>
              {leaderboardData[0].email && <TableHead>Email</TableHead>}
              <TableHead>Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((user) => (
              <TableRow key={user.rank}>
                <TableCell className="dark:text-zinc-300">
                  {user.rank}
                </TableCell>
                <TableCell>
                  <Link
                    to={`/personal/${user.userId}`}
                    className="text-blue-500 hover:underline dark:text-blue-400"
                  >
                    {user.name}
                  </Link>
                </TableCell>
                {user.email && (
                  <TableCell className="dark:text-zinc-300">
                    {user.email}
                  </TableCell>
                )}
                <TableCell className="dark:text-zinc-300">
                  {user.points}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center text-zinc-600 dark:text-zinc-400">
          No submissions yet, be the first one to submit!
        </p>
      )}
    </div>
  );
};
