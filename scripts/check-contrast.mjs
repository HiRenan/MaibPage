/* global console, process */

/**
 * Verificador de contraste WCAG dos tokens OKLCH do design system.
 * F15 / MAI-536 — ferramenta manual repetível (NÃO roda em CI).
 *
 * Uso: node scripts/check-contrast.mjs
 *
 * Pipeline: OKLCH -> OKLab -> sRGB linear (coeficientes Ottosson) ->
 *           luminância relativa WCAG -> razão de contraste.
 *
 * Os valores espelham app/globals.css (:root) — manter em sincronia.
 *
 * Pitfall: o sRGB do Ottosson já é linear-light. NÃO reaplicar o decode de
 * gama ((c+0.055)/1.055)^2.4 (esse passo é o próprio sRGB->linear, já feito);
 * usa-se R/G/B direto na luminância.
 */

const DEG = Math.PI / 180;

// OKLCH [L, C, H graus] -> sRGB linear {r, g, b} (Ottosson).
function oklchToLinear(L, C, H) {
  const a = C * Math.cos(H * DEG);
  const b = C * Math.sin(H * DEG);

  const lp = L + 0.3963377774 * a + 0.2158037573 * b;
  const mp = L - 0.1055613458 * a - 0.0638541728 * b;
  const sp = L - 0.0894841775 * a - 1.291485548 * b;

  const l = lp * lp * lp;
  const m = mp * mp * mp;
  const s = sp * sp * sp;

  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

// Luminância relativa WCAG a partir de OKLCH (sRGB linear = linear-light).
function luminance([L, C, H]) {
  const { r, g, b } = oklchToLinear(L, C, H);
  return 0.2126 * clamp01(r) + 0.7152 * clamp01(g) + 0.0722 * clamp01(b);
}

// Razão de contraste WCAG entre dois tokens OKLCH.
function contrast(fg, bg) {
  const lf = luminance(fg);
  const lb = luminance(bg);
  const hi = Math.max(lf, lb);
  const lo = Math.min(lf, lb);
  return (hi + 0.05) / (lo + 0.05);
}

// Tokens OKLCH [L, C, H] — espelho de app/globals.css (:root).
const TOKENS = {
  background: [0.17, 0.006, 70],
  foreground: [0.92, 0.012, 85],
  card: [0.205, 0.007, 70],
  'card-foreground': [0.92, 0.012, 85],
  popover: [0.215, 0.008, 70],
  'popover-foreground': [0.92, 0.012, 85],
  muted: [0.255, 0.008, 70],
  'muted-foreground': [0.722, 0.014, 75],
  secondary: [0.255, 0.008, 70],
  'secondary-foreground': [0.92, 0.012, 85],
  accent: [0.275, 0.009, 70],
  'accent-foreground': [0.92, 0.012, 85],
  border: [0.32, 0.008, 72],
  primary: [0.7, 0.142, 58],
  'primary-foreground': [0.18, 0.022, 60],
  ring: [0.7, 0.142, 58],
  // F15: L 0.585 -> 0.52 para AA com destructive-foreground (>=4.5:1).
  destructive: [0.52, 0.17, 25],
  'destructive-foreground': [0.96, 0.01, 80],
};

const TEXT = 4.5;
const NON_TEXT = 3.0;

// 14 pares. type: 'text' (>=4.5) | 'ui' (>=3.0) | 'decorative' (isento 1.4.11).
const PAIRS = [
  ['foreground', 'background', 'text'],
  ['foreground', 'card', 'text'],
  ['foreground', 'popover', 'text'],
  ['muted-foreground', 'background', 'text'],
  ['muted-foreground', 'card', 'text'],
  ['card-foreground', 'card', 'text'],
  ['popover-foreground', 'popover', 'text'],
  ['secondary-foreground', 'secondary', 'text'],
  ['accent-foreground', 'accent', 'text'],
  ['primary-foreground', 'primary', 'text'],
  ['destructive-foreground', 'destructive', 'text'],
  ['ring', 'background', 'ui'],
  ['ring', 'card', 'ui'],
  ['border', 'background', 'decorative'],
];

// Âncoras de validação do port — reproduzem a medição prévia (grilling).
// destructive usa o L pré-nudge (0.585): documenta o 4.06 original.
const SELF_CHECK = [
  ['foreground / background', [0.92, 0.012, 85], [0.17, 0.006, 70], 15.1],
  ['muted-foreground / background', [0.722, 0.014, 75], [0.17, 0.006, 70], 7.76],
  ['primary-foreground / primary', [0.18, 0.022, 60], [0.7, 0.142, 58], 6.88],
  [
    'destructive-foreground / destructive (pre-nudge L0.585)',
    [0.96, 0.01, 80],
    [0.585, 0.17, 25],
    4.06,
  ],
  ['border / background', [0.32, 0.008, 72], [0.17, 0.006, 70], 1.51],
];

const ratio = (n) => `${n.toFixed(2)}:1`;
const pad = (s, n) => String(s).padEnd(n);

function main() {
  console.log('Contraste WCAG — tokens OKLCH do design system (F15 / MAI-536)');
  console.log('Pipeline: OKLCH -> OKLab -> sRGB linear (Ottosson) -> luminancia WCAG -> razao.\n');

  console.log('Self-check do port (reproduz a medicao previa):');
  let portOk = true;
  for (const [label, fg, bg, expected] of SELF_CHECK) {
    const got = contrast(fg, bg);
    const tol = Math.max(0.1, expected * 0.02);
    const ok = Math.abs(got - expected) <= tol;
    if (!ok) portOk = false;
    console.log(
      `  ${ok ? 'ok' : 'XX'}  ${pad(label, 54)} ${pad(ratio(got), 9)} (esperado ~${expected})`,
    );
  }
  console.log('');

  if (!portOk) {
    console.log('ERRO: o port nao reproduz os ancoras de contraste. Abortando.');
    process.exitCode = 1;
    return;
  }

  const exempt = PAIRS.filter(([, , type]) => type === 'decorative').length;
  console.log(`Pares (${PAIRS.length}):`);
  console.log(`  ${pad('PAR', 46)} ${pad('RAZAO', 9)} ${pad('LIMITE', 7)} STATUS`);

  let failed = 0;
  let required = 0;
  for (const [fgName, bgName, type] of PAIRS) {
    const r = contrast(TOKENS[fgName], TOKENS[bgName]);
    const label = `${fgName} / ${bgName}`;
    let limit;
    let status;
    if (type === 'decorative') {
      limit = 'n/a';
      status = 'EXEMPT (SC 1.4.11)';
    } else {
      const threshold = type === 'text' ? TEXT : NON_TEXT;
      limit = threshold.toFixed(1);
      required += 1;
      const pass = r >= threshold;
      if (!pass) failed += 1;
      status = pass ? 'PASS' : 'FAIL';
    }
    console.log(`  ${pad(label, 46)} ${pad(ratio(r), 9)} ${pad(limit, 7)} ${status}`);
  }

  console.log('');
  console.log(
    `Resumo: ${required - failed}/${required} obrigatorios PASS | ${exempt} isento | ${failed} reprovado(s)`,
  );
  console.log(`RESULTADO: ${failed === 0 ? 'PASS' : 'FAIL'}`);
  if (failed > 0) process.exitCode = 1;
}

main();
