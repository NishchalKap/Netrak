export interface AIProvider {
  /**
   * The name of the provider (e.g., 'databricks', 'gemini', 'openai')
   */
  readonly name: string;

  /**
   * Checks if the provider is properly configured and reachable
   */
  healthCheck(): Promise<boolean>;
}
