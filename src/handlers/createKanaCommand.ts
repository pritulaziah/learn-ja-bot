import { Context } from '../context.js';
import { AlphabetForms } from '../types/Alphabet.js';

export const createKanaCommand =
  (form: AlphabetForms) => async (ctx: Context) => {
    const argument = ctx.match as string;

    if (argument === '') {
      return await ctx.reply(`Please tell me what ${form} you want?`);
    }

    const kana = await ctx.prisma.kana.findFirst({
      where: {
        OR: [{ romaji: argument }, { ru: argument }],
      },
    });

    if (kana != null) {
      return await ctx.reply(`You ${form} is ${kana[form]}`);
    }

    return await ctx.reply("I' dont understand u!");
  };
