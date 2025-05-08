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

const getRepoUrl = () => p.text({
	message: 'Enter repository URL',
	placeholder: 'https://github.com/username/repo.git',
});

const executeGitProcess = async (args: string[], operation: string): Promise<void> => {
	try {
		await execa('git', args, { stdio: 'inherit' });
	} catch (error) {
		throw new Error(`Git ${operation} failed: ${error instanceof Error ? error.message : String(error)}`);
	}
};

const executeGitCommand = async (baseArgs: string[], operation: string): Promise<void> => {
	const args = [...baseArgs];
	
	if (operation === 'clone') {
		const repoUrl = await getRepoUrl();
		
		if (p.isCancel(repoUrl) || !repoUrl) {
			p.cancel('Operation cancelled');
			return;
		}
		
		args.push(repoUrl);
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
		message: 'Select remote operation:',
		options: [
			{ value: 'clone', label: 'Clone   ', hint: 'Clone a repository' },
			{ value: 'push', label: 'Push    ', hint: 'Push to remote' },
			{ value: 'pull', label: 'Pull    ', hint: 'Pull from remote' },
			{ value: 'fetch', label: 'Fetch   ', hint: 'Fetch from remote' },
		],
	});

const operations = {
	clone: async () => executeGitCommand(['clone'], 'clone'),
	push: async () => executeGitCommand(['push'], 'push'),
	pull: async () => executeGitCommand(['pull'], 'pull'),
	fetch: async () => executeGitCommand(['fetch'], 'fetch'),
};

export async function remote() {
	p.intro(pc.blue('🌐 Remote Operations'));

	const action = await getSelectedOperation();

	if (p.isCancel(action)) {
		p.cancel('Remote operation cancelled');
		return;
	}

	try {
		await (operations[action as keyof typeof operations] || (() => {}))();
	} catch (error) {
		p.outro(pc.red(`❌ Failed: ${error instanceof Error ? error.message : String(error)}`));
		return;
	}

	p.outro(pc.green('✅ Remote operation completed!'));
}
