import { useAuth } from "@/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBackendURL } from "@/lib/utils";
import { Loader2, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import remarkGfm from "remark-gfm";

type Challenge = {
  id: string;
  name: string;
  description: string;
  url: string;
  points: number;
  author: string;
  date: string;
  flag: string | null;
  solved: boolean;
};

type CategoryChallenges = {
  category: string;
  challenges: Challenge[];
};

type Submission = {
  userId: string;
  username: string;
  timestamp: string;
  challengeName: string;
  challengeDescription: string;
  isCorrect: boolean;
};

const LoadingSpinner: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex h-screen items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin" />
    <span className="ml-2">Loading {message}...</span>
  </div>
);

const ErrorAlert: React.FC<{ message: string }> = ({ message }) => (
  <Alert variant="destructive" className="m-4">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

const ChallengeCard: React.FC<{
  challenge: Challenge;
  onClick: () => void;
}> = ({ challenge, onClick }) => (
  <Card
    className={`cursor-pointer border-none text-center shadow-custom transition-shadow duration-300 hover:shadow-hover-custom dark:hover:shadow-dark-hover ${
      challenge.solved ? "bg-green-400 dark:bg-green-600" : "dark:bg-zinc-700"
    }`}
    onClick={onClick}
  >
    <CardHeader>
      <CardTitle>{challenge.name}</CardTitle>
      <p className="text-sm">{challenge.date}</p>
    </CardHeader>
    <CardContent>
      <p>{challenge.points} points</p>
    </CardContent>
  </Card>
);

const ChallengeDetails: React.FC<{
  challenge: Challenge;
  isAdmin: boolean;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}> = ({ challenge, isAdmin, onDelete, isDeleting }) => (
  <>
    <Markdown remarkPlugins={[remarkGfm]} className="mb-2 text-lg">
      {challenge.description}
    </Markdown>
    <p>
      <strong>Challenge Link:</strong>{" "}
      <a href={challenge.url} target="_blank" rel="noreferrer">
        {challenge.url}
      </a>
    </p>
    {isAdmin && (
      <>
        <p>
          <strong>Flag:</strong> {challenge.flag}
        </p>
        <div className="my-4 flex space-x-2">
          <Button asChild>
            <Link to={`/admin/challenges/edit?id=${challenge.id}`}>
              Edit Challenge
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
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
  </>
);

const FlagSubmission: React.FC<{
  flagInput: string;
  setFlagInput: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submissionStatus: string | null;
}> = ({
  flagInput,
  setFlagInput,
  onSubmit,
  isSubmitting,
  submissionStatus,
}) => (
  <div className="my-4">
    <Input
      value={flagInput}
      onChange={(e) => setFlagInput(e.target.value)}
      placeholder="Enter flag"
    />
    <Button
      className="mt-2 w-full"
      onClick={onSubmit}
      disabled={isSubmitting || !flagInput}
    >
      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
    </Button>
    {submissionStatus === "correct" && (
      <p className="mt-2 text-green-500">Correct flag! 🎉</p>
    )}
    {submissionStatus === "incorrect" && (
      <p className="mt-2 text-red-500">Incorrect flag. Try again.</p>
    )}
    {submissionStatus === "error" && (
      <p className="mt-2 text-red-500">
        Error submitting flag. Please try again.
      </p>
    )}
  </div>
);

const SubmissionsTable: React.FC<{ submissions: Submission[] }> = ({
  submissions,
}) => (
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
              <td className="border px-4 py-2 text-blue-600 hover:underline dark:text-blue-400">
                <Link to={`/personal/${submission.userId}`}>
                  {submission.username}
                </Link>
              </td>
              <td className="border px-4 py-2">
                {new Date(submission.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export const Challenges: React.FC = () => {
  const [categories, setCategories] = useState<CategoryChallenges[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null,
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
    fetchChallenges();
  }, []);

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
      } else if (response.status === 401) {
        setError("To view challenges, please register first.");
      } else {
        setError("Failed to fetch challenges. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching challenges:", error);
      setError(
        "An error occurred while fetching challenges. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openDialog = async (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setFlagInput("");
    setSubmissionStatus(null);
    await fetchSubmissions(challenge.id);
  };

  const fetchSubmissions = async (challengeId: string) => {
    try {
      const response = await fetch(
        getBackendURL() + `/api/submissions/readbychallengeid/${challengeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setSubmissions(
          data.filter((submission: Submission) => submission.isCorrect),
        );
      } else {
        console.error("Failed to fetch submissions");
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const handleFlagSubmission = async () => {
    if (
      !selectedChallenge ||
      !flagInput.trim() ||
      submissionStatus === "correct"
    )
      return;

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
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.submission.isCorrect) {
          setSubmissionStatus("correct");
          updateChallengeStatus(selectedChallenge.id, true);
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

  const updateChallengeStatus = (challengeId: string, solved: boolean) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => ({
        ...category,
        challenges: category.challenges.map((challenge) =>
          challenge.id === challengeId ? { ...challenge, solved } : challenge,
        ),
      })),
    );
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
            (challenge) => challenge.id !== selectedChallenge.id,
          ),
        })),
      );
      setSelectedChallenge(null);
    } catch (error) {
      console.error("Error deleting challenge:", error);
      setError("Failed to delete the challenge. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingSpinner message="challenges" />;
  if (error) return <ErrorAlert message={error} />;

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
                  <ChallengeCard
                    challenge={challenge}
                    onClick={() => openDialog(challenge)}
                  />
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      <h2 className="text-2xl font-semibold">
                        {selectedChallenge?.name}
                      </h2>
                    </DialogTitle>
                    <div className="flex space-x-4">
                      <p>
                        <strong>Points:</strong> {selectedChallenge?.points}
                      </p>
                      <p>
                        <strong>Author:</strong> {selectedChallenge?.author}
                      </p>
                    </div>
                  </DialogHeader>

                  <Tabs defaultValue="details">
                    <TabsList>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="submissions">
                        Submissions ({submissions.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                      {selectedChallenge && (
                        <>
                          <ChallengeDetails
                            challenge={selectedChallenge}
                            isAdmin={user?.isAdmin || false}
                            onDelete={handleDeleteChallenge}
                            isDeleting={isDeleting}
                          />
                          {!user?.isAdmin && (
                            <FlagSubmission
                              flagInput={flagInput}
                              setFlagInput={setFlagInput}
                              onSubmit={handleFlagSubmission}
                              isSubmitting={isSubmitting}
                              submissionStatus={submissionStatus}
                            />
                          )}
                        </>
                      )}
                    </TabsContent>

                    <TabsContent value="submissions">
                      <SubmissionsTable submissions={submissions} />
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
