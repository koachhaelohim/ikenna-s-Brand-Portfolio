import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Project } from "../lib/types";

export function useProjects(opts: { includeDrafts?: boolean } = {}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    setLoading(true);
    let query = supabase.from("projects").select("*").order("sort_order", { ascending: true });
    if (!opts.includeDrafts) query = query.eq("published", true);
    const { data, error } = await query;
    if (!error && data) setProjects(data as Project[]);
    setLoading(false);
  };

  useEffect(() => {
    refetch();
  }, [opts.includeDrafts]);

  return { projects, loading, refetch };
}
