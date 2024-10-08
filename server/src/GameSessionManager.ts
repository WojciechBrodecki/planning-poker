import { IGameSession, IRound } from "./interfaces";
import SessionManager from "./SessionManager";

class GameSessionManager {
  private session: IGameSession;

  constructor(sessionId: string) {
    const session = SessionManager.getInstance().getSessionById(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    this.session = session;
  }

  public submitEstimate(playerName: string, estimate: number): boolean {
    const player = this.session.players.find(p => p.name === playerName);
    if (!player || player.confirmed) return false;

    player.estimate = estimate;
    return true;
  }

  public confirmEstimate(playerName: string, estimate: number): boolean {
    const player = this.session.players.find(p => p.name === playerName);
    if (!player || player.estimate === null) return false;

    player.confirmed = true;

    const allConfirmed = this.session.players.every(p => p.confirmed);
    if (allConfirmed) {
      this.revealEstimates();
    }
    return true;
  }

  public revealEstimates(): void {
    const round = this.session.currentRound;

    this.session.players.forEach(player => {
      if (player.estimate !== null) {
        round.estimates.push({ playerName: player.name, estimate: player.estimate });
      }
    });

    const total = round.estimates.reduce((sum, e) => sum + e.estimate, 0);
    round.average = total / round.estimates.length;

    const differences = round.estimates.map(e => Math.abs(e.estimate - round.average!));
    const maxDifference = Math.max(...differences);
    round.consensus = 100 - (maxDifference / round.average) * 100;

    round.revealed = true;
  }

  public startNewRound(): boolean {
    this.session.rounds.push(this.session.currentRound);

    this.session.currentRound = SessionManager.getInstance().createNewRound();

    this.session.players.forEach(player => {
      player.estimate = null;
      player.confirmed = false;
    });

    return true;
  }

  public getRoundsHistory(): IRound[] {
    return this.session.rounds;
  }
}

export default GameSessionManager;