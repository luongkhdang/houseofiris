"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import './styles/globals.css';
import Timer from "./components/Timer";
import Timers from "./components/Timers";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <Timer />
          <Timers />
        </QueryClientProvider>
      </body>
    </html>
  );
}
