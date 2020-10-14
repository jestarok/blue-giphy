import React, { Component, Fragment } from 'react';
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap';
import {
  GIPHY_API_KEY,
  GIPHY_SEARCH_URL,
  GIPHY_SEARCH_DEFAULT_OPTIONS,
  MAXGIFAMOUNT,
} from '../Constants';
import LightBox from './LightBox';
//import InfiniteScroll from 'react-infinite-scroller';
import InfiniteScroll from 'react-infinite-scroll-component';
import '../css/GifForm.css';

const axios = require('axios').default;

class GifForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gifs: [],
      gif: '',
      selectedGif: '',
      offset: 0,
      gifAmount: 0,
      lbActive: false,
      movingThumbnails: false,
      hasMoreGifs: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.toggleLightBox = this.toggleLightBox.bind(this);
    this.toggleMovingThumbnails = this.toggleMovingThumbnails.bind(this);
    this.onPrev = this.onPrev.bind(this);
    this.onNext = this.onNext.bind(this);
  }

  async handleSubmit(e) {
    const { gif, offset } = this.state;
    e.preventDefault();
    let gifsFound = '';
    let amountFound = 0;
    let moreGifs = false;
    await axios
      .get(
        GIPHY_SEARCH_URL +
          '?api_key=' +
          GIPHY_API_KEY +
          '&q=' +
          gif +
          '&offset=' +
          offset +
          GIPHY_SEARCH_DEFAULT_OPTIONS
      )
      .then(function (response) {
        // handle success
        console.log(response);
        gifsFound = response.data.data;
        amountFound = response.data.pagination.total_count;
        if (amountFound > 25) {
          moreGifs = true;
        }
        console.log(amountFound);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        gifsFound = [];
      })
      .then(function () {
        // always executed
        console.log(gifsFound.length);
      });

    this.setState({
      gifs: gifsFound,
      offset: 0,
      hasMoreGifs: moreGifs,
      gifAmount: amountFound,
    });
  }

  async nextPage() {
    const { gif, gifs, offset, gifAmount } = this.state;
    let moreGifs = true;
    console.log('called nextpage');
    if (gifs.length === 0) return;
    moreGifs = !(
      offset * 25 >= gifAmount - 24 || gifs.length >= MAXGIFAMOUNT - 24
    );

    console.log('more', gifAmount);
    let res = '';
    await axios
      .get(
        GIPHY_SEARCH_URL +
          '?api_key=' +
          GIPHY_API_KEY +
          '&q=' +
          gif +
          '&offset=' +
          (offset + 1) * 25 +
          GIPHY_SEARCH_DEFAULT_OPTIONS
      )
      .then(function (response) {
        // handle success
        console.log(response);
        console.log(gifs.concat(response.data.data));

        res = gifs.concat(response.data.data);
        if (res.length >= 100) {
          res.splice(50, 20);
        }

        console.log(res);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        res = [];
      })
      .then(function () {
        // always executed
      });

    this.setState({ gifs: res, offset: offset + 1, hasMoreGifs: moreGifs });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  toggleMovingThumbnails() {
    this.setState({ movingThumbnails: !this.state.movingThumbnails });
  }

  onNext() {
    const { gifs, selectedGif } = this.state;
    let index = gifs.findIndex((gif) => gif.id === selectedGif.id);
    if (index < 24) index++;
    this.setState({ selectedGif: gifs[index] });
  }

  onPrev() {
    const { gifs, selectedGif } = this.state;
    let index = gifs.findIndex((gif) => gif.id === selectedGif.id);
    if (index > 0) index--;
    this.setState({ selectedGif: gifs[index] });
  }

  toggleLightBox(event) {
    const { gifs, lbActive } = this.state;
    if (event.target.getAttribute('lbcontrol')) return;
    let selected = gifs.find((gif) => gif.id === event.target.id);
    this.setState({
      lbActive: !lbActive,
      selectedGif: selected ? selected : {},
    });
  }

  render() {
    const {
      gifs,
      gif,
      movingThumbnails,
      lbActive,
      selectedGif,
      hasMoreGifs,
    } = this.state;
    return (
      <Fragment>
        <Container fluid className="FormContainer">
          <h1>Get movin' with some GIFs</h1>
          <Col md={{ span: 2, offset: 5 }} sm={{ span: 12 }}>
            <Row>
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="gif">
                  <Form.Check
                    key={1}
                    type="switch"
                    id="custom-switch"
                    name="movingThumbnails"
                    label="Watch it move"
                    onChange={this.toggleMovingThumbnails}
                    value={movingThumbnails}
                  />
                  <Form.Control
                    onChange={this.handleChange}
                    value={gif}
                    type="text"
                    placeholder="gif"
                    name="gif"
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Search!
                </Button>
              </Form>
            </Row>
          </Col>
          <hr />
        </Container>

        <Container>
          <InfiniteScroll
            dataLength={gifs.length} //This is important field to render the next data
            next={this.nextPage}
            hasMore={hasMoreGifs}
            loader={
              <Col md={12}>
                <h4>Loading...</h4>
              </Col>
            }
            endMessage={
              <Col md={12}>
                <p style={{ textAlign: 'center' }}>
                  <b>Yay! You have seen it all</b>
                </p>
              </Col>
            }
            className="row"
          >
            {gifs.map((gif) => {
              let thumbnail = '';
              if (movingThumbnails) {
                thumbnail = (
                  <video id={gif.id} autoPlay loop muted>
                    <source src={gif.images.original.mp4}></source>
                  </video>
                );
              } else {
                thumbnail = (
                  <Card.Img
                    id={gif.id}
                    variant="top"
                    src={gif.images['480w_still'].url}
                  />
                );
              }
              return (
                <Col key={gif.id} md={4}>
                  <Card key={gif.id} onClick={this.toggleLightBox}>
                    {thumbnail}
                  </Card>
                </Col>
              );
            })}
          </InfiniteScroll>
        </Container>
        <LightBox
          isActive={lbActive}
          selectedGif={selectedGif}
          toggleLightBox={this.toggleLightBox}
          onNext={this.onNext}
          onPrev={this.onPrev}
        />
      </Fragment>
    );
  }
}

export default GifForm;
