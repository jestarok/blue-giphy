import React, { Component, Fragment } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import {
  GIPHY_API_KEY,
  GIPHY_SEARCH_URL,
  GIPHY_SEARCH_DEFAULT_OPTIONS,
  MAXGIFAMOUNT,
} from '../Constants';
import LightBox from './LightBox';
import GifGrid from './GifGrid';
import '../css/GifForm.css';

const axios = require('axios').default;

class GifForm extends Component {
  constructor(props) {
    super(props);
    //initializing values
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

    //binding context to functions
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.toggleLightBox = this.toggleLightBox.bind(this);
    this.toggleMovingThumbnails = this.toggleMovingThumbnails.bind(this);
    this.onPrev = this.onPrev.bind(this);
    this.onNext = this.onNext.bind(this);
  }

  render() {
    //deconstructing state
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
              {/* gif searching form */}
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="gif">
                  {/* moving-static thumbnail switch */}
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
        {/* grid to show search results */}
        <GifGrid
          gifs={gifs}
          hasMoreGifs={hasMoreGifs}
          movingThumbnails={movingThumbnails}
          nextPage={this.nextPage}
          toggleLightBox={this.toggleLightBox}
        />
        {/* LightBox implementation */}
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

  //handle initial gif search and api call
  async handleSubmit(e) {
    const { gif, offset } = this.state;
    //prevent default submit behavior
    e.preventDefault();
    let gifsFound = '';
    let amountFound = 0;
    let moreGifs = false;
    //send api request with axios
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
        gifsFound = response.data.data;
        amountFound = response.data.pagination.total_count;
        //if initial fetch results > 25 enable further requests
        if (amountFound > 25) {
          moreGifs = true;
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        //reset values if an error ocurrs
        gifsFound = [];
      })
      .then(function () {
        // always executed
      });
    //update state
    this.setState({
      gifs: gifsFound,
      offset: 0,
      hasMoreGifs: moreGifs,
      gifAmount: amountFound,
    });
  }
  //handle further requests
  async nextPage() {
    const { gif, gifs, offset, gifAmount } = this.state;
    let moreGifs = true;
    if (gifs.length === 0) return;
    //check agains limits to see if there are more gifs to show
    moreGifs = !(
      offset * 25 >= gifAmount - 24 || gifs.length >= MAXGIFAMOUNT - 24
    );

    let res = '';
    //send request with offset for new data set
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
        //append new results
        res = gifs.concat(response.data.data);
        //when over 100 gifs on screen, delete some while loading more to save some memory while showing more results
        //result collection will be reduced by 20 while adding 25 more growing up to the max size defined in constans.js
        if (res.length >= 100) {
          res.splice(50, 20);
        }
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

  //handle text input value
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  //handle switch input value
  toggleMovingThumbnails() {
    this.setState({ movingThumbnails: !this.state.movingThumbnails });
  }

  //show next gif on lightbox
  onNext() {
    const { gifs, selectedGif } = this.state;
    let index = gifs.findIndex((gif) => gif.id === selectedGif.id);
    if (index < gifs.length - 1) index++;
    this.setState({ selectedGif: gifs[index] });
  }

  //show previous gif on lightbox
  onPrev() {
    const { gifs, selectedGif } = this.state;
    let index = gifs.findIndex((gif) => gif.id === selectedGif.id);
    if (index > 0) index--;
    this.setState({ selectedGif: gifs[index] });
  }

  //activate-deactivate lightbox
  toggleLightBox(event) {
    const { gifs, lbActive } = this.state;
    //if lbcontrol do nothing
    if (event.target.getAttribute('lbcontrol')) return;
    //if clicked a gif find its data and set as selected
    let selected = gifs.find((gif) => gif.id === event.target.id);
    this.setState({
      lbActive: !lbActive,
      selectedGif: selected ? selected : {},
    });
  }
}

export default GifForm;
