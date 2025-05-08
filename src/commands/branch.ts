import * as p from '@clack/prompts';
import { execa } from 'execa';
import pc from 'picocolors';

export const branch = async () => {
  p.intro(pc.blue('🌿 Branch Operations'));

  const action = await p.select({
    message: 'Branch operations',
    options: [
      { value: 'list', label: '📋 List branches', hint: 'Show all branches' },
      { value: 'create', label: '➕ Create branch', hint: 'Create new branch' },
      { value: 'delete', label: '🗑️ Delete branch', hint: 'Delete branch' },
    ],
  });

  if (p.isCancel(action)) {
    p.cancel('Operation cancelled');
    return;
  }

  const operations = {
    list: () => listBranches(),
    create: () => createBranch(),
    delete: () => deleteBranch(),
  };

  try {
    await operations[action as keyof typeof operations]();
    p.outro(pc.green('✅ Branch operation completed!'));
  } catch (error) {
    p.outro(pc.red(`❌ Failed: ${error instanceof Error ? error.message : String(error)}`));
  }
};

const listBranches = async () => {
  const s = p.spinner();
  s.start('Listing branches...');
  await execa('git', ['branch', '--list'], { stdio: 'inherit' });
  s.stop('Branches listed');
};

const createBranch = async () => {
  const branchName = await p.text({
    message: 'Enter branch name',
    validate: (value) => {
      if (!value) return 'Branch name is required';
    },
  });
  
  if (p.isCancel(branchName)) {
    p.cancel('Branch creation cancelled');
    return;
  }
  
  const s = p.spinner();
  s.start(`Creating branch ${branchName}...`);
  await execa('git', ['checkout', '-b', branchName], { stdio: 'inherit' });
  s.stop(`Branch ${branchName} created`);
};

const deleteBranch = async () => {
  const { stdout: branchOutput } = await execa('git', ['branch', '--list']);
  
  const branchOptions = branchOutput
    .split('\n')
    .filter(b => !b.includes('*') && b.trim())
    .map(b => ({
      value: b.trim(),
      label: b.trim(),
    }));
  
  if (branchOptions.length === 0) {
    p.note('No branches available for deletion', 'Warning');
    return;
  }
  
  const branchToDelete = await p.select({
    message: 'Select branch to delete',
    options: branchOptions,
  });
  
  if (p.isCancel(branchToDelete)) {
    p.cancel('Branch deletion cancelled');
    return;
  }
  
  const s = p.spinner();
  s.start(`Deleting branch ${branchToDelete}...`);
  await execa('git', ['branch', '-d', branchToDelete], { stdio: 'inherit' });
  s.stop(`Branch ${branchToDelete} deleted`);
};