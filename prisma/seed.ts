import { PrismaClient, Role, ResourceType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@knowledgehub.local";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const hash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { name: process.env.ADMIN_NAME || "Knowledge Hub Admin", passwordHash: hash, role: Role.ADMIN },
    create: { name: process.env.ADMIN_NAME || "Knowledge Hub Admin", email, passwordHash: hash, role: Role.ADMIN }
  });

  const count = await prisma.resource.count();
  if (!count) {
    await prisma.resource.createMany({ data: [
      { title: "Introduction to Python", description: "Start coding with variables, loops, and functions.", type: ResourceType.CLASS, subject: "Programming", level: "Beginner", url: "https://www.youtube.com/results?search_query=python+beginner+course" },
      { title: "Data Structures Quick Notes", description: "A concise revision guide for arrays, stacks, queues, and trees.", type: ResourceType.NOTE, subject: "Computer Science", level: "Beginner", url: "https://developer.mozilla.org/" },
      { title: "Explore a 3D Learning Scene", description: "An interactive 3D object you can rotate and explore.", type: ResourceType.ANIMATION, subject: "Interactive Learning", level: "All levels", url: "/learn/3d" },
      { title: "Web Development Roadmap", description: "HTML, CSS, JavaScript, React, and Next.js learning links.", type: ResourceType.RESOURCE, subject: "Web Development", level: "Beginner", url: "https://nextjs.org/learn" }
    ]});
  }
}
main().finally(() => prisma.$disconnect());
