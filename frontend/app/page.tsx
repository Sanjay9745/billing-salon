"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

export default function Home() {
  const router = useRouter();
  useLayoutEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
}
