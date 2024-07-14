import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';

const FortBulb = () => {
    return (
        <div>
            <FontAwesomeIcon icon={faLightbulb} className="text-xl text-green-400 hover:text-green-700" />
        </div>
    );
};

export default FortBulb;
