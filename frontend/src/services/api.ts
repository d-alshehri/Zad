const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ── Types ─────────────────────────────────────────────────

export interface ChatSource {
  source_name: string;
  source_name_ar: string;
  source_url: string;
  category: string;
  similarity: number;
}

export interface ChatResponse {
  answer: string;
  sources_used: ChatSource[];
  found_in_sources: boolean;
}

// Full source object returned by /sources endpoint
// Used by BOTH Sources page (public) and Admin Dashboard
export interface KnowledgeSource {
  name: string;
  name_ar: string;
  category: string;
  url: string;
  description: string;
  chunks: number;
}

export interface SourcesStats {
  total_chunks: number;
  sources: KnowledgeSource[];
}

// ── Chat ──────────────────────────────────────────────────

export async function sendMessage(
  message: string,
  conversationHistory: { role: string; content: string }[] = []
): Promise<ChatResponse> {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, conversation_history: conversationHistory }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Server error: ${response.status}`);
  }
  return response.json();
}

// ── Sources ───────────────────────────────────────────────

export async function getSources(): Promise<SourcesStats> {
  const response = await fetch(`${BASE_URL}/sources`);
  if (!response.ok) throw new Error("Failed to fetch sources");
  return response.json();
}

export async function ingestURL(
  url: string,
  sourceName: string,
  sourceNameAr: string = "",
  category: string = "other",
  description: string = ""
): Promise<{ chunks_added: number; words_extracted: number }> {
  const response = await fetch(`${BASE_URL}/ingest/url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      source_name: sourceName,
      source_name_ar: sourceNameAr,
      category,
      description,
    }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to add URL");
  }
  return response.json();
}

export async function ingestPDF(
  file: File,
  sourceName: string,
  sourceNameAr: string = "",
  category: string = "other",
  description: string = ""
): Promise<{ chunks_added: number }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("source_name", sourceName);
  formData.append("source_name_ar", sourceNameAr);
  formData.append("category", category);
  formData.append("description", description);

  const response = await fetch(`${BASE_URL}/ingest/pdf`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to upload PDF");
  }
  return response.json();
}

export async function deleteSource(sourceName: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/sources`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source_name: sourceName }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to delete source");
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
