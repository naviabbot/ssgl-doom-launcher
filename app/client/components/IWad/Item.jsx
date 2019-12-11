import React from 'react';
import styled from 'styled-components';
import styles from '#Style';
import getCover from '../../assets/covers';

const ListItemStyle = styled.li`
  margin-right: 10px;
  text-align: center;
`;

const IconStyle = styled.div`
  cursor: pointer;
  &:hover .ring-outer {
    transform: rotate(45deg);
    stroke: ${styles.svg.yellow};
  }

  &:hover .backdrop-overlay,
  &:hover .play {
    transform: scale(1);
  }

  .ring-outer {
    transform-origin: center center;
    transition: all 0.35s cubic-bezier(0.45, -0.79, 0, 1.77);
    stroke: ${styles.svg.red};
    stroke-width: 9;
  }

  .backdrop {
    stroke-width: 10;
  }

  .backdrop-overlay {
    transform-origin: center center;
    opacity: 0.5;
    transform: scale(0);
    transition: ${styles.transition.short};
  }

  .play {
    stroke: ${styles.svg.yellow};
    transform-origin: center center;
    transform: scale(0);
    transition: all 0.35s cubic-bezier(0.45, -0.79, 0, 1.77);
  }
`;

const Item = ({ name, onClick }) => {
  return (
    <ListItemStyle>
      <IconStyle>
        <svg
          width="80"
          height="80"
          viewBox="0 0 347 347"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={onClick}
        >
          <defs>
            <pattern
              id={`backdrop_${name}`}
              patternUnits="userSpaceOnUse"
              width="100%"
              height="100%"
            >
              <image
                xlinkHref={getCover(name)}
                x="0"
                y="0"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMin slice"
              />
            </pattern>
          </defs>

          <filter id="grayscale">
            <feColorMatrix values="0.21 0.72 0.072 0 0 0.21 0.72 0.072 0 0 0.21 0.72 0.072 0 0 0 0 0 1 0 " />
          </filter>

          <circle
            r="130"
            cx="174"
            cy="174"
            className="backdrop"
            fill={`url(#backdrop_${name})`}
          />

          <circle
            r="130"
            cx="174"
            cy="174"
            className="backdrop-overlay"
            fill="black"
          />
          <path
            d="M145.126 133.015L221.765 171.686C223.605 172.614 223.595 175.244 221.749 176.158L145.11 214.126C143.448 214.949 141.5 213.74 141.5 211.886V135.247C141.5 133.384 143.463 132.176 145.126 133.015Z"
            strokeWidth="15"
            className="play"
            stroke="red"
          />

          <g className="ring-outer">
            <path d="M183.5 43.5H164L174 11L183.5 43.5Z" />
            <path d="M183.5 304H164L174 336.5L183.5 304Z" />
            <path d="M43.5 164L43.5 183.5L11 173.5L43.5 164Z" />
            <path d="M304 164L304 183.5L336.5 173.5L304 164Z" />
            <circle cx="174" cy="174" r="129" />
          </g>
        </svg>
      </IconStyle>
      {name}
    </ListItemStyle>
  );
};

export default Item;