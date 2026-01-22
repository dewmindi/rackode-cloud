/**
 * SolusVM API Integration Library
 * Handles communication with SolusVM Master Server API
 */

export interface SolusVMConfig {
  apiUrl: string;
  apiKey: string;
  apiHash: string;
}

export interface CreateVPSParams {
  type: 'kvm' | 'xen' | 'openvz';
  node: string;
  nodegroup?: string;
  hostname: string;
  password: string;
  username: string;
  plan: string;
  template: string;
  ips: number;
  hvmt?: string;
  customemail?: string;
  custusername?: string;
}

export interface VPSInfo {
  status: 'success' | 'error';
  statusmsg?: string;
  vserverid: string;
  'ctid-xid'?: string; // May contain hyphen in key name
  clientid?: string;
  hostname: string;
  template?: string;
  hdd: string;
  memory: string;
  'swap-burst'?: string; // May contain hyphen in key name
  type: string;
  cpu: string;
  ipaddress: string;
  // Additional optional fields
  state?: string;
  node?: string;
  bw?: string;
  bwlimit?: string;
  bandwidth?: string;
  bwused?: string;
}

export interface SolusVMResponse {
  status: 'success' | 'error';
  statusmsg?: string;
  vserverid?: string;
  mainipaddress?: string;
  rootpassword?: string;
  extraipaddress?: string[];
  [key: string]: any;
}

/**
 * SolusVM API Client
 */
export class SolusVMClient {
  private config: SolusVMConfig;

  constructor(config?: SolusVMConfig) {
    this.config = config || {
      apiUrl: process.env.SOLUSVM_API_URL || '',
      apiKey: process.env.SOLUSVM_API_KEY || '',
      apiHash: process.env.SOLUSVM_API_HASH || '',
    };

    if (!this.config.apiUrl || !this.config.apiKey || !this.config.apiHash) {
      console.warn('SolusVM credentials not configured. API calls will fail.');
    }
  }

