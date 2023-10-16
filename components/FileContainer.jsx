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

export default function FileContainer({ document, page, setPage, children }) {
	const refContainer = useRef(null);
	const [documentUrl, setDocumentUrl] = useState(null);
	const [containerWidth, setContainerWidth] = useState(0);
	const [numPages, setNumPages] = useState(null);
	const [rendered, setRendered] = useState(false);
	const [zoom, setZoom] = useState(1);
	const [newPage, setNewPage] = useState(page);

	const supabase = createClientComponentClient();

	useEffect(() => {
		if (refContainer.current) {
			handleContainerResize();
		}

		window.addEventListener('resize', handleContainerResize);

		return () => {
			window.removeEventListener('resize', handleContainerResize);
		};
	}, [zoom]);

	useEffect(() => {
		setNewPage(page);
	}, [page]);

	const handleContainerResize = () => {
		setContainerWidth((refContainer.current.offsetWidth - 32) * zoom);
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
		setRendered(false);
		downloadFile();
		if (!page) {
			setPage(1);
		}
	}, [document]);

	function onDocumentLoadSuccess({ numPages: nextNumPages }) {
		setNumPages(nextNumPages);
	}

	return (
		<div className="relative flex h-full flex-col">
			<div className="z-20 flex h-12 w-full justify-between border-b border-neutral-300 bg-white p-2 text-neutral-500 shadow-sm">
				<div className="flex h-full flex-1 items-center justify-start gap-1">
					<button onClick={() => setPage(page - 1)} disabled={page === 1}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.25}
							stroke="currentColor"
							className="h-6 w-6 stroke-neutral-300 transition-all duration-300 ease-in-out hover:stroke-neutral-500"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
						</svg>
					</button>
					<input
						className="h-full w-8 rounded-md border border-neutral-300 bg-transparent text-center outline-none"
						value={newPage}
						onChange={(e) => {
							const value = e.target.value;
							if (!isNaN(value) || value == '') {
								setNewPage(value);
							}
						}}
						onBlur={() => {
							if (newPage > numPages) {
								setNewPage(numPages);
								setPage(parseInt(numPages));
							} else if (newPage < 1) {
								setNewPage(1);
								setPage(1);
							} else {
								setPage(parseInt(newPage));
							}
						}}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.target.blur();
							}
						}}
					/>
					<p className=""> / </p>
					<p className="">{numPages ? numPages : '#'}</p>
					<button onClick={() => setPage(page + 1)} disabled={page === numPages}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.25}
							stroke="currentColor"
							className="h-6 w-6 stroke-neutral-300 transition-all duration-300 ease-in-out hover:stroke-neutral-500"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
						</svg>
					</button>
				</div>
				<div className="flex h-full flex-1 items-center justify-center gap-1">
					<button onClick={() => setZoom(zoom - 0.1)} disabled={zoom < 0.6}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.25}
							stroke="currentColor"
							className="h-6 w-6 stroke-neutral-300 transition-all duration-300 ease-in-out hover:stroke-neutral-500"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
							/>
						</svg>
					</button>

					<button
						className="rounded-md px-2 py-1 transition-all duration-300 ease-in-out hover:bg-neutral-700 hover:bg-opacity-10"
						onClick={() => setZoom(1)}
					>
						{(zoom * 100).toFixed(0)}%
					</button>
					<button onClick={() => setZoom(zoom + 0.1)} disabled={zoom > 2}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.25}
							stroke="currentColor"
							className="h-6 w-6 stroke-neutral-300 transition-all duration-300 ease-in-out hover:stroke-neutral-500"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
							/>
						</svg>
					</button>
				</div>
				<div className="flex h-full flex-1 items-center justify-end gap-1">{children}</div>
			</div>
			<div className="flex w-full flex-col items-center overflow-auto py-4" ref={refContainer}>
				{documentUrl ? (
					<div className="">
						<Document file={documentUrl} onLoadSuccess={onDocumentLoadSuccess} loading={null}>
							<Page pageNumber={page} width={containerWidth} loading={null} />
						</Document>
					</div>
				) : (
					<div className="flex flex-1 items-center justify-center text-neutral-300">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.25}
							stroke="currentColor"
							className="h-10 w-10 animate-spin"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
							/>
						</svg>
					</div>
				)}
			</div>
		</div>
	);
}
