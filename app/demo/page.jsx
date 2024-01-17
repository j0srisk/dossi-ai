import { getTopic, getDocuments } from '@/app/utils';
import BackButton from '@/components/BackButton';
import ChatContainer from '@/components/ChatContainer';
import Navbar from '@/components/Navbar';

export default async function DemoPage() {
	const topic = await getTopic('280b8974-866a-49ea-86d9-1feb83702806');

	const documents = await getDocuments(topic.id);

	console.log(documents);

	return (
		<div className="flex h-screen w-screen flex-col">
			<>
				<Navbar>
					<div className="flex flex-1 items-center">
						<div className="w-fit">
							<BackButton />
						</div>
					</div>
					<div className="flex gap-1 font-inter">
						<p className="text-center text-base font-bold text-white">Chatting with</p>
						<div className="flex">
							<p className="bg-gradient-to-r from-accent to-lime-400 bg-clip-text text-center text-base font-bold text-transparent">
								Demo
							</p>
						</div>
						<p className="text-center text-base font-bold text-white">Collection</p>
					</div>
					<div className="flex flex-1 items-center justify-end"></div>
				</Navbar>
				<ChatContainer topic={topic} documents={documents} />
			</>
		</div>
	);
}
