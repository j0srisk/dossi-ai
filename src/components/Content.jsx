import PdfContainer from './PdfContainer';

const Content = () => (
	<div>
		<div className="flex h-screen items-center justify-center text-white">
			<div className="flex h-screen flex-1 flex-col p-2">
				<PdfContainer />
			</div>
			<div className="flex h-full flex-1 flex-col items-center justify-center bg-red-600"></div>
		</div>
	</div>
);

export default Content;
