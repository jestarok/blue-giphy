import React from 'react';
import { Fragment } from 'react';
import '../css/LightBox.css';
import { Card } from 'react-bootstrap';

const LightBox = (props) => {
  if (!props.selectedGif.images) return null;
  console.log('from lb ' + props.isActive);
  console.log(props.selectedGif.images);
  let styles = 'LightBox ';
  styles += props.isActive ? 'active' : '';
  return (
    <Fragment>
      <div className={styles} onClick={props.toggleLightBox}>
        <Card>
          {/* <Card.Img variant="top" src={gif.images['480w_still'].url} /> */}
          <video lbcontrol="true" autoPlay loop muted>
            <source
              //   src={
              //     'https://media3.giphy.com/media/Ju7l5y9osyymQ/giphy.mp4?cid=9adecad76qh6wkigywkkpbtzbv9dapbi5hmr880hs1zgqc68&rid=giphy.mp4'
              //   }
              //   src={
              //     'https://media4.giphy.com/media/kiJEGxbplHfT5zkCDJ/giphy.mp4?cid=9adecad7gpu6w50pm10i56xg4xzp56lepo38j4foi24ol69c&rid=giphy.mp4'
              //   }
              src={props.selectedGif.images.original.mp4}
            ></source>
          </video>
        </Card>
      </div>
    </Fragment>
  );
};

export default LightBox;
