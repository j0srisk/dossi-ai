import ChatContiner from './ChatContainer';
import PdfContainer from './PdfContainer';
import { useParams } from 'react-router-dom';

const Content = () => {
	const { documentId } = useParams();

	return (
		<div>
			<div className="flex h-screen w-full items-center justify-center text-white p-2 gap-2">
				{documentId && (
					<div className="flex h-full flex-1 flex-col">
						<PdfContainer />
					</div>
				)}
				<div className="flex h-full flex-1 flex-col items-center">
					<ChatContiner />
				</div>
			</div>
		</div>
	);
};

export default Content;
