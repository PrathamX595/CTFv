import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

type SolvedChallenge = {
  challengeId: string;
  challengeName: string;
  points: number;
  solvedTime: string;
};

type UserData = {
  rank: number;
  username: string;
  totalPoints: number;
  solvedChallenges: SolvedChallenge[];
};

const Personal: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8787/api/challenges/personal/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8">
      {userData && (
        <>
          <div className="flex flex-col items-center mb-8 dark:text-zinc-300">
            <h1 className="text-4xl font-bold mb-2">
              {userData.username}</h1>
            <h2 className="text-xl mb-2">Rank: {userData.rank}</h2>
            <h2 className="text-xl mb-4">Total Points: {userData.totalPoints}</h2>
          </div>

          <h2 className="mb-4 text-xl font-semibold dark:text-zinc-300">Solves</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Challenge Name</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Solved At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userData.solvedChallenges.map((challenge) => (
                <TableRow key={challenge.challengeId} className="dark:text-zinc-300">
                  <TableCell>{challenge.challengeName}</TableCell>
                  <TableCell>{challenge.points}</TableCell>
                  <TableCell>
                    {new Date(challenge.solvedTime).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default Personal;
