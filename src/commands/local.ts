import * as p from '@clack/prompts';
import pc from 'picocolors';
import { execa } from 'execa';

const createSpinner = (operation: string) => {
  const spinner = p.spinner();
  return {
    start: () => spinner.start(`Executing git ${operation}...`),
    stop: (success: boolean) => spinner.stop(
      success ? `Git ${operation} completed` : `Git ${operation} failed`
    )
  };
};

const executeGitProcess = async (args: string[], operation: string): Promise<void> => {
  try {
    await execa('git', args, { stdio: 'inherit' });
  } catch (error) {
    throw new Error(`Git ${operation} failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

const getBranchName = async (): Promise<string | symbol> => 
  p.text({
    message: 'Enter branch name',
    placeholder: 'main',
  });

const executeGitCommand = async (baseArgs: string[], operation: string): Promise<void> => {
  const args = [...baseArgs];
  
  if (operation === 'checkout') {
    const branchName = await getBranchName();
    
    if (p.isCancel(branchName) || !branchName) {
      p.cancel('Operation cancelled');
      return;
    }
    
    args.push(branchName);
  }
  
  const spinner = createSpinner(operation);
  spinner.start();
  
  try {
    await executeGitProcess(args, operation);
    spinner.stop(true);
  } catch (error) {
    spinner.stop(false);
    throw error;
  }
};

const getSelectedOperation = () => 
  p.select({
    message: 'Select local operation:',
    options: [
      { value: 'branch', label: '🌿 Branch   ', hint: 'List/create branches' },
      { value: 'checkout', label: '🔀 Checkout ', hint: 'Switch branches' },
      { value: 'status', label: '📊 Status   ', hint: 'View repository status' },
      { value: 'log', label: '📜 Log      ', hint: 'View commit history' },
    ],
  });

const operations = {
  branch: async () => executeGitCommand(['branch'], 'branch'),
  checkout: async () => executeGitCommand(['checkout'], 'checkout'),
  status: async () => executeGitCommand(['status'], 'status'),
  log: async () => executeGitCommand(['log', '--oneline', '--graph'], 'log'),
};

export async function local() {
  p.intro(pc.blue('🏠 Local Operations'));

  const action = await getSelectedOperation();

  if (p.isCancel(action)) {
    p.cancel('Local operation cancelled');
    return;
  }

  try {
    await (operations[action as keyof typeof operations] || (() => {}))();
  } catch (error) {
    p.outro(pc.red(`❌ Failed: ${error instanceof Error ? error.message : String(error)}`));
    return;
  }

  p.outro(pc.green('✅ Local operation completed!'));
}