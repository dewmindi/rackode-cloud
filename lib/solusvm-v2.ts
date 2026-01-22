/**
 * SolusVM 2 API Integration Library
 * Modern RESTful API with full functionality
 * Documentation: https://docs.solusvm.com/v2/api-reference/api.html
 */

export interface SolusVMv2Config {
  apiUrl: string; // e.g., https://your-server.com/api/v1
  apiToken: string; // Bearer token from SolusVM 2 UI
}

export interface ServerCreateParams {
  name: string;
  plan_id: number;
  project_id?: number;
  location_id?: number;
  os_image_version_id: number;
  ssh_keys?: number[];
  user_data?: string;
  backup_settings?: {
    enabled: boolean;
  };
}

export interface Server {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  status: string;
  ip_addresses: IPAddress[];
  plan: Plan;
  location: Location;
  os_image_version: OSImageVersion;
  created_at: string;
  updated_at: string;
}

export interface IPAddress {
  id: number;
  ip: string;
  type: string;
}

export interface Plan {
  id: number;
  name: string;
  vcpu: number;
  ram: number;
  disk: number;
  bandwidth: number;
}

export interface Location {
  id: number;
  name: string;
  description: string;
}

export interface OSImageVersion {
  id: number;
  version: string;
  os_image: {
    id: number;
    name: string;
    icon: string;
  };
}

/**
 * SolusVM 2 API Client
 */
export class SolusVMv2Client {
  private config: SolusVMv2Config;

  constructor(config?: SolusVMv2Config) {
    this.config = config || {
      apiUrl: process.env.SOLUSVM_V2_API_URL || '',
      apiToken: process.env.SOLUSVM_V2_API_TOKEN || '',
    };

    if (!this.config.apiUrl || !this.config.apiToken) {
      console.warn('SolusVM v2 credentials not configured. API calls will fail.');
    }
  }

  /**
   * Make API request to SolusVM v2
   */
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    try {
      const url = `${this.config.apiUrl}${endpoint}`;

      const options: RequestInit = {
        method,
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      };

      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('SolusVM v2 API Error:', error);
      throw error;
    }
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.listServers();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // ==================== Server Management ====================

  /**
   * List all servers
   */
  async listServers(params?: { page?: number; per_page?: number }): Promise<{ data: Server[] }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

    const query = queryParams.toString() ? `?${queryParams}` : '';
    return this.makeRequest<{ data: Server[] }>(`/servers${query}`);
  }

  /**
   * Get server details
   */
  async getServer(serverId: number): Promise<{ data: Server }> {
    return this.makeRequest<{ data: Server }>(`/servers/${serverId}`);
  }

  /**
   * Create a new server (VPS)
   */
  async createServer(params: ServerCreateParams): Promise<{ data: Server }> {
    return this.makeRequest<{ data: Server }>('/servers', 'POST', params);
  }

  /**
   * Update server
   */
  async updateServer(serverId: number, params: Partial<ServerCreateParams>): Promise<{ data: Server }> {
    return this.makeRequest<{ data: Server }>(`/servers/${serverId}`, 'PATCH', params);
  }

  /**
   * Delete server
   */
  async deleteServer(serverId: number): Promise<void> {
    return this.makeRequest<void>(`/servers/${serverId}`, 'DELETE');
  }

  // ==================== Server Actions ====================

  /**
   * Start/Boot server
   */
  async startServer(serverId: number): Promise<void> {
    return this.makeRequest<void>(`/servers/${serverId}/start`, 'POST');
  }

  /**
   * Stop/Shutdown server
   */
  async stopServer(serverId: number): Promise<void> {
    return this.makeRequest<void>(`/servers/${serverId}/stop`, 'POST');
  }

  /**
   * Restart/Reboot server
   */
  async restartServer(serverId: number): Promise<void> {
    return this.makeRequest<void>(`/servers/${serverId}/restart`, 'POST');
  }

  /**
   * Get server status
   */
  async getServerStatus(serverId: number): Promise<{ data: { status: string } }> {
    return this.makeRequest<{ data: { status: string } }>(`/servers/${serverId}/status`);
  }

  /**
   * Get VNC console URL
   */
  async getConsoleUrl(serverId: number): Promise<{ data: { url: string } }> {
    return this.makeRequest<{ data: { url: string } }>(`/servers/${serverId}/console`);
  }

  /**
   * Reinstall server
   */
  async reinstallServer(serverId: number, osImageVersionId: number): Promise<void> {
    return this.makeRequest<void>(`/servers/${serverId}/reinstall`, 'POST', {
      os_image_version_id: osImageVersionId
    });
  }

  /**
   * Reset server password
   */
  async resetPassword(serverId: number): Promise<{ data: { password: string } }> {
    return this.makeRequest<{ data: { password: string } }>(`/servers/${serverId}/reset-password`, 'POST');
  }

  // ==================== Plans ====================

  /**
   * List available plans
   */
  async listPlans(): Promise<{ data: Plan[] }> {
    return this.makeRequest<{ data: Plan[] }>('/plans');
  }

  /**
   * Get plan details
   */
  async getPlan(planId: number): Promise<{ data: Plan }> {
    return this.makeRequest<{ data: Plan }>(`/plans/${planId}`);
  }

  // ==================== Locations ====================

  /**
   * List available locations
   */
  async listLocations(): Promise<{ data: Location[] }> {
    return this.makeRequest<{ data: Location[] }>('/locations');
  }

  // ==================== OS Images ====================

  /**
   * List available OS images
   */
  async listOSImages(): Promise<{ data: any[] }> {
    return this.makeRequest<{ data: any[] }>('/os_images');
  }

  /**
   * List OS image versions
   */
  async listOSImageVersions(): Promise<{ data: OSImageVersion[] }> {
    return this.makeRequest<{ data: OSImageVersion[] }>('/os_image_versions');
  }

  // ==================== Projects ====================

  /**
   * List projects
   */
  async listProjects(): Promise<{ data: any[] }> {
    return this.makeRequest<{ data: any[] }>('/projects');
  }

  // ==================== Backups ====================

  /**
   * List server backups
   */
  async listBackups(serverId: number): Promise<{ data: any[] }> {
    return this.makeRequest<{ data: any[] }>(`/servers/${serverId}/backups`);
  }

  /**
   * Create backup
   */
  async createBackup(serverId: number): Promise<{ data: any }> {
    return this.makeRequest<{ data: any }>(`/servers/${serverId}/backups`, 'POST');
  }

  /**
   * Restore from backup
   */
  async restoreBackup(serverId: number, backupId: number): Promise<void> {
    return this.makeRequest<void>(`/servers/${serverId}/backups/${backupId}/restore`, 'POST');
  }

  // ==================== Statistics ====================

  /**
   * Get server statistics
   */
  async getServerStats(serverId: number): Promise<{ data: any }> {
    return this.makeRequest<{ data: any }>(`/servers/${serverId}/statistics`);
  }

  /**
   * Get server bandwidth usage
   */
  async getServerBandwidth(serverId: number): Promise<{ data: any }> {
    return this.makeRequest<{ data: any }>(`/servers/${serverId}/bandwidth`);
  }

  // ==================== Users ====================

  /**
   * List users
   */
  async listUsers(): Promise<{ data: any[] }> {
    return this.makeRequest<{ data: any[] }>('/users');
  }

  /**
   * Create user
   */
  async createUser(params: {
    email: string;
    password: string;
    roles: string[];
  }): Promise<{ data: any }> {
    return this.makeRequest<{ data: any }>('/users', 'POST', params);
  }
}

// Export singleton instance
export const solusvmV2 = new SolusVMv2Client();
