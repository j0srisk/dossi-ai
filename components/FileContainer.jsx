'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect, useRef } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.js',
	import.meta.url,
).toString();

const FileContainer = ({ document, page, setPage }) => {
	const refContainer = useRef(null);
	const [documentUrl, setDocumentUrl] = useState(null);
	const [containerWidth, setContainerWidth] = useState(0);
	const [numPages, setNumPages] = useState(null);
	const [rendered, setRendered] = useState(false);

	const supabase = createClientComponentClient();

	useEffect(() => {
		if (refContainer.current) {
			handleContainerResize();
		}

		window.addEventListener('resize', handleContainerResize);

		return () => {
			window.removeEventListener('resize', handleContainerResize);
		};
	}, []);

	const handleContainerResize = () => {
		setContainerWidth(refContainer.current.offsetWidth);
	};

	const downloadFile = async () => {
		const { data, error } = await supabase.storage.from('documents').download(document.url);
		if (error) {
			console.error(error);
			return;
		}

		const url = URL.createObjectURL(data);

		setDocumentUrl(url);
	};

	useEffect(() => {
		const tempPage = page;
		setRendered(false);
		downloadFile();
		setPage(tempPage);
	}, [document]);

	function onDocumentLoadSuccess({ numPages: nextNumPages }) {
		setNumPages(nextNumPages);
	}

	useEffect(() => {
		if (page === null) {
			return;
		}

		if (rendered) {
			setPage(null);
		}
	}, [page, rendered]);

	return (
		<div className="flex h-full w-full flex-col overflow-scroll p-4">
			<div className="flex h-full" ref={refContainer}>
				{documentUrl ? (
					<Document file={documentUrl} onLoadSuccess={onDocumentLoadSuccess} loading={null}>
						<div className="flex flex-col gap-2 pb-4">
							{Array.from(new Array(numPages), (el, index) => (
								<div className="shadow-md" key={`page_${index + 1}`}>
									<Page
										key={`page_${index + 1}`}
										inputRef={(ref) => {
											if (ref && page === index + 1) {
												ref.scrollIntoView({ behavior: 'smooth' });
											}
										}}
										pageNumber={index + 1}
										width={containerWidth}
										loading={null}
										onRenderSuccess={() => {
											if (numPages === index + 1) {
												setRendered(true);
												console.log('rendered');
											}
										}}
									/>
								</div>
							))}
						</div>
					</Document>
				) : (
					<div className="flex flex-1 items-center justify-center bg-white shadow-md">
						Loading....
					</div>
				)}
			</div>
		</div>
	);
};

export default FileContainer;
