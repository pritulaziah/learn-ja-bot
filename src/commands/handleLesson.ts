import { Context } from '../context';
import isNumeric from '../utils/isNumeric';
import sanitize from '../utils/santize';

export async function handleLesson(ctx: Context) {
  const match = ctx.match;

  if (typeof match !== 'string') {
    // TODO: this is possible?
    return;
  }

  if (!match) {
    return await ctx.reply(
      sanitize(`Please provide a lesson argument.\nSyntax: <pre>/lesson <lesson_number></pre>`),
      { parse_mode: 'HTML' },
    );
  }

  if (!isNumeric(match)) {
    return await ctx.reply('That is not a valid lesson argument, try again!');
  }

  const lesson = Number(match);
  const lessonWords = await ctx.prisma.word.findMany({ where: { lesson } });

  if (lessonWords.length == 0) {
    return;
  }

  const text = lessonWords.map(
    (lessonWord) =>
      `<b>${lessonWord.japanese}</b> (${lessonWord.romaji}) - <i>${lessonWord.meaning}</i>`,
  );

  return await ctx.reply(sanitize(text.join('\n')), { parse_mode: 'HTML' });
}
