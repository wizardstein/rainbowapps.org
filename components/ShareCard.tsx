"use client";

import { useEffect, useState } from "react";

const SHARE_URL = "https://www.rainbowapps.org";
const SHARE_TITLE = "RainbowApps — Ai o idee bună? O construiesc gratis.";
const SHARE_TEXT =
  "Ai o idee de aplicație care ajută oameni, dar nu știi să programezi? Adelin, un programator din Cluj, o construiește gratis — tu păstrezi totul.";

const LINKS = [
  {
    label: "WhatsApp",
    href: `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`,
  },
  {
    label: "Facebook",
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`,
  },
  {
    label: "LinkedIn",
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`,
  },
  {
    label: "X",
    href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`,
  },
];

const pill =
  "rounded-full border border-line bg-crem px-3.5 py-2 text-[13px] font-semibold text-ink-soft transition-colors hover:bg-crem-deep";

/** Share tier: native share sheet on phones (WhatsApp, Messenger, anything
 *  installed), direct platform links + copy elsewhere. The OG tags do the
 *  heavy lifting — every share lands with the full preview card.
 *
 *  On phones the web sharer links (especially Facebook's) fight with the
 *  installed apps and often dead-end, so there we show only the native
 *  share button + WhatsApp (whose deep link is reliable) + copy. */
export default function ShareCard() {
  const [mobileNativeShare, setMobileNativeShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMobileNativeShare(
      typeof navigator !== "undefined" &&
        Boolean(navigator.share) &&
        /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent),
    );
  }, []);

  async function nativeShare() {
    try {
      await navigator.share({
        title: SHARE_TITLE,
        text: SHARE_TEXT,
        url: SHARE_URL,
      });
    } catch {
      // Person closed the sheet — nothing to do.
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard unavailable — the direct links still work.
    }
  }

  const links = mobileNativeShare
    ? LINKS.filter((link) => link.label === "WhatsApp")
    : LINKS;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {mobileNativeShare && (
        <button
          type="button"
          onClick={nativeShare}
          className="rounded-full bg-blue px-4 py-2 font-display text-[13px] font-bold text-white transition-colors hover:bg-blue-deep"
        >
          Distribuie
        </button>
      )}
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={pill}
        >
          {link.label}
        </a>
      ))}
      <button type="button" onClick={copyLink} className={pill} aria-live="polite">
        {copied ? "Copiat ✓" : "Copiază linkul"}
      </button>
    </div>
  );
}
