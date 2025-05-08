import * as p from '@clack/prompts';
import pc from 'picocolors';
import { execa } from 'execa';

export async function merge() {
  p.intro(pc.blue('🔀 Merge Mode'));
  
  const branchResult = await p.text({
    message: 'Enter branch to merge',
    placeholder: 'feature/login',
  });
  
  if (p.isCancel(branchResult)) {
    p.cancel('Merge cancelled');
    return;
  }
  
  if (!branchResult || branchResult.trim() === '') {
    p.outro(pc.red('❌ Branch name cannot be empty'));
    return;
  }
  
  const s = p.spinner();
  s.start('Merging branch...');
  
  try {
    await executeGitMerge(branchResult);
    s.stop('Merge completed');
    p.outro(pc.green(`✅ Merged branch "${branchResult}" successfully!`));
  } catch (error) {
    s.stop('Merge failed');
    p.outro(pc.red(`❌ Failed to merge: ${error instanceof Error ? error.message : String(error)}`));
  }
}

const executeGitMerge = async (branch: string): Promise<void> => {
  try {
    await execa('git', ['merge', branch], { stdio: 'inherit' });
  } catch (error) {
    throw new Error(`Git merge failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};
