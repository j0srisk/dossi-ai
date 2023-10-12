import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';

const DocumentList = ({ documents, setActiveDocument }) => {
	return (
		<>
			<div className="flex w-fit flex-col items-center gap-2">
				<p className="text-center text-xl font-bold text-neutral-400">Document Preview Window</p>

				<ul>
					{documents.map((document) => (
						<li
							className="text-sm text-neutral-300 hover:cursor-pointer hover:text-neutral-700 hover:underline"
							key={document.id}
							onClick={() => setActiveDocument(document)}
						>
							{document.name}
						</li>
					))}
				</ul>
			</div>
		</>
	);
};

export default DocumentList;
