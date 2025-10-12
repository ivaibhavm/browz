import { StepType, type Step} from "./types";

export function parseSteps(response: string): Step[] {
    const xmlMatch = response.match(/<Artifact[^>]*>([\s\S]*?)<\/Artifact>/);
    
    if (!xmlMatch) {
      return [];
    }

    const xmlContent = xmlMatch[1];
    const steps: Step[] = [];
    let stepId = 1;
  
    const actionRegex = /<Action\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/Action>/g;
    
    let match;
    while ((match = actionRegex.exec(xmlContent)) !== null) {
      const [, type, filePath, content] = match;
  
      if (type === 'file') {
        steps.push({
          id: stepId++,
          title: `Create ${filePath || 'file'}`,
          description: '',
          type: StepType.CreateFile,
          status: 'pending',
          code: content.trim(),
          path: filePath
        });
      } else if (type === 'shell') {
        steps.push({
          id: stepId++,
          title: 'Run command',
          description: '',
          type: StepType.RunScript,
          status: 'pending',
          code: content.trim()
        });
      }
    }
  
    return steps;
}