import React, { useEffect, useState } from 'react';

const ProxCatalog = () => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const updateSrc = () => {
      if (window.innerWidth >= 768) {
        setSrc('https://e.issuu.com/embed.html?d=prox_catalog_2024&hideIssuuLogo=true&u=racewinningbrands');
      } else {
        setSrc('https://e.issuu.com/embed.html?d=prox_catalog_2024&hideIssuuLogo=true&u=racewinningbrands&pageLayout=singlePage');
      }
    };

    updateSrc();
    window.addEventListener('resize', updateSrc);

    return () => {
      window.removeEventListener('resize', updateSrc);
    };
  }, []);

  if (!src) {
    return null;
  }

  return (
    <div className="relative pt-[max(60%,326px)] h-0 w-full md:w-[80%]">
      <iframe
        loading="lazy"
        allow="clipboard-write"
        sandbox="allow-top-navigation allow-top-navigation-by-user-activation allow-downloads allow-scripts allow-same-origin allow-popups allow-modals allow-popups-to-escape-sandbox allow-forms"
        allowFullScreen
        className="absolute border-none w-full h-[90%] left-0 right-0 top-0 bottom-0"
        src={src}
        data-rocket-lazyload="fitvidscompatible"
        data-lazy-src={src}
        data-cmp-ab="2"
        data-cmp-info="7"
        data-ll-status="loaded"
      />
      <noscript>
        <iframe
          allow="clipboard-write"
          sandbox="allow-top-navigation allow-top-navigation-by-user-activation allow-downloads allow-scripts allow-same-origin allow-popups allow-modals allow-popups-to-escape-sandbox allow-forms"
          allowFullScreen
          className="absolute border-none w-full h-[90%] left-0 right-0 top-0 bottom-0"
          src="https://e.issuu.com/embed.html?d=prox_catalog_2024&hideIssuuLogo=true&u=racewinningbrands&pageLayout=singlePage"
        />
      </noscript>
    </div>
  );
};

export default ProxCatalog;