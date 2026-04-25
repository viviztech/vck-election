/**
 * Standalone seed script for VCK public-site content.
 * Run with:  npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-public.ts
 * Uses upsert-by-name so it is safe to run multiple times.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ─── Leaders ──────────────────────────────────────────────────
  const leaders: {
    name: string;
    designation: string;
    order: number;
  }[] = [
    { name: "Thol. Thirumavalavan", designation: "President · MP Chidambaram", order: 1 },
    { name: "D. Ravikumar", designation: "General Secretary · MP Villupuram", order: 2 },
    { name: "Sinthanai Selvan", designation: "MLA Kattumannarkovil", order: 3 },
    { name: "Aloor Sha Navas", designation: "MLA Nagapattinam", order: 4 },
    { name: "Panaiyur M. Babu", designation: "MLA Cheyyur", order: 5 },
    { name: "S.S. Balaji", designation: "MLA Thiruporur", order: 6 },
  ];

  for (const leader of leaders) {
    await prisma.leader.upsert({
      where: { id: `seed-leader-${leader.order}` },
      update: {
        name: leader.name,
        designation: leader.designation,
        order: leader.order,
      },
      create: {
        id: `seed-leader-${leader.order}`,
        name: leader.name,
        designation: leader.designation,
        order: leader.order,
      },
    });
  }
  console.log(`Seeded ${leaders.length} leaders`);

  // ─── Elected Members ──────────────────────────────────────────
  const electedMembers: {
    name: string;
    constituency: string;
    role: string;
  }[] = [
    { name: "Thol. Thirumavalavan", constituency: "Chidambaram", role: "MP" },
    { name: "D. Ravikumar", constituency: "Villupuram", role: "MP" },
    { name: "Sinthanai Selvan", constituency: "Kattumannarkovil", role: "MLA" },
    { name: "Aloor Sha Navas", constituency: "Nagapattinam", role: "MLA" },
    { name: "Panaiyur M. Babu", constituency: "Cheyyur", role: "MLA" },
    { name: "S.S. Balaji", constituency: "Thiruporur", role: "MLA" },
  ];

  for (const [i, member] of electedMembers.entries()) {
    await prisma.electedMember.upsert({
      where: { id: `seed-elected-${i + 1}` },
      update: {
        name: member.name,
        constituency: member.constituency,
        role: member.role,
      },
      create: {
        id: `seed-elected-${i + 1}`,
        name: member.name,
        constituency: member.constituency,
        role: member.role,
      },
    });
  }
  console.log(`Seeded ${electedMembers.length} elected members`);

  // ─── Party Wings ──────────────────────────────────────────────
  const partyWings: {
    name: string;
    nameTA?: string;
    description?: string;
  }[] = [
    { name: "Youth Wing", nameTA: "இளைஞர் அணி", description: "VCK youth organisation" },
    { name: "Women Wing", nameTA: "பெண்கள் அணி", description: "VCK women's organisation" },
    { name: "Students Wing", nameTA: "மாணவர் அணி", description: "VCK student organisation" },
    { name: "Farmers Wing", nameTA: "விவசாயிகள் அணி", description: "VCK farmers organisation" },
    { name: "Workers Wing", nameTA: "தொழிலாளர் அணி", description: "VCK workers organisation" },
    { name: "Lawyers Wing", nameTA: "வழக்கறிஞர் அணி", description: "VCK lawyers organisation" },
    { name: "Doctors Wing", nameTA: "மருத்துவர் அணி", description: "VCK medical professionals organisation" },
  ];

  for (const [i, wing] of partyWings.entries()) {
    await prisma.partyWing.upsert({
      where: { id: `seed-wing-${i + 1}` },
      update: {
        name: wing.name,
        nameTA: wing.nameTA,
        description: wing.description,
      },
      create: {
        id: `seed-wing-${i + 1}`,
        name: wing.name,
        nameTA: wing.nameTA,
        description: wing.description,
      },
    });
  }
  console.log(`Seeded ${partyWings.length} party wings`);

  // ─── News Articles ─────────────────────────────────────────────
  const newsArticles: {
    title: string;
    body: string;
    category: string;
  }[] = [
    {
      title: "VCK Press Release: Upcoming State Conference",
      body: "The Viduthalai Chiruthaigal Katchi announces its upcoming state conference to be held in Chennai. Party workers from all districts are invited to participate.",
      category: "press-release",
    },
    {
      title: "VCK Latest: Party Celebrates Foundation Day",
      body: "VCK celebrated its foundation day with a grand event attended by thousands of party members across Tamil Nadu. Leaders spoke on the party's achievements and future vision.",
      category: "latest",
    },
    {
      title: "Interview with Party President Thol. Thirumavalavan",
      body: "In an exclusive interview, VCK President Thol. Thirumavalavan discusses the party's stance on social justice, Dalit rights, and the upcoming elections.",
      category: "interviews",
    },
  ];

  for (const [i, article] of newsArticles.entries()) {
    await prisma.newsArticle.upsert({
      where: { id: `seed-article-${i + 1}` },
      update: {
        title: article.title,
        body: article.body,
        category: article.category,
      },
      create: {
        id: `seed-article-${i + 1}`,
        title: article.title,
        body: article.body,
        category: article.category,
      },
    });
  }
  console.log(`Seeded ${newsArticles.length} news articles`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
