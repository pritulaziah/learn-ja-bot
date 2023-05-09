import { AlphabetForms } from '../types/Alphabet.js';
import { createKanaCommand } from './createKanaCommand.js';

export const handleKatakana = createKanaCommand(AlphabetForms.Katakana);
