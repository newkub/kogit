import * as p from '@clack/prompts';
import pc from 'picocolors';
import { execa } from 'execa';

export async function commit() {
  p.intro(pc.blue('📝 Commit Mode'));
  
  const messageResult = await p.text({
    message: 'Enter commit message',
    placeholder: 'fix: bug in login page',
  });
  
  if (p.isCancel(messageResult)) {
    p.cancel('Commit cancelled');
    return;
  }
  
  if (!messageResult || messageResult === '') {
    p.outro(pc.red('❌ Commit message cannot be empty'));
    return;
  }
  
  const s = p.spinner();
  s.start('Committing changes...');
  
  try {
    await executeGitCommit(messageResult);
    s.stop('Commit completed');
    p.outro(pc.green(`✅ Commit "${messageResult}" completed!`));
  } catch (error) {
    s.stop('Commit failed');
    p.outro(pc.red(`❌ Failed to commit: ${error instanceof Error ? error.message : String(error)}`));
  }
}

const executeGitCommit = async (message: string): Promise<void> => {
  try {
    await execa('git', ['commit', '-m', message], { stdio: 'inherit' });
  } catch (error) {
    throw new Error(`Git commit failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};