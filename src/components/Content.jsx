import ChatContiner from './ChatContainer';
import PdfContainer from './PdfContainer';

const Content = () => (
	<div>
		<div className="flex h-screen w-full items-center justify-center text-white p-2 gap-2">
			<div className="flex h-full flex-1 flex-col">
				<PdfContainer />
			</div>
			<div className="flex h-full flex-1 flex-col">
				<ChatContiner />
			</div>
		</div>
	</div>
);

export default Content;
