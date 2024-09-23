import WebSocket from 'ws';
import SessionManager from './SessionManager';

const clients = new Set<WebSocket>();

const wss = new WebSocket.Server({ port: 8080 });

interface ExtWebSocket extends WebSocket {

}

wss.on('connection', (ws: ExtWebSocket) => {
  const sessionManager = SessionManager.getInstance(); // Wyciągamy instancję SessionManager raz
  console.log('Client connected');

  ws.on('message', (message: string) => {
    const data = JSON.parse(message);

    switch (data.action) {
      case 'createSession': {
        const newSession = sessionManager.createSession();
        ws.send(JSON.stringify({ action: 'sessionCreated', sessionId: newSession.id }));
        break;
      }

      case 'joinSession': {
        const gameSessionManager = sessionManager.getSessionManager(data.sessionId);
        const player = gameSessionManager.addPlayer(data.playerName);
        ws.send(JSON.stringify({ action: 'joinedSession', playerName: player.name }));
        break;
      }

      case 'submitEstimate': {
        const gameSessionManager = sessionManager.getSessionManager(data.sessionId);
        const estimateSuccess = gameSessionManager.submitEstimate(data.playerId, data.estimate);
        if (estimateSuccess) {
          ws.send(JSON.stringify({ action: 'estimateSubmitted', playerId: data.playerId }));
        }
        break;
      }

      case 'confirmEstimate': {
        const gameSessionManager = sessionManager.getSessionManager(data.sessionId);
        const confirmSuccess = gameSessionManager.confirmEstimate(data.playerId);
        if (confirmSuccess) {
          ws.send(JSON.stringify({ action: 'estimateConfirmed', playerId: data.playerId }));
        }
        break;
      }

      case 'revealEstimates': {
        const gameSessionManager = sessionManager.getSessionManager(data.sessionId);
        gameSessionManager.revealEstimates();
        ws.send(JSON.stringify({ action: 'estimatesRevealed', sessionId: data.sessionId }));
        break;
      }

      case 'newRound': {
        const gameSessionManager = sessionManager.getSessionManager(data.sessionId);
        gameSessionManager.startNewRound();
        ws.send(JSON.stringify({ action: 'newRoundStarted', sessionId: data.sessionId }));
        break;
      }

      case 'getRoundsHistory': {
        const gameSessionManager = sessionManager.getSessionManager(data.sessionId);
        const rounds = gameSessionManager.getRoundsHistory();
        ws.send(JSON.stringify({ action: 'roundsHistory', rounds }));
        break;
      }

      default: {
        console.log(`Unknown action: ${data.action}`);
        break;
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
