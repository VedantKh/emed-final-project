import path from "path";

// Define scenario types
export type ScenarioId = "data_breach" | "pandemic_response" | "pharma_pricing";

export interface Scenario {
  id: ScenarioId;
  title: string;
  description: string;
}

// Available scenarios
export const scenarios: Scenario[] = [
  {
    id: "data_breach",
    title: "Data Breach & Privacy Crisis",
    description:
      "Responding to a major cybersecurity incident exposing 2.3M members' protected health information.",
  },
  {
    id: "pandemic_response",
    title: "Pandemic Response Crisis",
    description:
      "Managing coverage policies, telehealth expansion, and provider network strain during a major infectious disease outbreak.",
  },
  {
    id: "pharma_pricing",
    title: "Pharmaceutical Pricing Crisis",
    description:
      "Navigating public backlash after denying coverage for a breakthrough but extremely expensive cancer treatment.",
  },
];

/**
 * Loads a scenario's rubric content
 */
export async function loadScenarioRubric(
  scenarioId: ScenarioId
): Promise<string> {
  try {
    const filePath = path.join(
      process.cwd(),
      "app/scenarios/rubrics",
      `${scenarioId}.md`
    );
    const content = await fs.promises.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    console.error(`Failed to load rubric for ${scenarioId}:`, error);
    return "Rubric content not available";
  }
}

/**
 * Loads benchmark examples for a scenario
 */
export async function loadScenarioExamples(
  scenarioId: ScenarioId
): Promise<string> {
  try {
    const filePath = path.join(
      process.cwd(),
      "app/scenarios/examples",
      `${scenarioId}.md`
    );
    const content = await fs.promises.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    console.error(`Failed to load examples for ${scenarioId}:`, error);
    return "Example content not available";
  }
}

/**
 * Loads real-world CEO examples for a scenario
 */
export async function loadRealWorldExamples(
  scenarioId: ScenarioId
): Promise<string> {
  try {
    const filePath = path.join(
      process.cwd(),
      "app/scenarios/examples",
      `${scenarioId}_real_world.md`
    );
    const content = await fs.promises.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    console.error(
      `Failed to load real-world examples for ${scenarioId}:`,
      error
    );
    return "Real-world example content not available";
  }
}
