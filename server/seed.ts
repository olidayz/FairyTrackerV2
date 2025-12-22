import { db } from "./db";
import { stageDefinitions } from "../shared/schema";
import { eq } from "drizzle-orm";

const stages = [
  { slug: "night-1", label: "Night Stage 1", dayPart: "night" as const, unlockOffsetMinutes: 0, orderIndex: 1 },
  { slug: "night-2", label: "Night Stage 2", dayPart: "night" as const, unlockOffsetMinutes: 0, orderIndex: 2 },
  { slug: "night-3", label: "Night Stage 3", dayPart: "night" as const, unlockOffsetMinutes: 0, orderIndex: 3 },
  { slug: "morning-1", label: "Morning Stage 1", dayPart: "morning" as const, unlockOffsetMinutes: 360, orderIndex: 4 },
  { slug: "morning-2", label: "Morning Stage 2", dayPart: "morning" as const, unlockOffsetMinutes: 360, orderIndex: 5 },
  { slug: "morning-3", label: "Morning Stage 3", dayPart: "morning" as const, unlockOffsetMinutes: 360, orderIndex: 6 },
];

async function seed() {
  console.log("[Seed] Starting database seeding...");

  for (const stage of stages) {
    const existing = await db.select().from(stageDefinitions).where(eq(stageDefinitions.slug, stage.slug));
    
    if (existing.length === 0) {
      await db.insert(stageDefinitions).values(stage);
      console.log(`[Seed] Created stage: ${stage.label}`);
    } else {
      console.log(`[Seed] Stage already exists: ${stage.label}`);
    }
  }

  console.log("[Seed] Database seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("[Seed] Error:", error);
  process.exit(1);
});
