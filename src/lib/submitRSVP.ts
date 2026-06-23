export interface RSVPInput {
  fullName: string;
  attending: "si" | "no";
  dietaryRestrictions: string;
  travelSupport: "si" | "no";
}

export interface RSVPResult {
  id: string;
  receivedAt: string;
}

export interface RSVPSubmitOptions {
  transport?: (payload: RSVPInput) => Promise<RSVPResult>;
}

async function mockRSVPTransport(data: RSVPInput): Promise<RSVPResult> {
  await new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });

  if (data.fullName.toLowerCase().includes("error")) {
    throw new Error("Simulación de error de red");
  }

  return {
    id: `rsvp_${Date.now()}`,
    receivedAt: new Date().toISOString(),
  };
}

// Mock para conectar luego con API, Google Sheets, Supabase, Firebase o un endpoint propio.
export async function submitRSVP(data: RSVPInput, options: RSVPSubmitOptions = {}): Promise<RSVPResult> {
  const transport = options.transport ?? mockRSVPTransport;
  return transport(data);
}
