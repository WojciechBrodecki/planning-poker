'use client'
import React, { useState } from 'react';
import styles from "./Cards.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointDown } from '@fortawesome/free-solid-svg-icons';
import { faKeyboard } from '@fortawesome/free-regular-svg-icons';

const cardData = [
  { value: '1' },
  { value: '2' },
  { value: '3' },
  { value: '4' },
  { value: '5' },
  { value: '6' },
  { value: '7' },
  { value: '8' },
  { value: '10' },
  { value: '12' },
  { value: '14' },
  { value: '16' },
  { value: 'input' },
];

export default function Cards(): JSX.Element {
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleCardClick = (value: string) => {
    if (value === 'input') {
      setShowInput(true);
    } else {
      alert(`Card clicked: ${value}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      alert(`Value submitted: ${inputValue}`);
      setShowInput(false);
    }
  };

  return (
    <div className={styles.cardSelectorContainer}>
      <p>Choose your card <FontAwesomeIcon icon={faHandPointDown} /></p>
      <div className={styles.cards}>
        {cardData.map((card, index) => {
          let cardContent;
          if (card.value === 'input') {
            if (showInput) {
              cardContent = (
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="..."
                  className={styles.input}
                />
              );
            } else {
              cardContent = <FontAwesomeIcon icon={faKeyboard} className={styles.inputIcon} />;
            }
          } else {
            cardContent = <h3>{card.value}</h3>;
          }

          return (
            <button
              key={`card-${card.value}`}
              className={styles.card}
              onClick={() => handleCardClick(card.value)}
            >
              {cardContent}
            </button>
          );
        })}
      </div>
    </div>
  );
}
