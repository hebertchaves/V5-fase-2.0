// test/conversions/button-with-icons.test.ts
// Adicionar as dependências necessárias
import { describe, it, expect } from '@jest/globals';
import { convertQuasarToFigma } from '../../src/components/converter';
import { defaultSettings } from '../../src/code';

describe('Button with Icons Conversion', () => {
  it('should convert button with left icon correctly', async () => {
    const vueCode = `
      <template>
        <q-btn color="teal">
          <q-icon left size="3em" name="map" />
          <div>Label</div>
        </q-btn>
      </template>
    `;
    
    const result = await convertQuasarToFigma(vueCode, defaultSettings);
    
    // Validar estrutura correta
    expect(result.children[0].name).toBe('q-btn');
    expect(result.children[0].children[0].name).toBe('q-btn__wrapper');
    expect(result.children[0].children[0].children[0].name).toBe('q-btn__content');
    
    // Validar presença do ícone
    const iconNode = result.children[0].children[0].children[0].children[0];
    expect(iconNode.name).toContain('icon');
  });
});