"use client";

import { useEffect, useState, FormEvent } from "react";
import { uploadFileToServer } from "@/lib/actions";
import { TUploadFormState } from "@/types/server-types";
import { UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Session } from "@/types/session.types";
import { Button } from "@/components/ui/button";
import { TRole } from "@/types/role-type";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Dashboard = () => {
  // =============== State ===============
  const [session, setSession] = useState<Session | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<TUploadFormState | null>(null);

  // =============== Routes ===============
  const router = useRouter();

  // =============== Effect ===============
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (!res.ok) return router.replace("/auth/signin");
        const data: Session = await res.json();
        if (!data.user || data.user.role !== TRole.ADMIN) {
          router.push("/");
          return;
        }
        setSession(data);
      } catch (error) {
        console.log("Dashboard Error", error);
        router.replace("/auth/signin");
      }
    };
    fetchSession();
  }, [router]);

  // =============== Submit Handler ===============
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadFileToServer(undefined, formData);
    setFormState(result);
    setLoading(false);
    setFile(null);
  };

  // =============== Loading State ===============
  if (!session)
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    );

  // =============== UI ===============
  return (
    <div className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 border p-4 rounded-xl shadow-sm bg-white"
      >
        <Label htmlFor="file">Upload File</Label>
        <Input
          id="file"
          name="file"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <Button
          type="submit"
          disabled={!file || loading}
          className="w-full bg-blue-400 hover:bg-blue-600"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <UploadCloud className="animate-spin" size={16} />
              Uploading...
            </div>
          ) : (
            "Upload"
          )}
        </Button>

        {/* ✅ نمایش پیام‌ها */}
        {formState?.errors?.file && (
          <p className="text-sm text-red-500 text-center">
            {formState.errors.file[0]}
          </p>
        )}
        {formState?.message && (
          <p className="text-sm text-green-600 text-center">
            {formState.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Dashboard;
