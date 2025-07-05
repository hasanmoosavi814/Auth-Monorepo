"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "@/types/session.types";
import { TRole } from "@/types/role-type";

const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

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
        console.log("Dashborad Error", error);
        router.replace("/auth/signin");
      }
    };

    fetchSession();
  }, [router]);

  if (!session) return <p>Loading...</p>;

  return <div>Dashboard</div>;
};

export default Dashboard;
