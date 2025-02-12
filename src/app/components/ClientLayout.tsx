"use client"

import React from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "../lib/queryClient"
import "../styles/globals.css"
import Timer from "./Timer"
import Timers from "./Timers"
import { useSessionReset } from "../hooks/useSessionReset"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSessionReset();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="shift-container">{children}</div> 
      <Timer />
      <Timers />
    </QueryClientProvider>
  );
} 