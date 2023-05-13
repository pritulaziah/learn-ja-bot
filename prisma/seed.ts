import { PrismaClient, Word } from '@prisma/client';
import path from 'path';
import { promises as fsPromises } from 'fs';
import kana from './kana.json';

const prisma = new PrismaClient();

async function main() {
  const kanaCollection = await prisma.$transaction(
    kana.map((cur) =>
      prisma.kana.upsert({
        where: { romaji: cur.romaji },
        update: {},
        create: cur,
      }),
    ),
  );

  const wordsFolder = path.join(process.cwd(), '/prisma/', '/words/');
  const dirFiles = await fsPromises.readdir(wordsFolder, {
    withFileTypes: true,
  });
  const lessonsWords = await Promise.all(
    dirFiles.map(async (file) => {
      const fileContent = await fsPromises.readFile(
        path.join(wordsFolder, file.name),
        'utf-8',
      );
      const baseFileName = path.parse(file.name).name;
      const isLessonWords = baseFileName.startsWith('lesson');
      const lesson = isLessonWords ? Number(baseFileName.replace(/^\D+/g, '')) : null;
      const lessonWords = JSON.parse(fileContent) as Omit<Word, 'lesson'>[];

      return lessonWords.map(lessonWord => ({ ...lessonWord, lesson })) as Word[];
    }),
  );

  const wordsCollection = await prisma.$transaction(
    lessonsWords.flat().map((cur) =>
      prisma.word.upsert({
        where: { japanese: cur.japanese },
        update: {},
        create: cur,
      }),
    ),
  );

  console.log({
    kanaCollection: kanaCollection.length,
    wordsCollection: wordsCollection.length,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
