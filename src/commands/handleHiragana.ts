import { AlphabetForms } from '../types/Alphabet.js';
import { createKanaCommand } from './createKanaCommand.js';

export const handleHiragana = createKanaCommand(AlphabetForms.Hiragana);
