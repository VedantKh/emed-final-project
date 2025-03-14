// Flexible approach to scenarios that leverages LLM knowledge
import { OpenAI } from "openai";

// Types for flexible scenario definitions
export type ScenarioId =
  | "data_breach"
  | "pandemic_response"
  | "pharma_pricing"
  | string;

// Define flexible scenario that uses minimal data and leverages LLM knowledge
export interface FlexibleScenario {
  id: ScenarioId;
  title: string;
  contextParams: {
    // Key parameters that frame the scenario - minimal but specific
    industryContext: string;
    organizationProfile: string;
    incidentType: string;
    keyStakeholders: string[];
    criticalFactors: string[];
    timeConstraints?: string;
  };
  decisionPoints: {
    topic: string;
    mainQuestion: string;
    keyConsiderations?: string[];
  }[];
  evaluationCriteria: {
    ethical: string[];
    strategic: string[];
  };
}

// Flexible scenario examples that leverage LLM knowledge rather than extensive content files
export const flexibleScenarios: FlexibleScenario[] = [
  {
    id: "data_breach",
    title: "Data Breach & Privacy Crisis",
    contextParams: {
      industryContext:
        "Health insurance company with important patient privacy rules",
      organizationProfile:
        "A large health insurance company with 12.5 million members in 28 states",
      incidentType:
        "A data breach that exposed 2.3 million customers' personal information",
      keyStakeholders: [
        "people whose data was exposed",
        "government regulators",
        "company board members",
        "investors",
        "hospital partners",
      ],
      criticalFactors: [
        "The exposed data includes Social Security numbers and bank information",
        "The breach happened through a third-party system you use",
        "Different states have different rules about how quickly you must tell people (30-60 days)",
        "You could face up to $300 million in fines and lawsuits",
      ],
      timeConstraints:
        "The breach was discovered 3 days ago, and the board meets tomorrow",
    },
    decisionPoints: [
      {
        topic: "Telling People About the Problem",
        mainQuestion:
          "How would you approach telling customers, regulators, and the public about the data breach?",
        keyConsiderations: [
          "Balancing thorough investigation with urgent notification",
          "Legal requirements",
          "Impact on trust",
        ],
      },
      {
        topic: "Helping Affected Customers",
        mainQuestion:
          "What specific steps would you take to protect affected customers and rebuild trust in your company's data security?",
        keyConsiderations: [
          "Credit monitoring services",
          "Compensation for harm",
          "Security improvements",
        ],
      },
      {
        topic: "Taking Responsibility",
        mainQuestion:
          "How would you handle questions about who's responsible for this breach, both within the company and when talking to the public?",
        keyConsiderations: [
          "Leadership changes",
          "Executive responsibility",
          "Legal liability",
        ],
      },
    ],
    evaluationCriteria: {
      ethical: [
        "Being honest with everyone involved",
        "Prioritizing customer protection",
        "Taking responsibility for outcomes",
        "Being fair in how you help affected people",
      ],
      strategic: [
        "Balancing immediate response with long-term reputation",
        "Managing risks effectively",
        "Maintaining good relationships with regulators",
        "Making the organization stronger after the crisis",
      ],
    },
  },
  // Add other scenarios with similar minimal but specific parameters
];

/**
 * Dynamically generates a rich scenario description using the LLM based on minimal parameters
 */
export async function generateScenarioDescription(
  scenario: FlexibleScenario
): Promise<string> {
  const openai = new OpenAI();

  // Create a prompt that instructs the LLM to generate a detailed scenario description
  const prompt = `
    You're helping create an educational exercise for high school students about leadership and decision-making.
    
    Write a clear, engaging description of this scenario for students to respond to:
    
    TITLE: ${scenario.title}
    
    INDUSTRY: ${scenario.contextParams.industryContext}
    
    ORGANIZATION: ${scenario.contextParams.organizationProfile}
    
    PROBLEM: ${scenario.contextParams.incidentType}
    
    PEOPLE INVOLVED: ${scenario.contextParams.keyStakeholders.join(", ")}
    
    IMPORTANT FACTS:
    ${scenario.contextParams.criticalFactors
      .map((factor) => `- ${factor}`)
      .join("\n")}
    
    TIME FRAME: ${scenario.contextParams.timeConstraints}
    
    Format your description with clear headings like "Background," "The Situation," "Key Stakeholders," and "Immediate Concerns." Include specific details that would make the scenario feel real and challenging.
    
    Use straightforward language that a high school student would understand. Avoid complicated business jargon and technical terms. Explain any industry-specific concepts in simple terms.
  `;

  // Call the LLM to generate the scenario description
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1500,
    temperature: 0.7,
  });

  return completion.choices[0].message.content || "";
}

// Similar functions can be created for dynamically generating questions, rubrics, etc.
