import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { BrowserRouter ,Routes,Route,Link} from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function ManageNovelitem() {
  return (
    <>
          <Row >
                            <Col sm={2} className='m-2'>
                                <Card as={Link} to="/naveldetail">
                                    <Card.Img variant="top" src="/images/b1.png" />
                                    <Card.Body>
                                    <Card.Text>
                                        Title
                                    </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col sm={2} className='m-2'>
                                <Card >
                                    <Card.Img variant="top" src="/images/b1.png" />
                                    <Card.Body>
                                    <Card.Text>
                                        Title
                                    </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col sm={2} className='m-2'>
                                <Card >
                                    <Card.Img variant="top" src="/images/b1.png" />
                                    <Card.Body>
                                    <Card.Text>
                                    Title
                                    </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col sm={2} className='m-2'>
                                <Card >
                                    <Card.Img variant="top" src="/images/b1.png" />
                                    <Card.Body>
                                    <Card.Text>
                                    Title
                                    </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col sm={2} className='m-2'>
                                <Card >
                                    <Card.Img variant="top" src="/images/b1.png" />
                                    <Card.Body>
                                    <Card.Text>
                                    Title
                                    </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col sm={2} className='m-2'>
                                <Card >
                                    <Card.Img variant="top" src="/images/b1.png" />
                                    <Card.Body>
                                    <Card.Text>
                                        Some quick
                                    </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col sm={2} className='m-2'>
                                <Card >
                                    <Card.Img variant="top" src="/images/b1.png" />
                                    <Card.Body>
                                    <Card.Text>
                                        Some quick
                                    </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>   
            </Row>
    </>
    

  );
}

export default ManageNovelitem;