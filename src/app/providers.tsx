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
      // Prefer server-provided message if available
      message =
        (error.response?.data as { message?: string; error?: string })
          ?.message ||
        (error.response?.data as { message?: string; error?: string })?.error ||
        error.message ||
        message;
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
