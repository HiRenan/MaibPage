// Intents de compartilhamento — funções puras, sem dep. O endpoint twitter.com/intent/tweet
// é estável (x.com é equivalente). O LinkedIn deprecou texto custom e puxa o Open Graph da
// própria URL, então só mandamos ?url= (o post já emite og:title/og:image no generateMetadata).

const enc = encodeURIComponent;

export function xShareUrl(url: string, title: string): string {
  return `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`;
}

export function linkedinShareUrl(url: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`;
}
