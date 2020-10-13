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
      selectedGif: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleLightBox = this.toggleLightBox.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    let res = '';
    await axios
      .get(
        GIPHY_SEARCH_URL +
          '?api_key=' +
          GIPHY_API_KEY +
          '&q=' +
          this.state.gif +
          '&offset=' +
          this.state.offset +
          GIPHY_SEARCH_DEFAULT_OPTIONS
      )
      .then(function (response) {
        // handle success
        // console.log(response.data.data);
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

  toggleLightBox(event) {
    if (event.target.getAttribute('lbcontrol')) return;
    let selected = this.state.gifs.find((gif) => gif.id === event.target.id);
    this.setState({
      lbActive: !this.state.lbActive,
      selectedGif: selected ? selected : {},
    });
  }

  render() {
    return (
      <Fragment>
        <Container fluid>
          <h1>Get movin' with some GIFs</h1>
          <Col md={{ span: 2, offset: 5 }} sm={{ span: 12 }}>
            <Row>
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="gif">
                  <Form.Label>Watch it move</Form.Label>
                  <Form.Control
                    onChange={this.handleChange}
                    value={this.state.gif}
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

          <CardColumns>
            {this.state.gifs.map((gif) => {
              return (
                <Card key={gif.id} onClick={this.toggleLightBox}>
                  <Card.Img
                    id={gif.id}
                    variant="top"
                    src={gif.images['480w_still'].url}
                  />
                  <video id={gif.id} autoPlay loop muted>
                    <source src={gif.images.original.mp4}></source>
                  </video>
                </Card>
              );
            })}
          </CardColumns>

          <LightBox
            isActive={this.state.lbActive}
            selectedGif={this.state.selectedGif}
            toggleLightBox={this.toggleLightBox}
          />
        </Container>
      </Fragment>
    );
  }
}

export default GifForm;
