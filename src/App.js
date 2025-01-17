import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './Components/Register';
import Board from './Components/Board';
import Todolist from './Components/Todolist';
import Comment from './Components/Comment';
import Sidebar from './Components/Sidebar';

import styled from "styled-components";
import LogIn from './Components/Login';
import './App.css';
import SignOut from './Components/SignOut';
import Members from './Components/Members';
const ContentContainer = styled.div`
    margin-left: ${({ sidebarVisible }) => (sidebarVisible ? '220px' : '0')}; /* Adjusted for sidebar width + some spacing */
`;
const AppContent = ({ boards, addBoard }) => {
    const location = useLocation();
    // Determine if the sidebar should be visible based on the current path
    const sidebarVisible = ![ '/', '/Register'].includes(location.pathname);
    return (
        <>
            {sidebarVisible && <Sidebar boards={boards} setBoards={addBoard} />}
            <ContentContainer sidebarVisible={sidebarVisible}>
                <Routes>
                    <Route path="/Board" element={<Board boards={boards} addBoard={addBoard} />} />
                    <Route path='/SignOut' element={<SignOut/>} />
                    <Route path="/Register" element={<Register />} />
                    <Route path="/" element={<LogIn />} />
                    <Route path="/Todolist" element={<Todolist />} />
                    <Route path="/Members" element={<Members />} />



                </Routes>
            </ContentContainer>
        </>
    );
};


const App = () => {
    const [boards, setBoards] = useState([]);
    const [employeeId, setEmployeeId] = useState(null);
    const [employeeName, setEmployeeName] = useState(null);

    useEffect(() => {
        const id = localStorage.getItem('employeeId');
        const name = localStorage.getItem('employeeName');
        console.log("Fetched employeeId:", id);
        console.log("Fetched employeeName:", name);
        if (id && name) {
            setEmployeeId(id);
            setEmployeeName(name);
        }
    }, []);

    const fetchBoards = async () => {
        if (!employeeId || !employeeName) {
            console.error('Employee ID or Name is missing');
            return;
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/get-boards/?employeeId=${employeeId}`
            );

            if (response.ok) {
                const data = await response.json();
                setBoards(data);
            } else {
                const error = await response.json();
                console.error('Failed to fetch boards', error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (employeeId && employeeName) {
            fetchBoards();
        }
    }, [employeeId, employeeName]);

    const addBoard = (newBoard) => {
        const updatedBoards = [...boards, newBoard];
        setBoards(updatedBoards);
    };

    return (
        <Router>
            <AppContent boards={boards} addBoard={addBoard} />
        </Router>
    );
};

export default App;
