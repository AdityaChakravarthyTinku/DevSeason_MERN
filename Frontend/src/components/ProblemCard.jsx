import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProblemCard = ({ problem }) => {
  const { ojid, title, topic, difficulty } = problem;
  const difficultyColors = {
    easy: 'text-green-500',
    medium: 'text-orange-500',
    hard: 'text-red-500',
  };

  return (
    <Link to={`/problem-page/${ojid}`} className="block mb-4 p-4 border rounded-md shadow hover:bg-gray-100">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p>{topic}</p>
        </div>
        <p className={`font-bold ${difficultyColors[difficulty]}`}>{difficulty}</p>
      </div>
    </Link>
  );
};

ProblemCard.propTypes = {
  problem: PropTypes.shape({
    ojid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    topic: PropTypes.string.isRequired,
    difficulty: PropTypes.oneOf(['easy', 'medium', 'hard']).isRequired,
  }).isRequired,
};

export default ProblemCard;
