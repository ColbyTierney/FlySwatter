import React from 'react';
import Sidebar from '../components/Sidebar';
import './About.css';

const About = () => {
    return (
        <div>
            <Sidebar />
            <h1>About Us</h1>

            <div className="image-container">
                <div className="image">
                    <img src="/LiterallyMe.jpg" alt="Photo 1" />
                    <h3 className="image-header">
                        Schizophrenic
                        <p className="image-text">Cogito Ergo Sum</p>
                    </h3>
                </div>
                <div className="image">
                    <img src="/Colby.jpg" alt="Photo 2" />
                    <h3 className="image-header">
                        Average Comp Sci Enjoyer
                        <p className="image-text">Also Doctor Who fanatic</p>
                    </h3>
                </div>
                <div className="image">
                    <img src="/Kaylee.jpg" alt="Photo 3" />
                    <h3 className="image-header">
                        Masters in CS
                        <p className="image-text">Does not know how to replace <br/> smoke alarm batteries</p>
                    </h3>
                </div>
                <div className="image">
                    <img src="/Leo.jpg" alt="Photo 4" />
                    <h3 className="image-header">
                        ???
                        <p className="image-text">Brazilians can double jump</p>
                    </h3>
                </div>
            </div>
        </div>
    )
}

export default About;