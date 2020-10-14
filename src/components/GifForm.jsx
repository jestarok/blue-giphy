import React, { Component, Fragment } from 'react';
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  CardColumns,
  Card,
} from 'react-bootstrap';
import {
  GIPHY_API_KEY,
  GIPHY_SEARCH_URL,
  GIPHY_SEARCH_DEFAULT_OPTIONS,
} from '../Constants';
import LightBox from './LightBox';
const axios = require('axios').default;

class GifForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gif: '',
      gifs: [],
      offset: 0,
      lbActive: false,
      movingThumbnails: false,
      selectedGif: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleLightBox = this.toggleLightBox.bind(this);
    this.toggleMovingThumbnails = this.toggleMovingThumbnails.bind(this);
    this.onPrev = this.onPrev.bind(this);
    this.onNext = this.onNext.bind(this);
  }

  async handleSubmit(e) {
    const { gif, offset } = this.state;
    e.preventDefault();
    let res = '';
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
        res = response.data.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });

    this.setState({ gifs: res });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  toggleMovingThumbnails(event) {
    this.setState({ movingThumbnails: !this.state.movingThumbnails });
  }

  onNext(event) {
    const { gifs, selectedGif } = this.state;
    let index = gifs.findIndex((gif) => gif.id === selectedGif.id);
    if (index < 24) index++;
    this.setState({ selectedGif: gifs[index] });
  }

  onPrev(event) {
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
    const { gifs, gif, movingThumbnails, lbActive, selectedGif } = this.state;
    return (
      <Fragment>
        <Container fluid>
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
          <CardColumns>
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
                <Card key={gif.id} onClick={this.toggleLightBox}>
                  {thumbnail}
                </Card>
              );
            })}
          </CardColumns>

          <LightBox
            isActive={lbActive}
            selectedGif={selectedGif}
            toggleLightBox={this.toggleLightBox}
            onNext={this.onNext}
            onPrev={this.onPrev}
          />
        </Container>
      </Fragment>
    );
  }
}

export default GifForm;
