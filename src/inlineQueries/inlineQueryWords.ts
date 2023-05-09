import type { InlineQueryResult } from 'grammy/types';
import { Context } from '../context';

const LIMIT = 5;

export async function inlineQueryWord(ctx: Context) {
  const inlineQuery = ctx.inlineQuery;

  if (!inlineQuery) {
    return;
  }

  const searchArray = inlineQuery.query.split(' ');
  searchArray.shift();
  const search = searchArray.join(' ');
  const inlineQueryOffset = inlineQuery.offset;
  const skip = inlineQueryOffset === '' ? 0 : Number(inlineQueryOffset);

  const words = await ctx.prisma.word.findMany({
    skip,
    take: LIMIT,
    where: {
      OR: [{ meaning: { contains: search } }, { romaji: { contains: search } }],
    },
  });

  const result: InlineQueryResult[] = words.map((word) => {
    return {
      type: 'article',
      id: String(word.id),
      title: `${word.japanese} (${word.romaji})`,
      description: word.meaning,
      input_message_content: {
        message_text: `<b>${word.japanese}</b>
<i>${word.romaji}</i>
${word.meaning}`,
        parse_mode: 'HTML'
      },
    };
  });
  const nextOffset = words.length === LIMIT ? String(skip + LIMIT) : '';

  await ctx.answerInlineQuery(result, {
    next_offset: nextOffset,
    cache_time: 60,
  });
}
