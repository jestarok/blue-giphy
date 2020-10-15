import React from 'react';
import { Fragment } from 'react';
import '../css/LightBox.css';
import { Card, Button } from 'react-bootstrap';

const LightBox = (props) => {
  const { onNext, onPrev, toggleLightBox, selectedGif, isActive } = props;
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      console.log(event.key);
      switch (event.key) {
        case 'ArrowLeft':
          console.log('prev');
          onPrev();
          break;
        case 'ArrowRight':
          onNext();
          break;
        case 'Escape':
          toggleLightBox(event);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // cleanup this component
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNext, onPrev, toggleLightBox]);

  if (!selectedGif.images) return null;
  let styles = 'LightBox ';
  styles += isActive ? 'active' : '';
  return (
    <Fragment>
      <div className={styles} onClick={toggleLightBox}>
        <Button
          lbcontrol="true"
          className="lbControl"
          onClick={onPrev}
          size="lg"
        >
          {'<'}
        </Button>
        <Card>
          <video key={selectedGif.id} lbcontrol="true" autoPlay loop muted>
            <source src={selectedGif.images.original.mp4}></source>
          </video>
        </Card>
        <Button
          lbcontrol="true"
          className="lbControl"
          onClick={onNext}
          size="lg"
        >
          {'>'}
        </Button>
      </div>
    </Fragment>
  );
};

export default LightBox;
