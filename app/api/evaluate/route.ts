import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ScenarioId } from '@/app/lib/scenarios';
import { constructEvaluationPrompt } from '@/app/lib/evaluation';

// Server-side functions to load content
async function loadScenarioRubric(scenarioId: ScenarioId): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), 'app/scenarios/rubrics', `${scenarioId}.md`);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Failed to load rubric for ${scenarioId}:`, error);
    return 'Rubric content not available';
  }
}

async function loadScenarioExamples(scenarioId: ScenarioId): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), 'app/scenarios/examples', `${scenarioId}.md`);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Failed to load examples for ${scenarioId}:`, error);
    return 'Example content not available';
  }
}

async function loadRealWorldExamples(scenarioId: ScenarioId): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), 'app/scenarios/examples', `${scenarioId}_real_world.md`);
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Failed to load real-world examples for ${scenarioId}:`, error);
    return 'Real-world example content not available';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transcriptText, scenarioId } = body;
    
    // Validate required parameters
    if (!transcriptText || !scenarioId) {
      return NextResponse.json(
        { error: 'Missing required parameters (transcriptText or scenarioId)' },
        { status: 400 }
      );
    }
    
    // Load scenario-specific content
    const rubric = await loadScenarioRubric(scenarioId as ScenarioId);
    const examples = await loadScenarioExamples(scenarioId as ScenarioId);
    const realWorldExamples = await loadRealWorldExamples(scenarioId as ScenarioId);
    
    // Basic response for now - we'll expand this in future steps
    return NextResponse.json({
      status: 'success',
      message: 'Evaluation request received',
      data: {
        scenarioId,
        transcriptLength: transcriptText.length,
        prompt: {
          rubric: rubric.slice(0, 100) + '...',  // Preview only
          examples: examples.slice(0, 100) + '...',  // Preview only
          realWorldExamples: realWorldExamples.slice(0, 100) + '...'  // Preview only
        }
      }
    });
    
  } catch (error) {
    console.error('Error in evaluation endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to process evaluation request' },
      { status: 500 }
    );
  }
} 