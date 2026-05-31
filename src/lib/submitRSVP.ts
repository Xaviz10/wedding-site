export interface RSVPInput {
  fullName: string;
  email: string;
  attending: "si" | "no";
  guests: number;
  dietaryNotes?: string;
}

export interface RSVPResult {
  id: string;
  receivedAt: string;
}

// Mock para conectar luego con Supabase, Firebase, Google Sheets o cualquier REST API.
export async function submitRSVP(data: RSVPInput): Promise<RSVPResult> {
  await new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });

  if (data.email.includes("error")) {
    throw new Error("Simulación de error de red");
  }

  return {
    id: `rsvp_${Date.now()}`,
    receivedAt: new Date().toISOString(),
  };
}
