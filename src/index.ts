import * as dotenv from 'dotenv';
import { Bot, Composer } from 'grammy';
import { PrismaClient } from '@prisma/client';
import { Context } from './context';
import attachUser from './middlewares/attachUser';
import { handleHiragana, handleKatakana, handleLesson } from './handlers';
import { inlineQueryWord } from './inlineQueries';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const bot = new Bot<Context>(process.env.TOKEN as string);
  // Install plugin
  bot.use(async (ctx, next) => {
    ctx.prisma = prisma;
    await next();
  });

  // Middlewares
  const composer = new Composer<Context>();
  composer.use(attachUser);
  bot.use(composer);
  // Commands
  bot.command('katakana', handleKatakana);
  bot.command('hiragana', handleHiragana);
  bot.command('lesson', handleLesson);
  // Handlers
  // Inline queries
  bot.inlineQuery(/word/, inlineQueryWord);

  await bot.init();
  await prisma.$connect();

  prisma.$on('beforeExit', async () => {
    await bot.stop();
  });

  await bot.start({
    onStart: () => {
      console.log('Bot running...');
    },
  });
}

main();
