import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './style/NovelItem.css'


function Novelitem(props) {

    return (
        <>
            <Row className='itemcontrol m-3'>
                {props.novelList?.data?.map((item, index) => (
                    <Col key={item.fictionID} sm={4} md={3} lg={2}>
                        <Card as={Link} to={`/novelcontent/${item.fictionID}`}>
                            <Card.Img variant="top" src={item.picture}  style={{ alignSelf: 'center', resizeMode: 'cover', }} />
                            <Card.Body>
                                <Card.Text>
                                    {item.fictionName}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>


    );
}

export default Novelitem;