/**
 * QUALITY CHECK:
 * Strengths:
 * - Properly marked with "use client" directive for client-side rendering
 * - Good implementation of React Query context provider
 * - Clean import structure with relevant dependencies
 * - Uses custom hooks for session management
 * - Good typing for the children prop
 * 
 * Recommendations:
 * - Add JSDoc comments to explain the component's purpose and behavior
 * - Create a more explicit interface for props rather than inline typing
 * - Consider adding error boundaries for better error handling
 * - Add more semantic HTML structure instead of a generic div
 * - Document the purpose of Timer and Timers components in the layout
 * - Add className typing for better type safety with Tailwind classes
 */

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