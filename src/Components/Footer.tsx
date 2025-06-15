import * as React from 'react';

const Footer: React.FunctionComponent = () => {
  return (
    <p className="absolute bottom-4 text-xs left-4 text-white opacity-75">
      Made by <a href="https://borisgrunwald.me" className="underline">Boris Grunwald</a>
    </p>
  );
};

export default Footer;