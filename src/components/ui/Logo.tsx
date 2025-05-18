import React from 'react';

interface LogoProps {
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M263 112H450C461 112 470 121 470 132V190C470 201 461 210 450 210H263C252 210 243 201 243 190V132C243 121 252 112 263 112Z"
        fill="white"
      />
      <path
        d="M263 302H450C461 302 470 311 470 322V380C470 391 461 400 450 400H263C252 400 243 391 243 380V322C243 311 252 302 263 302Z"
        fill="white"
      />
      <path
        d="M62 302H249C260 302 269 311 269 322V380C269 391 260 400 249 400H62C51 400 42 391 42 380V322C42 311 51 302 62 302Z"
        fill="white"
      />
      <path
        d="M156 112C156 101 165 92 176 92H234C245 92 254 101 254 112V380C254 391 245 400 234 400H176C165 400 156 391 156 380V112Z"
        fill="white"
      />
    </svg>
  );
};

export default Logo;