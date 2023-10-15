import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function Page() {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });
	const { data } = await supabase.from('profiles').select().single();

	const embeddingCost = data.ada_v2_tokens * 0.0000001;
	const gptInputCost = data.gpt_3_turbo_4k_input_tokens * 0.0000015;
	const gptOutputCost = data.gpt_3_turbo_4k_output_tokens * 0.000002;

	return (
		<div className="flex flex-col gap-4 text-neutral-900">
			<div className="items center flex justify-between">
				<div className="flex items-center gap-2">
					<div className="text-2xl font-bold">Account Details</div>
				</div>
			</div>
			<div className="flex w-full flex-1 flex-col gap-6 overflow-visible font-inter">
				<div className="flex flex-col gap-1">
					<p className="text-2xl font-bold">Profile</p>
					<p className="font-bold">Email</p>
					<p className="">{data.email}</p>
				</div>
				<div className="flex flex-col gap-1">
					<p className="text-2xl font-bold">Usage</p>
					<p className="font-bold">Embedding</p>
					<p className="">
						{data.ada_v2_tokens} tokens / ${embeddingCost.toFixed(6)} USD
					</p>
					<p className="font-bold">Input</p>
					<p className="">
						{data.gpt_3_turbo_4k_input_tokens} tokens / ${gptInputCost.toFixed(6)} USD
					</p>
					<p className="font-bold">Output</p>
					<p className="">
						{data.gpt_3_turbo_4k_output_tokens} tokens / ${gptOutputCost.toFixed(6)} USD
					</p>
					<p className="font-bold">Total Cost</p>
					<p className="">${(embeddingCost + gptInputCost + gptOutputCost).toFixed(6)}</p>
				</div>
			</div>
		</div>
	);
}
