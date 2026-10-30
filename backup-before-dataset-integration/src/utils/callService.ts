/**
 * CallService: interface and implementations for placing phone calls.
 *
 * DEMO LIMIT: A browser cannot place two phone calls simultaneously.
 * A tel: link opens one phone dialer at a time.
 *
 * For production, integrate a telephony backend (Exotel / Twilio / AWS Connect)
 * that dials both numbers in parallel from a server. See README for details.
 */

export interface CallTarget {
  name: string;
  phone: string;
  role: 'coordinator' | 'family';
}

export interface CallResult {
  callId: string;
  timestamp: number;
  status: 'simulated' | 'failed';
  target: CallTarget;
  note: string;
}

export interface ICallService {
  /**
   * Initiates calls to coordinator and family simultaneously.
   * In production this would call a backend telephony API.
   * Returns results for both calls.
   */
  callBoth(coordinator: CallTarget, family: CallTarget): Promise<CallResult[]>;
}

/**
 * DEMO implementation.
 * Simulates calls by returning results with a "simulated" status.
 * Shows tel: links in the UI as manual fallback.
 * Does NOT place real calls.
 */
export class DemoCallService implements ICallService {
  async callBoth(coordinator: CallTarget, family: CallTarget): Promise<CallResult[]> {
    const ts = Date.now();
    return [
      {
        callId: `demo-coord-${ts}`,
        timestamp: ts,
        status: 'simulated',
        target: coordinator,
        note: 'DEMO: No real call placed. Use the tel: link below as manual fallback.',
      },
      {
        callId: `demo-family-${ts}`,
        timestamp: ts,
        status: 'simulated',
        target: family,
        note: 'DEMO: No real call placed. Use the tel: link below as manual fallback.',
      },
    ];
  }
}

/**
 * Production implementation interface reference.
 * NOT built here. Requires a backend telephony integration.
 *
 * Steps to implement:
 * 1. Set up an Exotel or Twilio account with a verified caller ID.
 * 2. Build a backend endpoint POST /api/sos/call that accepts { coordinatorPhone, familyPhone }.
 * 3. The backend uses the telephony SDK to dial both numbers simultaneously.
 * 4. Return call SIDs / status to the frontend.
 * 5. This class would call that endpoint instead of simulating.
 */
export class ProductionCallService implements ICallService {
  private backendUrl: string;

  constructor(backendUrl: string) {
    this.backendUrl = backendUrl;
  }

  async callBoth(coordinator: CallTarget, family: CallTarget): Promise<CallResult[]> {
    throw new Error(
      'ProductionCallService is not implemented. ' +
      'Connect a backend telephony API (Exotel / Twilio) at ' +
      this.backendUrl +
      ' before using this service.'
    );
  }
}

// Export a singleton demo service for use in the app
export const callService: ICallService = new DemoCallService();
