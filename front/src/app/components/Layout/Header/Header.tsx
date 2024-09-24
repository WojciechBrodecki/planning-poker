'use client'
import React from 'react';
import styles from "./Header.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  title: string;
  sessionId?: string;
}

export default function Header({ title, sessionId }: Readonly<HeaderProps>): JSX.Element {
  return (
    <header className={styles.navbar}>
      <h1 className={styles.title}>{title}</h1>
      {sessionId && <div>
        <button>Invite Players <FontAwesomeIcon icon={faUserPlus} /></button>
      </div>}
    </header>
  );
};
