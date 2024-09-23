import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

type User = {
  rank: number;
  name: string;
  points: number;
  userId: string;
};

export const LeaderBoard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(
          "http://localhost:8787/api/challenges/leaderboard",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }

        const data = await response.json();

        const leaderboard = data.leaderboard.map(
          (
            user: { userId: string; username: string; totalPoints: number },
            index: number,
          ) => ({
            rank: index + 1,
            name: user.username,
            points: user.totalPoints,
            userId: user.userId,
          }),
        );

        setLeaderboardData(leaderboard);
      } catch (err) {
        setError(`${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div>Loading leaderboard...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        Leaderboard
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboardData.map((user) => (
            <TableRow key={user.rank}>
              <TableCell className="dark:text-zinc-300">{user.rank}</TableCell>
              <TableCell>
                <Link
                  to={`/personal/${user.userId}`}
                  className="text-blue-500 underline"
                >
                  {user.name}
                </Link>
              </TableCell>
              <TableCell className="dark:text-zinc-300">{user.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
