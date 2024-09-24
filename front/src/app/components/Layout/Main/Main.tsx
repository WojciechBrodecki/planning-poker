'use client'
import React from 'react';
import styles from "./Main.module.css";

export default function Main(): JSX.Element {
  return (
    <main className={styles.containerMain}>
      <div className={styles.containerTable}>
        <p>Pick your cards!</p>
      </div>
      <div className={styles.containerPlayer}>
        {/* Map players connected to WS */}
        <div className={styles.playerCard}></div>
        <p className={styles.playerName}>Name</p>
      </div>
    </main>
  );
};
