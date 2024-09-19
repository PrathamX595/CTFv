import React from "react";

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
};

const leaderboardData: User[] = [
  { rank: 1, name: "Sagnik Mandal (critick)", points: 500 },
  { rank: 2, name: "Sagnik Mandal (critick)", points: 100 },
];

export const LeaderBoard: React.FC = () => {
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
              <TableCell>{user.rank}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
