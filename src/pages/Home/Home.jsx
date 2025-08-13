import React from 'react';
import HeroSection from './HeroSection';
import ThesisWorkflow from './ThesisWorkFlow';
import RecentFAQs from './RecentFAQs';

const Home = () => {
    return (
        <div>
            <HeroSection></HeroSection>
            <ThesisWorkflow></ThesisWorkflow>
            <RecentFAQs></RecentFAQs>
        </div>
    );
};

export default Home;