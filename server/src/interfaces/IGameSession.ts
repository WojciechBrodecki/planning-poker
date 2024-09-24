import IPlayer from './IPlayer';
import IRound from './IRound';

interface IGameSession {
  id: string;
  players: IPlayer[];
  rounds: IRound[];
  currentRound: IRound;
}

export default IGameSession;
