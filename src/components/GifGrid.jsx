import React from 'react';
import Masonry from 'react-masonry-component';
import { Col, Container, Card } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import '../css/GifForm.css';

const GifGrid = (props) => {
  //deconstructing props
  const {
    gifs,
    hasMoreGifs,
    movingThumbnails,
    nextPage,
    toggleLightBox,
  } = props;
  return (
    <Container className="GifGrid">
      {/*infinite scroll implementation*/}
      <InfiniteScroll
        dataLength={gifs.length} //This is important field to render the next data
        next={nextPage} // function to load more data
        hasMore={hasMoreGifs}
        loader={
          <Col md={12}>
            <h4 style={{ textAlign: 'center', color: 'blanchedalmond' }}>
              Loading...
            </h4>
          </Col>
        }
        endMessage={
          <Col md={12}>
            <p style={{ textAlign: 'center', color: 'blanchedalmond' }}>
              <b>Yay! You have seen it all</b>
            </p>
          </Col>
        }
      >
        {/* masonry implementation for accomodating elements of different sizes on a grid*/}
        <Masonry
          className={'my-gallery-class'} // default ''
          elementType={'div'} // default 'div'
          options={{}} // default {}
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
          imagesLoadedOptions={{}} // default {}
        >
          {/* grid elements*/}
          {gifs.map((gif, index) => {
            let thumbnail = '';
            //generate static or moving thumbnails
            if (movingThumbnails) {
              thumbnail = (
                <video className="thumbnail" id={gif.id} autoPlay loop muted>
                  <source src={gif.images.original.mp4}></source>
                </video>
              );
            } else {
              thumbnail = (
                <Card.Img
                  id={gif.id}
                  className="thumbnail"
                  variant="top"
                  src={gif.images['480w_still'].url}
                />
              );
            }
            //add thumbnail to card container
            return (
              <Col key={index} md={4} className="align-middle">
                <Card
                  key={gif.id}
                  style={{ border: 'none', backgroundColor: 'rgba(0,0,0,0)' }}
                  onClick={toggleLightBox}
                >
                  {thumbnail}
                </Card>
              </Col>
            );
          })}
        </Masonry>
      </InfiniteScroll>
    </Container>
  );
};

export default GifGrid;
