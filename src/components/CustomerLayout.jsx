import { Container, Row, Col } from 'react-bootstrap';
import CustomerSidebar from './CustomerSidebar';

function CustomerLayout({ children }) {
    return (
       
        <Row className="">
            <Col sm={12} md={3} lg={3}>
                <CustomerSidebar />
            </Col>
            <Col sm={12} md={9} lg={9}>
                {children}
            </Col>
        </Row>
        
    );
}

export default CustomerLayout;