import { v4 as uuidv4 } from 'uuid';
import { IGameSession, IRound } from "./interfaces";
import fs from 'fs';
import path from 'path';

class SessionManager {
  private static instance: SessionManager;
  private sessions: IGameSession[] = [];

  constructor() { }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  public createSession(): IGameSession {
    const session: IGameSession = {
      id: uuidv4(),
      players: [],
      rounds: [],
      currentRound: this.createNewRound(),
    };
    this.sessions.push(session);
    return session;
  }

  public getSessionById(sessionId: string): IGameSession | undefined {
    return this.sessions.find(session => session.id === sessionId);
  }

  public addPlayerToSession(sessionId: string, playerName: string) {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const isPlayerWithSameNameExist = session.players.some(player => player.name === playerName);
    if (isPlayerWithSameNameExist) {
      const playersWithSameName = session.players.filter(player => player.name.startsWith(playerName));
      playerName = `${playerName} (${playersWithSameName.length + 1})`;
    }

    session.players.push({
      name: playerName,
      estimate: null,
      confirmed: false,
    });
  }

  public closeSession(sessionId: string): boolean {
    const sessionIndex = this.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      throw new Error('Session not found');
    }

    const session = this.sessions[sessionIndex];
    const filePath = path.join(__dirname, `../sessions/${session.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(session, null, 2));

    this.sessions.splice(sessionIndex, 1);
    return true;
  }

  public createNewRound(): IRound {
    return {
      id: uuidv4(),
      estimates: [],
      revealed: false,
      average: null,
      consensus: null,
    };
  }
};

export default SessionManager;