const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.channel.findMany({
  where: { formId: 'test' },
  include: { _count: { select: { submissions: true } } },
}).then(r => console.log(JSON.stringify(r))).catch(e => console.error('Error:', e.message)).finally(() => prisma.$disconnect().catch(() => {}));
