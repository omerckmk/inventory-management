// src/components/LocationTabs.js
import React from 'react';

const LocationTabs = ({ setLocation }) => {
    return (
        <div>
            <button onClick={() => setLocation('Apeldoorn')}>Apeldoorn</button>
            <button onClick={() => setLocation('Deventer')}>Deventer</button>
            <button onClick={() => setLocation('Zutphen')}>Zutphen</button>
        </div>
    );
};

export default LocationTabs;
