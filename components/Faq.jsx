'use client';

import FaqItem from '@/components/FaqItem';
import { useState } from 'react';

export default function Faq() {
	const [active, setActive] = useState(0);

	return (
		<div className="flex w-full flex-col rounded-lg border border-neutral-300 bg-white shadow-sm">
			<FaqItem
				active={active}
				setActive={setActive}
				index={0}
				question="What is Dossi?"
				answer="Dossi is a document management system that uses AI to automatically tag and categorize your documents."
			/>
			<div className="border-b border-neutral-300" />
			<FaqItem
				active={active}
				setActive={setActive}
				index={1}
				question="How does Dossi work?"
				answer="Dossi uses the power of AI to automatically process your documents and make them AI searchable."
			/>
			<div className="border-b border-neutral-300" />
			<FaqItem
				active={active}
				setActive={setActive}
				index={2}
				question="How do I get started?"
				answer="Simply upload your documents and Dossi will do the rest!"
			/>
			<div className="border-b border-neutral-300" />
			<FaqItem
				active={active}
				setActive={setActive}
				index={3}
				question="What types of documents can I upload?"
				answer="Dossi currently only supports PDF documents."
			/>
		</div>
	);
}
