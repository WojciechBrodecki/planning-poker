import WebSocket from 'ws';
import SessionManager from './SessionManager';

const wss = new WebSocket.Server({ port: 8080 });

interface ExtWebSocket extends WebSocket {

}

const sessionManager = SessionManager.getInstance();

wss.on('connection', (ws: ExtWebSocket) => {

  ws.on('message', (message: string) => {
    const data = JSON.parse(message);

    switch (data.action) {
      case 'createSession': {
        const newSession = sessionManager.createSession();
        ws.send(JSON.stringify({ action: 'sessionCreated', sessionId: newSession.id }));
        break;
      }

      case 'joinSession': {
        const { sessionId, playerName } = data;
        const gameSessionManager = sessionManager.getSessionManager(sessionId);

        if (gameSessionManager) {
          const session = sessionManager.getSessionById(sessionId);
          const playerExists = session!.players.some(player => player.name === playerName);

          if (playerExists) {
            ws.send(JSON.stringify({ error: 'Player already exists in this session' }));
          } else {
            sessionManager.addPlayerToSession(sessionId, playerName, ws);
            ws.send(JSON.stringify({ action: 'joinedSession', playerName }));
          }
        } else {
          ws.send(JSON.stringify({ error: 'Session not found' }));
        }
        break;
      }

      case 'submitEstimate': {
        const { sessionId, playerName, estimate } = data;
        const gameSessionManager = sessionManager.getSessionManager(sessionId);
        const estimateSuccess = gameSessionManager.submitEstimate(playerName, estimate);
        if (estimateSuccess) {
          ws.send(JSON.stringify({ action: 'estimateSubmitted', playerName }));
        } else {
          ws.send(JSON.stringify({ error: 'Failed to submit estimate' }));
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
