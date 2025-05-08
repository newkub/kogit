import * as p from '@clack/prompts';
import pc from 'picocolors';
import { spawn } from 'child_process';

export async function commit() {
  p.intro(pc.blue('📝 Commit Mode'));
  
  const message = await p.text({
    message: 'Enter commit message',
    placeholder: 'fix: bug in login page',
  });
  
  if (p.isCancel(message)) {
    p.cancel('Commit cancelled');
    return;
  }
  
  const s = p.spinner();
  s.start('Committing changes...');
  
  try {
    await executeGitCommit(message);
    s.stop('Commit completed');
    p.outro(pc.green(`✅ Commit "${message}" completed!`));
  } catch (error) {
    s.stop('Commit failed');
    p.outro(pc.red(`❌ Failed to commit: ${error instanceof Error ? error.message : String(error)}`));
  }
}

async function executeGitCommit(message: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn('git', ['commit', '-m', message], {
      stdio: 'inherit'
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Git commit failed with code ${code}`));
      }
    });
  });
}