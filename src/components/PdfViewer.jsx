import { useState, useRef, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.js',
	import.meta.url,
).toString();

const PdfViewer = ({ url }) => {
	const refContainer = useRef();
	const [width, setWidth] = useState(0);
	const [numPages, setNumPages] = useState(null);

	function onDocumentLoadSuccess({ numPages: nextNumPages }) {
		setNumPages(nextNumPages);
	}

	const handleResize = () => {
		setWidth(refContainer.current.offsetWidth);
	};

	useEffect(() => {
		if (refContainer.current) {
			setWidth(refContainer.current.offsetWidth);
		}

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div className="w-full" ref={refContainer}>
			<Document
				file={url}
				onLoadSuccess={onDocumentLoadSuccess}
				className={'flex flex-col gap-2 overflow-hidden rounded-md'}
			>
				{Array.from(new Array(numPages), (el, index) => (
					<Page key={`page_${index + 1}`} pageNumber={index + 1} width={width} />
				))}
			</Document>
		</div>
	);
};

export default PdfViewer;
