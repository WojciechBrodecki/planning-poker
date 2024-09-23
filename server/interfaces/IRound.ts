interface IRound {
  id: string;
  estimates: { playerName: string; estimate: number }[];
  revealed: boolean;
  average: number | null;
  consensus: number | null;
}

export default IRound;