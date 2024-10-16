import { useAuth } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const EditChallenge: React.FC = () => {
  const { getChallenges, updateChallenge } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [points, setPoints] = useState(0);
  const [category, setCategory] = useState("web");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [flag, setFlag] = useState("");

  const id = new URLSearchParams(location.search).get("id");

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const challenges = await getChallenges();
        console.log(challenges);
        const challenge = challenges
          .flatMap((c) => c.challenges)
          .find((c) => c.id === id);

        if (challenge) {
          setName(challenge.name);
          setDescription(challenge.description);
          setUrl(challenge.url);
          setPoints(challenge.points);
          setCategory(challenge.category);
          setAuthor(challenge.author);
          setFlag(challenge.flag || "");
          setDate(challenge.date || "");
        }
      } catch (error) {
        console.error("Failed to fetch challenge:", error);
      }
    };

    if (id) {
      fetchChallenge();
    }
  }, [id, getChallenges]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateChallenge(id!, {
        name,
        description,
        url,
        points,
        category,
        author,
        flag,
        date,
      });
      navigate("/challenges");
    } catch (error) {
      console.error("Challenge update failed:", error);
    }
  };

  return (
    <Card className="mx-auto mt-8 w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Edit Challenge
        </CardTitle>
        <CardDescription className="text-zinc-600 dark:text-zinc-400">
          Update the challenge details below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Challenge Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter the challenge name"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="url"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              URL
            </label>
            <Input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter the challenge URL"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="points"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Points
            </label>
            <Input
              id="points"
              type="number"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              placeholder="Enter points for the challenge"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Category
            </label>
            <Select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full"
            >
              <option value="reversing">Reversing</option>
              <option value="osint">OSINT</option>
              <option value="pwn">PWN</option>
              <option value="web">Web</option>
              <option value="forensics">Forensics</option>
              <option value="crypto">Crypto</option>
              <option value="stego">Stego</option>
            </Select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="author"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Author
            </label>
            <Input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter the author's name"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="date"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Date
            </label>
            <Input
              id="date"
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Enter the date"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="flag"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Flag
            </label>
            <Input
              id="flag"
              type="text"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              placeholder="Enter the flag"
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full">
            Update Challenge
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Want to see all challenges?{" "}
          <Link
            to="/challenges"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            View challenges here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
