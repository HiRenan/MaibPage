import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { JsonLd } from '@/components/json-ld';

describe('JsonLd', () => {
  it('renderiza <script type="application/ld+json"> com o JSON do data', () => {
    const data = { '@context': 'https://schema.org', '@type': 'Person', name: 'Renan Mocelin' };
    const { container } = render(<JsonLd data={data} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(JSON.parse(script!.textContent!)).toEqual(data);
  });

  it('escapa "<" pra um título com </script> não quebrar o documento', () => {
    const { container } = render(<JsonLd data={{ headline: 'a </script> b' }} />);
    const script = container.querySelector('script[type="application/ld+json"]')!;

    // O "<" cru não aparece; virou <. E ainda assim faz parse de volta ao original.
    expect(script.innerHTML).not.toContain('</script>');
    expect(script.innerHTML).toContain('\\u003c');
    expect(JSON.parse(script.textContent!)).toEqual({ headline: 'a </script> b' });
  });
});
