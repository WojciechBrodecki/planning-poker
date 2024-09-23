import WebSocket from 'ws';

const clients = new Set<WebSocket>();

const wss = new WebSocket.Server({ port: 8080 });

interface ExtWebSocket extends WebSocket {

}

wss.on('connection', (ws: ExtWebSocket) => {
  ws.on('message', (message: string) => {
    const data = JSON.parse(message);

    switch (data.action) {
      case 'createSession':
        const newSession = SessionManager.getInstance().createSession();
        ws.send(JSON.stringify({ action: 'sessionCreated', sessionId: newSession.id }));
        break;

      case 'joinSession':
        const sessionManager = new GameSessionManager(data.sessionId);
        const player = sessionManager.addPlayer(data.playerName);
        ws.send(JSON.stringify({ action: 'joinedSession', playerId: player.id }));
        break;

      case 'submitEstimate':
        const gameManager = new GameSessionManager(data.sessionId);
        const estimateSuccess = gameManager.submitEstimate(data.playerId, data.estimate);
        if (estimateSuccess) {
          ws.send(JSON.stringify({ action: 'estimateSubmitted', playerId: data.playerId }));
        }
        break;

      case 'confirmEstimate':
        const gameConfirmManager = new GameSessionManager(data.sessionId);
        const confirmSuccess = gameConfirmManager.confirmEstimate(data.playerId);
        if (confirmSuccess) {
          ws.send(JSON.stringify({ action: 'estimateConfirmed', playerId: data.playerId }));
        }
        break;

      case 'revealEstimates':
        const revealManager = new GameSessionManager(data.sessionId);
        revealManager.revealEstimates();  // Reveal estimates if necessary
        ws.send(JSON.stringify({ action: 'estimatesRevealed', sessionId: data.sessionId }));
        break;

      case 'newRound':
        const newRoundManager = new GameSessionManager(data.sessionId);
        newRoundManager.startNewRound();
        ws.send(JSON.stringify({ action: 'newRoundStarted', sessionId: data.sessionId }));
        break;

      case 'getRoundsHistory':
        const historyManager = new GameSessionManager(data.sessionId);
        const rounds = historyManager.getRoundsHistory();
        ws.send(JSON.stringify({ action: 'roundsHistory', rounds }));
        break;
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
