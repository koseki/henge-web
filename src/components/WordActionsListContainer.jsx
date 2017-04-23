import { connect } from 'react-redux';
import WordActionsList from './WordActionsList.jsx';
import * as actions from '../actions/Actions.jsx';

const mapStateToProps = (state) => {
  return {
    wordAction: state.circle.wordAction,
    wordActionKeyword: state.circle.wordActionKeyword,
    storyLines: state.circle.storyLines,
    mode: state.circle.mode,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClickWordAction: (name) => {
      dispatch(actions.switchWordAction(name));
    },
    onChangeWordActionKeyword: (name) => {
      dispatch(actions.updateWordActionKeyword(name));
    },
    onClickStory: () => {
      dispatch(actions.storyMode());
    },
    onClick3D: () => {
      dispatch(actions.threeDMode());
    },
    onClickCircleModeButton: () => {
      dispatch(actions.circleMode());
    }
  }
}

const WordActionsListContainer = connect(mapStateToProps, mapDispatchToProps)(WordActionsList);
export default WordActionsListContainer;
