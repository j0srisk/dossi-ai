import { useState, useRef, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.js',
	import.meta.url,
).toString();

const PdfViewer = ({ url, pageNumber, setRendered }) => {
	const refContainer = useRef();
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	const [numPages, setNumPages] = useState(null);

	function onDocumentLoadSuccess({ numPages: nextNumPages }) {
		console.log('document loaded');
		setNumPages(nextNumPages);
	}

	const handleResize = () => {
		setHeight(refContainer.current.offsetHeight);

		// keeps aspect ratio of 8.5/11
		setWidth((refContainer.current.offsetHeight * 8.5) / 11);
	};

	useEffect(() => {
		if (refContainer.current) {
			handleResize();
		}

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div className="w-fit h-full" ref={refContainer}>
			<>
				<Document
					file={url}
					onLoadSuccess={onDocumentLoadSuccess}
					className={'flex flex-col overflow-hidden items-center justify-center'}
					loading={null}
				>
					{Array.from(new Array(numPages), (el, index) => (
						<Page
							key={`page_${index + 1}`}
							inputRef={(ref) => {
								if (ref && pageNumber === index + 1) {
									ref.scrollIntoView({ behavior: 'smooth' });
								}
							}}
							pageNumber={index + 1}
							height={height}
							width={width}
							loading={null}
							onRenderSuccess={() => {
								if (numPages === index + 1) {
									setRendered(true);
								}
							}}
						/>
					))}
				</Document>
			</>
		</div>
	);
};

export default PdfViewer;