  /**
   * Make API request to SolusVM Client API
   */
  public async makeRequest(action: string, params: Record<string, any> = {}): Promise<SolusVMResponse> {
    try {
      const queryParams = new URLSearchParams({
        key: this.config.apiKey,
        hash: this.config.apiHash,
        action,
        rdtype: 'json',
        ...params,
      });

      const url = `${this.config.apiUrl}?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      
      // Try to parse as JSON first
      try {
        return JSON.parse(text);
      } catch {
        // If JSON parsing fails, it's probably XML - parse it
        return this.parseXMLResponse(text);
      }
    } catch (error) {
      console.error('SolusVM API Error:', error);
      throw error;
    }
  }

  /**
   * Parse XML response from SolusVM
   */
  private parseXMLResponse(xml: string): SolusVMResponse {
    const result: any = {};
    
    // Simple XML parser for SolusVM responses
    const tagRegex = /<(\w+)>([^<]*)<\/\1>/g;
    let match;
    
    while ((match = tagRegex.exec(xml)) !== null) {
      const key = match[1];
      const value = match[2];
      result[key] = value;
    }
    
    return result as SolusVMResponse;
  }

  /**
   * Create a new VPS
   */
  async createVPS(params: CreateVPSParams): Promise<SolusVMResponse> {
    return this.makeRequest('vserver-create', params);
  }

  /**
   * Get VPS information
   */
  async getVPSInfo(vserverid: string): Promise<VPSInfo> {
    const response = await this.makeRequest('vserver-info', { vserverid });
    return response as any;
  }

  /**
   * Boot VPS
   */
  async bootVPS(vserverid: string): Promise<SolusVMResponse> {
    return this.makeRequest('vserver-boot', { vserverid });
  }

  /**
   * Reboot VPS
   */
  async rebootVPS(vserverid: string): Promise<SolusVMResponse> {
    return this.makeRequest('vserver-reboot', { vserverid });
  }

  /**
   * Shutdown VPS
   */
  async shutdownVPS(vserverid: string): Promise<SolusVMResponse> {
    return this.makeRequest('vserver-shutdown', { vserverid });
  }

  /**
   * Suspend VPS
   */
  async suspendVPS(vserverid: string): Promise<SolusVMResponse> {
    return this.makeRequest('vserver-suspend', { vserverid });
  }

  /**
   * Unsuspend VPS
   */
  async unsuspendVPS(vserverid: string): Promise<SolusVMResponse> {
    return this.makeRequest('vserver-unsuspend', { vserverid });
  }

  /**
   * Terminate VPS
   */
  async terminateVPS(vserverid: string, deleteclient: boolean = false): Promise<SolusVMResponse> {
    return this.makeRequest('vserver-terminate', { 
      vserverid,
      deleteclient: deleteclient ? 'true' : 'false'
    });
  }

  /**
   * Get VPS status
   */
  async getVPSStatus(vserverid: string): Promise<SolusVMResponse> {
    return this.makeRequest('vserver-status', { vserverid });
  }

  /**
   * Rebuild VPS
   */
  async rebuildVPS(vserverid: string, template: string): Promise<SolusVMResponse> {
    return this.makeRequest('vserver-rebuild', { vserverid, template });
  }

  /**
   * Change VPS hostname
   */
  async changeHostname(vserverid: string, hostname: string): Promise<SolusVMResponse> {
    return this.makeRequest('vserver-hostname', { vserverid, hostname });
  }

  /**
   * Change root password
   */
  async changeRootPassword(vserverid: string, rootpassword: string): Promise<SolusVMResponse> {
    return this.makeRequest('vserver-rootpassword', { vserverid, rootpassword });
  }

  /**
   * Get available templates/OS images
   */
  async listTemplates(type: string): Promise<SolusVMResponse> {
    return this.makeRequest('listtemplates', { type });
  }

  /**
   * Get available plans
   */
  async listPlans(type: string): Promise<SolusVMResponse> {
    return this.makeRequest('listplans', { type });
  }

  /**
   * Get node list
   */
  async listNodes(type: string): Promise<SolusVMResponse> {
    return this.makeRequest('listnodes', { type });
  }

  /**
   * Get VPS bandwidth usage
   */
  async getBandwidth(vserverid: string): Promise<SolusVMResponse> {
    return this.makeRequest('vserver-bandwidth', { vserverid });
  }

  /**
   * Get VPS console access
   */
  async getConsoleURL(vserverid: string): Promise<SolusVMResponse> {
    return this.makeRequest('vserver-console', { vserverid });
  }

  /**
   * Create client account
   */
  async createClient(params: {
    username: string;
    password: string;
    email: string;
    firstname: string;
    lastname: string;
    company?: string;
  }): Promise<SolusVMResponse> {
    return this.makeRequest('client-create', params);
  }

  /**
   * Add IP address to VPS
   */
  async addIPAddress(vserverid: string): Promise<SolusVMResponse> {
    return this.makeRequest('vserver-addip', { vserverid });
  }

  /**
   * Check if API credentials are valid
   * Note: Client API has no 'info' or 'list' action
   * We test by getting status which is the simplest action
   */
  async testConnection(): Promise<boolean> {
    try {
      // Client API - test with status action
      const response = await this.makeRequest('status');
      // Response should have a status field, even if the value isn't 'success'
      // As long as we get a valid response, credentials are working
      return response.status === 'success' || typeof response.statusmsg !== 'undefined';
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Get VPS status (Client API)
   * Note: Client API key/hash is tied to ONE specific VPS
   * Returns: online, offline, or other status
   */
  async getClientVPSStatus(): Promise<SolusVMResponse> {
    return this.makeRequest('status');
  }

  /**
   * Boot VPS (Client API)
   * Note: Client API key/hash is tied to ONE specific VPS
   */
  async clientBootVPS(): Promise<SolusVMResponse> {
    return this.makeRequest('boot');
  }

  /**
   * Reboot VPS (Client API)
   * Note: Client API key/hash is tied to ONE specific VPS
   */
  async clientRebootVPS(): Promise<SolusVMResponse> {
    return this.makeRequest('reboot');
  }

  /**
   * Shutdown VPS (Client API)
   * Note: Client API key/hash is tied to ONE specific VPS
   */
  async clientShutdownVPS(): Promise<SolusVMResponse> {
    return this.makeRequest('shutdown');
  }
}

/**
 * Helper function to map our OS IDs to SolusVM template names
 */
export function mapOSToTemplate(osId: string): string {
  const osMap: Record<string, string> = {
    'ubuntu-24': 'ubuntu-24.04-x86_64',
    'ubuntu-22': 'ubuntu-22.04-x86_64',
    'debian-12': 'debian-12-x86_64',
    'almalinux-9': 'almalinux-9-x86_64',
    'windows-2022': 'windows-2022-standard',
  };
  return osMap[osId] || osId;
}

/**
 * Helper function to map location to node/nodegroup
 */
export function mapLocationToNode(locationId: string): { node?: string; nodegroup?: string } {
  const locationMap: Record<string, any> = {
    'nyc': { nodegroup: 'nyc-group' },
    'la': { nodegroup: 'la-group' },
    'chi': { nodegroup: 'chi-group' },
    'ams': { nodegroup: 'ams-group' },
    'sgp': { nodegroup: 'sgp-group' },
  };
  return locationMap[locationId] || { nodegroup: 'default' };
}

/**
 * Generate a secure random password
 */
export function generateSecurePassword(length: number = 16): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }
  
  return password;
}

// Export singleton instance
export const solusvm = new SolusVMClient();
