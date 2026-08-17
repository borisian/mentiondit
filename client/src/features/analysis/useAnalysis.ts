"use client";

import { useCallback, useState } from "react";
import { post } from "@/lib/api-client";
import type { AnalyzeParams, AnalyzeResponse, Mode } from "./types";

export function useAnalysis() {
  const [mode, setMode] = useState<Mode>("compare");
  const [topic, setTopic] = useState("");
  const [brands, setBrands] = useState("");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (params: AnalyzeParams) => {
    setLoading(true);
    setError(null);
    try {
      setResult(await post<AnalyzeResponse>("/api/analyze", params));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "L'analyse a échoué.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const switchMode = useCallback((next: Mode) => {
    setMode(next);
    setResult(null);
    setError(null);
    setTopic("");
  }, []);

  const addBrand = useCallback((name: string) => {
    setBrands((current) => (current ? `${current}, ${name}` : name));
  }, []);

  return {
    mode, topic, brands, result, loading, error,
    setTopic, setBrands, switchMode, addBrand, run,
  };
}
