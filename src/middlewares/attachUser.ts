import { NextFunction } from 'grammy';
import { Context } from '../context.js';

const attachUser = async (ctx: Context, next: NextFunction) => {
  if (!ctx.from) {
    return;
  }

  const { id: telegramId } = ctx.from;

  await ctx.prisma.user.upsert({
    where: { telegramId },
    update: {},
    create: { telegramId },
  });

  return next();
};

export default attachUser;
