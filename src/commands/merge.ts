import * as p from '@clack/prompts';
import pc from 'picocolors';

export async function merge() {
  p.intro(pc.blue('🔀 Merge Mode'));
  
  const branch = await p.text({
    message: 'Enter branch to merge',
    placeholder: 'feature/login',
  });
  
  if (p.isCancel(branch)) {
    p.cancel('Merge cancelled');
    return;
  }
  
  const s = p.spinner();
  s.start('Merging branch...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  s.stop('Merge completed');
  
  p.outro(pc.green(`✅ Merged branch "${branch}" successfully!`));
}