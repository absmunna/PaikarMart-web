import { EscrowTransaction, EscrowStatus } from "@/modules/wallet/types/escrow";

class EscrowService {
  private mockEscrows: EscrowTransaction[] = [
    {
      id: "esc-10029",
      orderId: "SVC-MOCK-001",
      amount: 2500,
      status: "held",
      releaseDate: "",
      createdAt: new Date().toISOString(),
      description: "AC Repair Service",
    }
  ];

  async getEscrowByOrderId(orderId: string): Promise<EscrowTransaction | null> {
    const escrow = this.mockEscrows.find(e => e.orderId === orderId);
    return Promise.resolve(escrow || null);
  }

  async createEscrowHold(orderId: string, amount: number, description: string): Promise<EscrowTransaction> {
    const newEscrow: EscrowTransaction = {
      id: `esc-${Date.now()}`,
      orderId,
      amount,
      status: 'held',
      releaseDate: '',
      createdAt: new Date().toISOString(),
      description
    };
    this.mockEscrows.push(newEscrow);
    // Simulating call to Wallet API to hold funds
    console.log(`[Wallet Integration] Funds held in escrow for order ${orderId}: ৳${amount}`);
    return Promise.resolve(newEscrow);
  }

  async releaseEscrow(escrowId: string): Promise<boolean> {
    const index = this.mockEscrows.findIndex(e => e.id === escrowId);
    if (index === -1) return false;

    this.mockEscrows[index].status = 'released';
    this.mockEscrows[index].releaseDate = new Date().toISOString();
    
    // Simulating call to Wallet API to release funds to seller
    console.log(`[Wallet Integration] Escrow funds released to provider for ${escrowId}`);

    return Promise.resolve(true);
  }

  async disputeEscrow(escrowId: string): Promise<boolean> {
    const index = this.mockEscrows.findIndex(e => e.id === escrowId);
    if (index === -1) return false;

    this.mockEscrows[index].status = 'disputed';
    return Promise.resolve(true);
  }
}

export const escrowService = new EscrowService();
