import React, { createContext, useState, useContext } from 'react';

const DemandContext = createContext({});

export function DemandProvider({ children }) {
    const [demands, setDemands] = useState([]);

    const addDemand = (demand) => {
        setDemands(prev => [demand, ...prev]);
    };

    const updateDemandStatus = (id, newStatus) => {
        setDemands(prev =>
            prev.map(demand =>
                demand.id === id ? { ...demand, status: newStatus } : demand
            )
        );
    };

    const editDemand = (id, storeName, info) => {
        setDemands(prev =>
            prev.map(demand =>
                demand.id === id ? { ...demand, storeName, info } : demand
            )
        );
    };

    const deleteDemand = (id) => {
        setDemands(prev => prev.filter(demand => demand.id !== id));
    };

    return (
        <DemandContext.Provider value={{ demands, addDemand, updateDemandStatus, editDemand, deleteDemand }}>
            {children}
        </DemandContext.Provider>
    );
}

export const useDemands = () => useContext(DemandContext);
