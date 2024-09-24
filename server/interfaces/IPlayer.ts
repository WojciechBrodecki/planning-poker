interface IPlayer {
  name: string;
  estimate: number | null;
  confirmed: boolean;
  ws: any;
}

export default IPlayer;
