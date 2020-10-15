import React from 'react';
import { Fragment } from 'react';
import '../css/LightBox.css';
import { Card, Button } from 'react-bootstrap';

const LightBox = (props) => {
  const { onNext, onPrev, toggleLightBox, selectedGif, isActive } = props;
  //react hook for event handling
  React.useEffect(() => {
    //key down event handler
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
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
    //event listener implementation
    window.addEventListener('keydown', handleKeyDown);
    // cleanup this component
    return () => {
      //event listener removal
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNext, onPrev, toggleLightBox]);

  if (!selectedGif.images) return null;
  let styles = 'LightBox ';
  styles += isActive ? 'active' : '';

  return (
    <Fragment>
      <div className={styles} onClick={toggleLightBox}>
        {/* lightbox control */}
        <Button
          lbcontrol="true"
          className="lbControl"
          onClick={onPrev}
          size="lg"
        >
          {'<'}
        </Button>
        {/* Gif container */}
        <Card>
          <video key={selectedGif.id} lbcontrol="true" autoPlay loop muted>
            <source src={selectedGif.images.original.mp4}></source>
          </video>
        </Card>

        {/* lightbox control */}
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
