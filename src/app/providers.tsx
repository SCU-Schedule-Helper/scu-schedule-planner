"use client";

import { useState, useEffect } from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast } from "sonner";
import axios from "axios";
import type {
  ValidationReport,
  ValidationMessage,
  CourseReport,
} from "@/lib/validation/types";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            handleError(error);
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            handleError(error);
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Error handler shared by React Query and Axios interceptors
  function handleError(error: unknown) {
    console.error(error);
    let message = "An unexpected error occurred.";

    if (axios.isAxiosError(error)) {
      const data = error.response?.data as
        | { message?: string; error?: string; report?: unknown }
        | undefined;

      // If the backend supplied a validation report, extract the most relevant messages
      if (data?.report) {
        const fatal: string[] = [];

        const report = data.report as Partial<ValidationReport>;

        // Collect plan-level error messages
        (report.messages ?? []).forEach((m: ValidationMessage) => {
          if (m.level === "error") fatal.push(m.message);
        });

        // Collect course-level error messages
        if (report.courseReports) {
          Object.values(
            report.courseReports as Record<string, CourseReport>
          ).forEach((cr) => {
            (cr.messages ?? []).forEach((m) => {
              if (m.level === "error") fatal.push(m.message);
            });
          });
        }

        if (fatal.length > 0) {
          message = fatal.join(" \u2014 "); // em-dash separator
        } else if (data.error) {
          message = data.error;
        }
      }

      // If message not set from report parsing, use generic fields
      if (message === "An unexpected error occurred.") {
        message = data?.message || data?.error || error.message || message;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }

    toast.error(message);
  }

  // Register a single Axios response interceptor once
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        handleError(error);
        return Promise.reject(error);
      }
    );

    // Eject interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
