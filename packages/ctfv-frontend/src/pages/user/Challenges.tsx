import { Loader2, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../AuthContext";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { getBackendURL } from "../../lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

type Challenge = {
  id: string;
  name: string;
  description: string;
  url: string;
  points: number;
  author: string;
  flag: string | null;
  solved: boolean;
};

type CategoryChallenges = {
  category: string;
  challenges: Challenge[];
};

type Submission = {
  username: string;
  timestamp: string;
  challengeName: string;
  challengeDescription: string;
  isCorrect: boolean;
};

export const Challenges: React.FC = () => {
  const [categories, setCategories] = useState<CategoryChallenges[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [flagInput, setFlagInput] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const { user, deleteChallenge } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(getBackendURL() + "/api/challenges/read", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data.challenges);
        } else {
          setError("Failed to fetch challenges. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching challenges:", error);
        setError(
          "An error occurred while fetching challenges. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const openDialog = async (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setFlagInput("");
    setSubmissionStatus(null);

    try {
      const response = await fetch(
        getBackendURL() + `/api/submissions/readbychallengeid/${challenge.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSubmissions(
          data
            .filter((submission: Submission) => submission.isCorrect)
            .sort((a: Submission, b: Submission) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )
        );
      } else {
        console.error("Failed to fetch submissions");
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const handleFlagSubmission = async () => {
    if (!selectedChallenge) return;
    if (!flagInput || !flagInput.trim()) return;
    if (submissionStatus === "correct") return;

    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      const response = await fetch(
        getBackendURL() + `/api/challenges/submit/${selectedChallenge.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ flag: flagInput }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.submission.isCorrect) {
          setSubmissionStatus("correct");
          setCategories((prevCategories) =>
            prevCategories.map((category) => ({
              ...category,
              challenges: category.challenges.map((challenge) =>
                challenge.id === selectedChallenge.id
                  ? { ...challenge, solved: true }
                  : challenge
              ),
            }))
          );
        } else {
          setSubmissionStatus("incorrect");
        }
      } else {
        setSubmissionStatus("error");
      }
    } catch (error) {
      console.error("Error submitting flag:", error);
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteChallenge = async () => {
    if (!selectedChallenge) return;
    setIsDeleting(true);

    try {
      await deleteChallenge(selectedChallenge.id);
      setCategories((prevCategories) =>
        prevCategories.map((category) => ({
          ...category,
          challenges: category.challenges.filter(
            (challenge) => challenge.id !== selectedChallenge.id
          ),
        }))
      );
      setSelectedChallenge(null);
    } catch (error) {
      console.error("Error deleting challenge:", error);
      setError("Failed to delete the challenge. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading challenges...</span>
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
        Challenges
      </h1>

      {categories.map((category) => (
        <div key={category.category} className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {category.category}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {category.challenges.map((challenge) => (
              <Dialog key={challenge.id}>
                <DialogTrigger asChild>
                  <Card
                    className={`cursor-pointer border-none text-center shadow-custom transition-shadow duration-300 hover:shadow-hover-custom dark:hover:shadow-dark-hover ${
                      challenge.solved
                        ? "bg-green-400 dark:bg-green-600"
                        : "dark:bg-zinc-700"
                    }`}
                    onClick={() => openDialog(challenge)}
                  >
                    <CardHeader>
                      <CardTitle>{challenge.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{challenge.points} points</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{selectedChallenge?.name}</DialogTitle>
                  </DialogHeader>

                  <Tabs defaultValue="details">
                    <TabsList>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="submissions">Submissions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                      <DialogDescription>
                        <p>{selectedChallenge?.description}</p>
                        <p>
                          <strong>Points:</strong> {selectedChallenge?.points}
                        </p>
                        <p>
                          <strong>Author:</strong> {selectedChallenge?.author}
                        </p>
                        <p>
                          <strong>Challenge Link:</strong>{" "}
                          {selectedChallenge?.url}
                        </p>
                        {user?.isAdmin && (
                          <>
                            <p>
                              <strong>Flag:</strong> {selectedChallenge?.flag}
                            </p>
                            <div className="my-4 flex space-x-2">
                              <Button asChild>
                                <Link
                                  to={`/admin/challenges/edit?id=${selectedChallenge?.id}`}
                                >
                                  Edit Challenge
                                </Link>
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleDeleteChallenge}
                                disabled={isDeleting}
                              >
                                {isDeleting ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                                Delete
                              </Button>
                            </div>
                          </>
                        )}
                      </DialogDescription>
                      {!user?.isAdmin && (
                        <div className="my-4">
                          <Input
                            value={flagInput}
                            onChange={(e) =>
                              setFlagInput(e.target.value)
                            }
                            placeholder="Enter flag"
                          />
                          <Button
                            className="mt-2 w-full"
                            onClick={handleFlagSubmission}
                            disabled={isSubmitting || !flagInput}
                          >
                            {isSubmitting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Submit"
                            )}
                          </Button>
                          {submissionStatus === "correct" && (
                            <p className="mt-2 text-green-500">
                              Correct flag! 🎉
                            </p>
                          )}
                          {submissionStatus === "incorrect" && (
                            <p className="mt-2 text-red-500">
                              Incorrect flag. Try again.
                            </p>
                          )}
                          {submissionStatus === "error" && (
                            <p className="mt-2 text-red-500">
                              Error submitting flag. Please try again.
                            </p>
                          )}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="submissions">
                    <div className="max-h-96 overflow-auto">
                        {submissions.length === 0 ? (
                          <p>No submissions found.</p>
                        ) : (
                          <table className="min-w-full text-center">
                            <thead className="sticky top-0 bg-white dark:bg-gray-800">
                              <tr>
                                <th className="border px-4 py-2">Username</th>
                                <th className="border px-4 py-2">Timestamp</th>
                              </tr>
                            </thead>
                            <tbody>
                              {submissions.map((submission, index) => (
                                <tr key={index}>
                                  <td className="border px-4 py-2">
                                    {submission.username}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {new Date(
                                      submission.timestamp
                                    ).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
