import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

export const tag = (tagName: string) => {
    return (
        <>
            <span className="flex items-center gap-2 px-3 py-2 bg-gray-500 rounded-full text-white text-sm transition-all duration-300 ease-in-out hover:translate-y-[-3px] hover:shadow-[0_5px_15px_rgba(0,_255,_255,_0.3)]" title={tagName}>
                <FontAwesomeIcon icon={faGithub} width={50} height={50} /> 
            </span>
        </>
    );
} 
