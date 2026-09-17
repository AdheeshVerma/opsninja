import {
  NeptunedataClient,
  ExecuteOpenCypherQueryCommand,
} from "@aws-sdk/client-neptunedata";

class NeptuneClient {
  client: NeptunedataClient | null = null;
  private static instance: NeptuneClient | null;

  private constructor(endpoint: string) {
    this.client = new NeptunedataClient({
      endpoint,
    });
  }

  public static getInstance(endpoint: string) {
    if (this.instance == null) {
      this.instance = new NeptuneClient(endpoint);
    }
    return this.instance;
  }

  public async executeCommand(command: ExecuteOpenCypherQueryCommand) {
    return await this.client?.send(command);
  }
}

export default NeptuneClient;
