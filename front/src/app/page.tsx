'use client'
import { useEffect, useState } from 'react';
import Header from "./components/Layout/Header/Header";
import Cards from "./components/Layout/Cards/Cards";
import styles from "./page.module.css"
import Main from "./components/Layout/Main/Main";
import { useRouter } from 'next/navigation'

export default function MyApp() {
  const router = useRouter();
  const [ws, setWs] = useState<WebSocket | undefined>();
  const [sessionId, setSessionId] = useState<string | undefined>();

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8080');

    websocket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.action) {
        case 'sessionCreated':
          console.log(`Session created: ${data}`);
          router.push(`/session/${data.sessionId}`);
          break;

        case 'error':
          // logMessage(`Error: ${data.error}`);
          break;

        default:
          // logMessage(`Unknown action: ${data.action}`);
          break;
      }
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const createSession = () => {
    if (ws) {
      ws.send(JSON.stringify({ action: 'createSession' }));
    }
  };

  return (
    <div className={styles.container}>
      <Header title="Planning Poker" sessionId={sessionId} />
      <div className={styles.sessionContainer}>
        <button onClick={() => createSession()} className={styles.createSessionButton}>Create a new session</button>
        <p className={styles.dividerOr}>or</p>
        <p className={styles.joinSessionInfo}>Please enter your session ID:</p>
        <input className={styles.sessionIdInput} type="text" />
        <button className={styles.joinSessionButton}>Join</button>
      </div>
    </div>
  )
};
