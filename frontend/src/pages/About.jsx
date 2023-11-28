import React from 'react';
import Sidebar from '../components/Sidebar';
import './About.css';

const About = () => {
    return (
        <div>
            <Sidebar />
            <h1>About Us</h1>

            <p>
                Fly Swatter is dedicated to helping our users keep track and manage bugs and other issues in their code.
                <br/>
                Although It's primary use is for  tracking bugs, it can also be used to organize the implementation of new features
                <br/>
                onto the user's project, by keeping track of what needs to be implemented sorted by priority.
            </p>
        </div>
    )
}

export default About;
