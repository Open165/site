type HighlightedProps = {
  /** Tokens with odd index (1, 3, 5, ...) should be highlighted */
  tokens: string[];
}
export default function Highlighted({ tokens }: HighlightedProps) {
  return <>
    {tokens.map((token, i) => i % 2 === 0 ? token : <mark key={i}>{token}</mark>)}
  </>;
}