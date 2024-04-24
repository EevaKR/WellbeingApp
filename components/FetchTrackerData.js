import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../firebase/Config';

const FetchTrackerData = ({ onDataFetched }) => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date();
                const formattedDate = formatDate(today);
                const q = query(collection(firestore, 'trackers'), where('timestamp', '==', formattedDate));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => {
                    const docData = doc.data();
                    const timestamp = docData.timestamp && typeof docData.timestamp.toDate === 'function' ? docData.timestamp.toDate() : null;
                    return {
                        id: doc.id,
                        ...docData,
                        timestamp: timestamp
                    };
                });
                onDataFetched(data);
            } catch (error) {
                console.error('Error fetching tracker data:', error);
            }
        };

        fetchData();
    }, [onDataFetched]);

    return null;
};

export default FetchTrackerData;

const formatDate = (date) => {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    let day = date.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    return `${year}-${month}-${day}`;
};

