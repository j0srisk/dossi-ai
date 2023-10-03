import { useState, useRef, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.js',
	import.meta.url,
).toString();

const PdfViewer = ({ url, pageNumber, setPageNumber }) => {
	const refContainer = useRef();
	const refDocument = useRef();
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	const [numPages, setNumPages] = useState(null);

	console.log('pageNumber: ', pageNumber);

	function onDocumentLoadSuccess({ numPages: nextNumPages }) {
		setNumPages(nextNumPages);
	}

	const handleResize = () => {
		//setWidth(refContainer.current.offsetWidth);
		setHeight(refContainer.current.offsetHeight);

		// keeps aspect ratio of 8.5/11
		setWidth((refContainer.current.offsetHeight * 8.5) / 11);
	};

	useEffect(() => {
		if (refContainer.current) {
			handleResize();
		}

		if (refDocument.current) {
			console.log(refDocument.current);
		}

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		console.log('resetting page number');
		if (pageNumber) {
			setPageNumber(null);
		}
	}, [pageNumber, setPageNumber]);

	return (
		<>
			<div className="w-fit h-full" ref={refContainer}>
				<Document
					file={url}
					onLoadSuccess={onDocumentLoadSuccess}
					className={'flex flex-col gap-2 overflow-hidden'}
					ref={refDocument}
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
						/>
					))}
				</Document>
			</div>
		</>
	);
};

export default PdfViewer;
