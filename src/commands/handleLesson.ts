import { Context } from '../context';
import isNumeric from '../utils/isNumeric';

export async function handleLesson(ctx: Context) {
  const match = ctx.match;

  if (typeof match !== 'string') {
    return;
  }

  if (!match) {
    return await ctx.reply(
      `<b>Please provide a lesson number.</b>\n<code>Syntax: /lesson &lt;lesson_number&gt;</code>`,
      { parse_mode: 'HTML' },
    );
  }

  if (!isNumeric(match)) {
    return await ctx.reply('That is not a valid lesson argument, try again!');
  }

  const lesson = Number(match);
  const lessonWords = await ctx.prisma.word.findMany({ where: { lesson } });

  const text = lessonWords.map(
    (lessonWord) =>
      `<b>${lessonWord.japanese}</b> (${lessonWord.romaji}) - <i>${lessonWord.meaning}</i>`,
  );

  return await ctx.reply(text.join('\n'), { parse_mode: 'HTML' });
}
